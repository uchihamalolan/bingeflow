import { Show } from "solid-js";

import { getMessage } from "@/common/browser";
import { cx } from "@/common/utils/cx";

const styles = {
  toast: (saveStatus: "success" | "error" | "idle") =>
    cx({
      elevation: "fixed top-6 right-6 z-[9999]",
      layout: "flex items-center gap-2",
      spacing: "py-4 px-6",
      borders: saveStatus === "success" ? "border-(~ green) rounded-xl" : "border-(~ red) rounded-xl",
      colors: saveStatus === "success" ? "text-green bg-[rgba(166,209,137,0.08)]" : "text-red bg-[rgba(231,130,132,0.08)]",
      state: "animate-slideIn",
    }),
};

interface Props {
  saveStatus: "idle" | "success" | "error";
}

export default function Toast(props: Props) {
  return (
    <Show when={props.saveStatus !== "idle"}>
      <div class={styles.toast(props.saveStatus)} role="status">
        {props.saveStatus === "success"
          ? getMessage("optionsSaved")
          : getMessage("optionsFailedToSave")}
      </div>
    </Show>
  );
}
