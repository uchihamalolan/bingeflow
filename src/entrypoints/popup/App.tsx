import { createSignal, Match, onMount, Switch } from "solid-js";

import { getCurrentTab } from "@/common/browser";
import { detectConfig, type PlatformConfig } from "@/common/platforms";
import { theme } from "@/common/store/theme";

import SettingsButton from "./components/SettingsButton";
import Found from "./components/views/Found";
import Loading from "./components/views/Loading";
import Unsupported from "./components/views/Unsupported";

import 'virtual:uno.css';

const styles = {
  popup: "overflow-hidden rounded-xl",
  toolbar: "flex items-center justify-between py-3 px-4 bg-mantle border-b border-surface0",
  logo: "flex items-center gap-2 m-0",
};

type State =
  | { kind: "loading" }
  | { kind: "unsupported"; hostname?: string }
  | { kind: "found"; config: PlatformConfig };

export default function App() {
  const [state, setState] = createSignal<State>({ kind: "loading" });

  onMount(async () => {
    await theme.init();

    const tab = await getCurrentTab();
    if (!tab) {
      setState({ kind: "unsupported" });
      return;
    }

    const url = tab.url;
    const hostname = url?.startsWith("https://") ? new URL(url).hostname : "";
    const config = detectConfig(hostname);
    setState(config ? { kind: "found", config } : { kind: "unsupported", hostname });
  });

  return (
    <div class={styles.popup}>
      <header class={styles.toolbar}>
        <p class={styles.logo}>
          <span aria-hidden="true">⏭</span>
          <strong>BingeFlow</strong>
        </p>
        <SettingsButton />
      </header>

      <Switch>
        <Match when={state().kind === "loading"}>
          <Loading />
        </Match>
        <Match when={state().kind === "unsupported"}>
          <Unsupported hostname={(state() as { hostname?: string }).hostname} />
        </Match>
        <Match when={state().kind === "found"}>
          <Found config={(state() as { config: PlatformConfig }).config} />
        </Match>
      </Switch>
    </div>
  );
}
