import { createStore, produce } from "solid-js/store";

import { loadSettings, type Settings } from "@/common/settings";

const [store, setStore] = createStore<{ current: Settings | null }>({ current: null });

export const settings = {
  get current() {
    return store.current;
  },
  async init() {
    const val = await loadSettings();
    setStore("current", val);
  },
  update(fn: (s: Settings) => void) {
    if (store.current) {
      setStore(
        "current",
        produce((s) => {
          if (s) fn(s);
        }),
      );
    }
  },
};
