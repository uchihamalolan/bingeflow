import { Show } from "solid-js";

import { getMessage } from "@/common/browser";
import { cx } from "@/common/utils/cx";

const isSuccess = (s: string) => s === "success";

const styles = {
  toast: (saveStatus: "success" | "error" | "idle") =>
    cx({
      preset: "toast-base",
      borders: isSuccess(saveStatus) ? "border-green" : "border-red",
      colors: isSuccess(saveStatus) ? "text-green bg-green/8" : "text-red bg-red/8",
    }),
};

interface Props {
  saveStatus: "idle" | "success" | "error";
}

export default function Toast(props: Props) {
  return (
    <Show when={props.saveStatus !== "idle"}>
      <output class={styles.toast(props.saveStatus)}>
        {props.saveStatus === "success"
          ? getMessage("optionsSaved")
          : getMessage("optionsFailedToSave")}
      </output>
    </Show>
  );
}
