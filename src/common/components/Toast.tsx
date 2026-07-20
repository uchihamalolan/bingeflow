import { Show } from "solid-js";

import { getMessage } from "@/common/browser";

const styles = {
  toast:
    "fixed top-6 right-6 bg-surface0 border-(~ surface1) py-4 px-6 rounded-xl flex items-center gap-2 z-[9999] animate-slideIn",
  status: (saveStatus: "success" | "error" | "idle") =>
    saveStatus === "success"
      ? "border-green text-green bg-[rgba(166,209,137,0.08)]"
      : "border-red text-red bg-[rgba(231,130,132,0.08)]",
};

interface Props {
  saveStatus: "idle" | "success" | "error";
}

export default function Toast(props: Props) {
  return (
    <Show when={props.saveStatus !== "idle"}>
      <div class={`${styles.toast} ${styles.status(props.saveStatus)}`} role="status">
        {props.saveStatus === "success" ? getMessage("optionsSaved") : getMessage("optionsFailedToSave")}
      </div>
    </Show>
  );
}
