---
name: svelte-conventions
description: Svelte 5 component authoring rules for this project. Use when creating or editing any .svelte component or .svelte.ts module — covers runes, props typing, and file conventions.
---

# Svelte 5 Conventions

## Runes & Reactivity

- Do **not** use legacy Svelte 4 syntax (`let count = 0;` paired with `export let prop;`).
- Use `$state` for component reactive state.
- Use `$derived` for computed values, `$effect` for side effects.

## Props Typing

Always declare a **separate `interface Props` or `type Props`** — never type inline.

✅ Correct:
```typescript
interface Props {
  config: PlatformConfig;
}
let { config }: Props = $props();
```

❌ Incorrect:
```typescript
let { config }: { config: PlatformConfig } = $props();
```

## File Conventions

- Components → `.svelte` files
- Shared logic / stores → `.ts` or `.svelte.ts` files
- Reusable SVG icons → `src/common/components/<Name>Icon.svelte`
  - Icons own their own sizing styles internally; consumers should not need to style them.
