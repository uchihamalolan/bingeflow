import { getMessage } from "@/common/browser";
import Switch from "@/common/components/Switch";

interface Props {
  enabled: boolean;
  onchange: (checked: boolean) => void;
}

const styles = {
  container: "flex items-center justify-between",
  label: "text-sm font-semibold",
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
