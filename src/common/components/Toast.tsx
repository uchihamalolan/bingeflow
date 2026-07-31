import { clsx } from "clsx";
import { Show } from "solid-js";

import { getMessage } from "@/common/browser";
import { cx } from "@/common/utils/cx";

const isSuccess = (s: string) => s === "success";

const styles = {
  toast: (saveStatus: "success" | "error" | "idle") =>
    cx({
      elevation: "fixed top-6 right-6 z-[9999]",
      layout: "flex items-center gap-2",
      spacing: "py-4 px-6",
      borders: clsx("border rounded-xl", isSuccess(saveStatus) ? "border-green" : "border-red"),
      colors: isSuccess(saveStatus) ? "text-green bg-green/8" : "text-red bg-red/8",
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
