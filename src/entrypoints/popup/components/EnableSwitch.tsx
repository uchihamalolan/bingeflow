import { getMessage } from "@/common/browser";
import Switch from "@/common/components/Switch";
import { cx } from "@/common/utils/cx";

interface Props {
  enabled: boolean;
  onchange: (checked: boolean) => void;
}

const styles = {
  container: cx({
    layout: "flex items-center justify-between gap-2",
  }),
  label: cx({
    typography: "text-sm font-semibold truncate",
  }),
};

export default function EnableSwitch(props: Props) {
  return (
    <div class={styles.container}>
      <span class={styles.label}>{getMessage("enableBingeFlow")}</span>
      <Switch
        id="enable-extension"
        ariaLabel={getMessage("enableExtensionAria")}
        checked={props.enabled}
        onchange={props.onchange}
        size="sm"
      />
    </div>
  );
}
