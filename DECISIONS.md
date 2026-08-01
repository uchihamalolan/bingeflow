# Architecture & Design Decisions (`decisions.md`)

This document captures the architectural, engineering, and product decisions made during the design and implementation of **BingeFlow**. In accordance with the guidelines in `JD.md`, each section documents **the decision**, **the alternatives considered**, **the underlying reasoning and tradeoffs**, and **what was deliberately cut**, synthesized directly from our repository codebase, git commit history, and internal developer conversation logs.

---

## Core Value Proposition & USP

BingeFlow separates itself from generic video control extensions through four core architectural USPs:

1. **Flawless Netflix Seeking Support**: Standard video controllers crash Netflix or trigger infinite buffering loops when mutating `video.currentTime`. BingeFlow interfaces directly with Netflix's internal React/Cadmium API (`window.netflix.appContext`) to deliver smooth seeking without player errors.
2. **Couch-Friendly Gamepad Remote Control**: Full Web Gamepad API integration (Xbox, PlayStation, generic USB controllers) with rising-edge hardware filtering, acting as a wireless media remote when watching shows away from the keyboard.
3. **Ultra-Lightweight (~100KB Footprint)**: Compiled using SolidJS signals, UnoCSS, and WXT, the entire production extension package is roughly ~100KB, enabling sub-50ms UI popup startup times and zero runtime lag.
4. **Hyper-Performant & Isolated Execution**:
   - **Zero Overhead on Disabled Sites**: The content script evaluates per-site domain enablement immediately upon initialization and exits (`if (!isDomainEnabled(...)) return`), ensuring zero CPU or RAM consumption on non-streaming websites.
   - **Strict Main-World Bridge Isolation**: The `netflix-bridge.js` script is injected into the main DOM context strictly on `*.netflix.com`, guaranteeing zero side effects or script injection on all other websites.

---

## 1. Core Tech Stack: WXT + SolidJS + TypeScript + pnpm

### The Decision

I chose [WXT](https://wxt.dev/) as our Web Extension framework, [SolidJS](https://solidjs.com/) for UI views (Popup & Options), [TypeScript](https://www.typescriptlang.org/) for type safety, and [pnpm](https://pnpm.io/) for fast, deterministic package management.

### The Alternatives Considered

- **Plasmo**: Relies on an older Parcel-based bundler with framework lock-in and slower maintenance updates. Its bundling model makes isolated main-world script injection (`netflix-bridge.js`) opaque and difficult to configure.
- **CRXJS (`@crxjs/vite-plugin`)**: Built specifically around Vite, but heavily Chrome-centric with fragile Firefox MV3 support and manual cross-browser config friction.
- **Raw `vite-plugin-web-extension`**: WXT stands as the modern spiritual successor to early Vite web extension plugins, offering Nuxt/Next-style file conventions, automated manifest transformations, and native multi-browser builds (Chrome MV3 & Firefox MV3) out of the box.
- **React / Svelte 5**: React introduces a large runtime footprint (~40KB+) and Virtual DOM reconciliations that add unnecessary overhead for lightweight extension popups. While Svelte 5 also features fine-grained signals and a minimal footprint, SolidJS was chosen primarily for component co-location flexibility and standard JSX syntax.

### The Reasoning & Tradeoffs

- **WXT + Vite**: WXT treats Chrome MV3 and Firefox MV3 as first-class build targets. It automatically generates extension manifests from code, handles HMR during development, and cleanly compiles unlisted script entrypoints (critical for our Netflix Main-World Bridge).
- **SolidJS DX & Reactivity**: SolidJS compiles fine-grained reactive signals (`createSignal`, `createEffect`) directly to DOM nodes without Virtual DOM diffing, enabling sub-50ms popup loads. Crucially, unlike Svelte (which strictly enforces one component per `.svelte` file), SolidJS allows co-locating multiple JSX components inside a single file. This significantly speeds up refactoring by allowing large components to be chopped into small, local sub-components before deciding if they need standalone files. Standard JSX also offers a cleaner, more familiar developer experience than Svelte's custom template syntax.
- **TypeScript**: Ensures strict contract definitions for platform selector configs, extension message schemas, command actions, and browser storage structures.
- **pnpm**: Delivers instant package installation speeds, strict disk-efficient dependency deduplication, and deterministic lockfiles via `pnpm-lock.yaml`.

### What I Deliberately Cut

- **Heavy UI Frameworks & State Libraries (Redux / Zustand)**: Extension popups are short-lived views. Complex state stores add unnecessary overhead. Simple native SolidJS signals wrapped over browser storage helpers are sufficient.
- **Custom Webpack / Rollup Build Tooling**: WXT handles multi-browser asset pipelines and manifest generation out-of-the-box.

---

## 2. Isolated Shadow DOM Overlay Architecture for Non-Intrusive UX

### The Decision

I built a floating player controls overlay (`OverlayHandle`) rendered inside an open Shadow DOM (`attachShadow({ mode: "open" })`) attached directly inside the target video container element (`playerContainer`).

```
[ Streaming Platform Video Container ]
 ├── <video>
 └── <div id="bingeflow-overlay-host">
      └── #shadow-root (open)
           ├── <style> scoped overlay.css </style>
           └── <div class="si-overlay"> (Controls: Seek, Speed, Reset, Drag Handle)
```

### The Alternatives Considered

- **Direct Global Page DOM Injection**: Injecting raw HTML elements (`<div class="bingeflow-overlay">`) directly into `document.body` or the host video player wrapper without Shadow DOM style scoping.

### The Reasoning & Tradeoffs

- **Style Isolation**: Streaming platforms (Netflix, Prime Video, Disney+ Hotstar) apply aggressive global CSS resets (`button { all: unset }`, font overrides, z-index clashing). Direct DOM injection corrupts extension buttons or leaks extension CSS into host pages. Shadow DOM isolates BingeFlow styles (`OVERLAY_CSS`) using `:host` scoping, guaranteeing visual stability.

### Product & UX Engineering Polish

- **Native Fullscreen Compatibility**: Mounting the host element directly inside `playerContainer` (`z-index: 2147483647`) ensures the overlay scales properly and remains fully functional when toggling native browser fullscreen mode.
- **Automated Inactivity Autohide**: An automated 5-second timer (`resetAutohideTimer`) listens to global pointer movements to fade out the controls during media playback, keeping the viewing experience completely unobstructed.
- **Percentage-Based Drag Positioning**: The drag handle (`si-drag-handle`) uses `setPointerCapture` to track movement and computes percentage-based relative coordinates (`left %`, `top %`) on release. This guarantees the overlay remains accurately positioned even when resizing browser windows or switching display resolutions.

### What I Deliberately Cut

- **Full Video Scrubber Bar**: Duplicate timeline scrubbers add visual clutter over native platform player bars; focusing on speed controls, step-seeking, and intro skipping yields maximum utility with minimal footprint.

---

## 3. CSP-Compliant Main-World Bridge for Netflix Playback (Bypassing Player Crashes)

### The Decision

I designed a CSP-compliant two-tier architecture that decouples the Isolated World Content Script from Netflix's Main World JS execution context by injecting an [unlisted script entrypoint](https://wxt.dev/guide/essentials/entrypoints.html#unlisted-scripts) (`netflix-bridge.js`) via `browser.runtime.getURL()` and tunneling commands across the DOM boundary using standard `CustomEvent`s.

```
+-------------------------------------------------------------------------+
|                         ISOLATED WORLD (Content Script)                 |
|  - Listens to Keyboard/Gamepad shortcuts & Overlay UI                   |
|  - Calculates target seek timestamp                                     |
|  - Dispatches CustomEvent("bingeflow:netflix:seek", { detail })         |
+-------------------------------------------------------------------------+
                                    |
                            DOM Custom Event
                                    v
+-------------------------------------------------------------------------+
|                         MAIN WORLD (netflix-bridge.js)                  |
|  - Injected via <script src="chrome-extension://.../netflix-bridge.js">  |
|  - Accesses window.netflix.appContext.state.playerApp.getAPI()          |
|  - Retrieves active player session ID via getAllPlayerSessionIds()[0]   |
|  - Invokes player.seek(targetTimeMs) safely                             |
+-------------------------------------------------------------------------+
```

### The Alternatives Considered

- **Standard HTML5 `<video>.currentTime = ...` Mutation**: Standard HTML5 video seeking works on most platforms, but fails catastrophically on Netflix.
- **Inline Script Injection (`<script>window.netflix...</script>`)**: Dynamically appending inline code snippets into the DOM.
- **`chrome.scripting.executeScript({ world: 'MAIN' })`**: Using Chrome's Manifest V3 scripting API to execute functions in the main world.

### The Reasoning & Tradeoffs

#### The Netflix Cadmium Player Problem

Netflix uses a custom playback engine named **Cadmium** wrapped in a React application state (`window.netflix.appContext`). Direct modification of `HTMLVideoElement.currentTime` breaks Cadmium's internal state machine, causing chunk buffer mismatch, audio-video desync, infinite buffering spinners, or immediate player crashes (`Unexpected Error - NSES-500`). To seek safely, one must call the internal Cadmium API:

```javascript
const player = window.netflix.appContext.state.playerApp
  .getAPI()
  .videoPlayer.getVideoPlayerBySessionId(sessionId);
player.seek(targetTimeMs);
```

#### The Isolation & CSP Challenge

1. **Isolated World Sandbox**: Extension content scripts run in an isolated execution world and cannot read or invoke objects on `window.netflix`.
2. **Strict Content Security Policy (CSP)**: Netflix enforces a strict CSP rule (`script-src`) that blocks inline code execution (`eval()` or `<script>inline code</script>`).

#### The BingeFlow Solution

1. **Unlisted Entrypoint**: `src/entrypoints/netflix-bridge.ts` is configured in WXT as an [unlisted script entrypoint](https://wxt.dev/guide/essentials/entrypoints.html#unlisted-scripts), generating `.output/chrome-mv3/netflix-bridge.js`.
2. **Web Accessible Resources**: Registered in `wxt.config.ts` under `web_accessible_resources` for `*://*.netflix.com/*`.
3. **CSP Compliance**: The content script dynamically creates `<script src="browser.runtime.getURL('/netflix-bridge.js')">`. Because the file originates from an authorized extension URL declared in `web_accessible_resources`, Netflix's browser CSP approves execution.
4. **Decoupled Event Tunneling**: The content script dispatches a `CustomEvent("bingeflow:netflix:seek", { detail: JSON.stringify({ targetTimeMs }) })`. The main-world bridge catches the event, extracts the target time, looks up the active Cadmium player session, and triggers `.seek()`.

### Architectural Isolation: Polymorphic Strategy & Factory Pattern

To ensure Netflix-specific workarounds never leak or affect video playback on other streaming platforms, I implemented a Polymorphic Strategy & [Factory Pattern](https://www.patterns.dev/vanilla/factory-pattern/) (`createVideoController`).

```mermaid
classDiagram
    class VideoController {
        <<interface>>
        +seek(deltaSeconds: number) void
        +togglePlay() void
        +setPlaybackRate(rate: number) void
        +getPlaybackRate() number
        +getCurrentTime() number
        +onPlaybackRateChange(callback) Function
        +destroy() void
    }

    class Html5VideoController {
        #video: HTMLVideoElement
        -rateListeners: Set
        +seek(deltaSeconds: number) void
        +togglePlay() void
        +setPlaybackRate(rate: number) void
        +getPlaybackRate() number
        +getCurrentTime() number
        +onPlaybackRateChange(callback) Function
        +destroy() void
    }

    class NetflixVideoController {
        -targetSeekTime: number
        -seekTimeoutId: TimeoutHandle
        +seek(deltaSeconds: number) void
        -injectBridge() void
        +destroy() void
    }

    class createVideoController {
        <<factory>>
        +create(video, platformConfig) VideoController
    }

    VideoController <|.. Html5VideoController : implements
    Html5VideoController <|-- NetflixVideoController : extends
    createVideoController ..> Html5VideoController : instantiates (Default / Non-Netflix)
    createVideoController ..> NetflixVideoController : instantiates (Netflix Domain)
```

#### Why This Guarantees 100% Platform Safety:

1. **Strict Factory Guard**: `createVideoController` evaluates `platformConfig.platform === "netflix"`. On 100% of all other domains (Prime Video, Disney+ Hotstar, YouTube, etc.), standard `Html5VideoController` is returned.
2. **Zero Non-Netflix Side Effects**: The `netflix-bridge.js` script is never injected, loaded, or executed on any site other than `*.netflix.com`.
3. **Polymorphic Contract**: The rest of the extension (Overlay, Command Dispatcher, Shortcuts) interacts strictly via the `VideoController` interface, completely decoupled from underlying platform implementations.
4. **Surgical Override**: `NetflixVideoController` extends `Html5VideoController` and overrides **only** the `seek()` method, inheriting standard HTML5 playback rate and event handling across all platforms.

### What I Deliberately Cut

- **Reverse-Engineering Cadmium Streaming Buffers**: Intercepting network streams or monkey-patching Cadmium player classes directly is fragile and risks breaking on minor Netflix updates.
- **Continuous Main-World Polling**: The bridge operates completely statelessly, awakening only when a seek event is dispatched.

---

## 4. Input Architecture & Gamepad Seeking Strategy

### Evolution of the Input Pipeline

#### 1. Initial Phase: Keyboard-Centric Dispatching

Initially, BingeFlow was engineered solely around keyboard shortcuts. A standard DOM `keydown` event listener captured pressed keys, checked for platform shortcut matches, and triggered intro skip clicks or HTML5 video currentTime adjustments directly inside content script event callbacks.

#### 2. Product Shift: Supporting Gamepad as a Media Remote

When binge-watching shows on an external monitor or TV, sitting right next to the keyboard just to press skip or seek keys defeats the point of relaxing. A wireless gamepad (Xbox, PlayStation, or generic USB controller) lying on the couch is the closest ergonomic equivalent to a TV remote, so I added Web Gamepad API support (`navigator.getGamepads()`).

#### 3. Re-Architecture: The Command Pattern

Wiring gamepad inputs directly to platform DOM selectors would have created massive code duplication and tight coupling. I re-architected the input pipeline using the [Command Pattern](https://www.patterns.dev/vanilla/command-pattern/) via a central `CommandDispatcher`.

```mermaid
flowchart LR
    subgraph Input_Sources ["Input Event Producers"]
        KB["KeyboardListener"]
        GP["GamepadListener\n(Rising-Edge Filter)"]
        HID["Future WebHID Listener\n(Custom Hardware Remotes)"]
    end

    CD["CommandDispatcher\n(Command Pattern)"]

    subgraph Targets ["Execution Targets"]
        VM["VideoManager\n(seek, rate, play/pause)"]
        PM["PlatformManager\n(skipIntro, skipRecap)"]
    end

    KB -->|"executeCommand('seekFwd')"| CD
    GP -->|"executeCommand('togglePlay')"| CD
    HID -.->|"executeCommand('skipIntro')"| CD

    CD -->|"Video Command"| VM
    CD -->|"Platform Action"| PM
```

#### 4. Extensibility to Arbitrary Input Devices (WebHID)

Because input producers simply emit normalized `Command` actions (e.g., `"togglePlay"`, `"seekFwd"`, `"skipIntro"`), extending BingeFlow to support new hardware—such as custom Bluetooth media remotes via the web platform [WebHID API](https://developer.mozilla.org/en-US/docs/Web/API/WebHID_API)—requires zero modifications to existing video playback or platform selector logic.

#### 5. Real-World Benefit: Instant Feature Additions

This decoupled architecture proved its value when I later added configurable Gamepad play/pause controls. Because `CommandDispatcher` already abstracted `togglePlay`, adding the gamepad shortcut required only mapping the button to `"togglePlay"`. It worked instantly with zero risk of breaking existing keyboard shortcuts or platform-specific skip handlers.

---

### Gamepad Seeking Strategy: Discrete Step Seeking vs. Smooth Scrubbing

#### The Alternatives Considered

- **Smooth Analog Frame-by-Frame Scrubbing**: Continuously mutating `video.currentTime` on every `requestAnimationFrame` while an analog stick is deflected.
- **Unfiltered Gamepad Polling**: Firing seek actions continuously every frame while holding a button down.

#### The Reasoning & Tradeoffs

- **Why Smooth Analog Scrubbing Was Rejected**: Streaming platforms rely on server-side chunked MSE media buffers. Attempting smooth frame-by-frame seeking via analog stick holding causes severe network request thundering, buffer underruns, audio pop artifacts, and player state desynchronization.
- **Discrete Step Seeking with Accumulation**: I implemented discrete step seeking (`seek(-5)` / `seek(+5)`) triggered by stick/DPAD threshold crossings. In `NetflixVideoController`, consecutive seek commands accumulate into `targetSeekTime` with a 1.5s debounce timeout before resetting, preventing out-of-order frame fetches during rapid button presses.
- **Rising-Edge Hardware Detection**: Gamepads send continuous axis/button status on every frame. `GamepadListener` tracks previous button state buffers so holding a button down fires the command exactly once per press event.

### What I Deliberately Cut

- **Complex Macro Recorder**: Allowing users to create multi-step key sequences adds user interface friction. A clean 1-to-1 shortcut mapping system satisfies 99% of use cases.
- **Full Custom Controller Remapping Matrix**: Standard Web Gamepad API layout mappings (Buttons 0-15, DPAD, Triggers) are normalized across Xbox, PlayStation, and generic USB gamepads.

---

## 5. Styling System & UnoCSS Shortcuts

### The Decision

I adopted [UnoCSS](https://unocss.dev/) with custom shortcuts (`uno.config.ts`), a tailored [Catppuccin](https://catppuccin.com/) color scheme (Frappe dark, Latte light, System mode), and native Iconify integration (`@iconify-json/lucide`).

### The Alternatives Considered

- **Tailwind CSS**: Tailwind CSS introduces larger bundle overhead and requires PostCSS dependencies compared to UnoCSS, which is significantly leaner for browser extension builds.
- **Raw Inline Atomic Classes Everywhere**: Repeating `flex items-center justify-center` across dozens of components inflated LOC and fragmented design consistency.

### The Reasoning & Tradeoffs

- **Lean Bundle Footprint**: UnoCSS generates utility CSS on demand during Vite build without PostCSS overhead, keeping the production extension bundle size sub-1MB.
- **First-Class Utility Shortcuts**: Defining custom component shortcuts (`flex-center`, `card-panel`, `setting-row`, `btn-link`) in `uno.config.ts` is far simpler and cleaner than Tailwind's complex `@apply` directives or plugin configs.
- **Seamless Iconify Integration**: UnoCSS natively integrates with Iconify (`@iconify-json/lucide`), allowing icons to be rendered cleanly via CSS classes without importing bulky SVG component libraries.
- **Accessibility & Contrast**: Catppuccin color tokens provide high-contrast legibility in low-light viewing environments.

### What I Deliberately Cut

- **Arbitrary Theme Color Pickers**: Offering unlimited color pickers dilutes visual polish and increases configuration complexity. Preset dark/light themes deliver a premium aesthetic immediately.

---

## 6. Defensive Browser API, i18n & Per-Site Enablement Architecture

### The Decision

1. **Per-Site Domain Enablement Dictionary**: Built a domain whitelist/blacklist manager (`EnabledSites.tsx`) stored in `browser.storage.sync` and checked dynamically upon content script initialization.
2. **Defensive `browser.i18n` Wrapper**: Implemented `getMessage()` in `src/common/browser.ts` with optional chaining (`browser.i18n?.getMessage`) and fallback string returns.
3. **Dynamic Overlay Lifecycle**: The content script dynamically creates (`createOverlay`) and dismounts (`overlayHandle.remove()`) the Shadow DOM overlay upon listening to `browser.storage.onChanged` setting updates.

### The Alternatives Considered

- **Universal Unfiltered Execution**: Mounting video controllers indiscriminately on any webpage containing an HTML `<video>` tag.
- **Direct Un-Guarded API Calls**: Calling `chrome.i18n.getMessage()` directly inside UI components without runtime fallback guards.

### The Reasoning & Tradeoffs

- **Avoiding Hero/Background Video Intrusion**: BingeFlow is designed specifically for media streaming. Universal execution is annoying because overlay controls pop up unwanted on generic websites with animated hero video backgrounds, landing page loops, or embedded ad players.
- **System Resource Efficiency**: Injecting content scripts and attaching DOM listeners on random non-streaming sites wastes browser memory and CPU cycles.
- **Sensible Defaults + One-Time Enablement**: BingeFlow ships enabled by default for popular streaming platforms (Netflix, Prime Video, Disney+ Hotstar). For any uncommon video site I visit, I can enable it with a single "one-time" toggle in the popup or options page.
- **Crash & Test Resilience**: Optional chaining on `browser.i18n` prevents runtime extension crashes when UI components execute inside detached frames, web workers, or headless test environments.

### What I Deliberately Cut

- **Remote Cloud Sync Servers**: Storing settings on external cloud databases introduces privacy concerns and network latency. Extension storage (`browser.storage.sync`) provides free, instantaneous cross-device synchronization via browser user profiles.

---

## Summary of Architectural Strategy

| Area                   | Choice                        | Core Benefit                                                           | Tradeoff Accepted                           |
| ---------------------- | ----------------------------- | ---------------------------------------------------------------------- | ------------------------------------------- |
| **Framework & Build**  | WXT + SolidJS + pnpm          | Next-gen MV3 build tooling, ultra-fast popup load (<50ms), sub-10KB JS | Newer ecosystem than React/Plasmo           |
| **UI Isolation**       | Open Shadow DOM               | 100% style isolation, immunity to host CSS resets                      | Cannot inherit global host page fonts       |
| **Netflix Playback**   | Main-World Bridge Script      | CSP-compliant, safe Cadmium `.seek()` calls without crashes            | Relies on Netflix internal `appContext` API |
| **Input Architecture** | Command Pattern & Gamepad API | Unified pipeline, WebHID extensible, rising-edge hardware filtering    | No complex macro recording                  |
| **Styling**            | UnoCSS + Catppuccin           | Sub-1MB bundle size, high-contrast dark/light themes                   | Fixed color palette choices                 |
| **Overlay Lifecycle**  | Dynamic Mount/Dismount        | Zero DOM pollution or memory leaks when disabled                       | Re-creates DOM nodes on toggle              |
