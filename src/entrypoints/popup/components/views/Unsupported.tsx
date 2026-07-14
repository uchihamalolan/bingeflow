const localStyles = {
  unsupported: "flex flex-col items-center gap-5 py-8 px-5 text-center",
  unsupportedIcon: "opacity-50 m-0 text-3xl",
  unsupportedMessage: "text-subtext0 m-0 leading-relaxed",
};

interface Props {
  hostname?: string;
}

export default function Unsupported(_props: Props) {
  return (
    <section class={localStyles.unsupported} aria-label="Unsupported platform">
      <p class={localStyles.unsupportedIcon} aria-hidden="true">
        📺
      </p>
      <p class={localStyles.unsupportedMessage}>
        Not on a supported
        <br />
        streaming platform
      </p>
    </section>
  );
}
