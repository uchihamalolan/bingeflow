<script lang="ts">
interface Props {
	hostname?: string;
}

let { hostname }: Props = $props();
</script>

<section class="unsupported" aria-label="Unsupported platform">
	<p class="unsupported-icon" aria-hidden="true">📺</p>
	<p class="unsupported-message">Not on a supported<br>streaming platform</p>
</section>

<style>
.unsupported {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--size-4);
	padding: var(--size-7) var(--size-4);
	text-align: center;
}

.unsupported-icon {
	opacity: 0.5;
	margin: 0;
	font-size: var(--size-6);
}

.unsupported-message {
	color: var(--subtext0);
	margin: 0;
	line-height: var(--font-lineheight-3);
}
</style>
