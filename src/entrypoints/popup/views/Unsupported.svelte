<script lang="ts">
interface Props {
	hostname?: string;
}

let { hostname }: Props = $props();

// Customizable Tally/Google Form URL.
// Swap 'YOUR_FORM_ID' with your actual Tally form ID.
const FEEDBACK_FORM_URL = "https://tally.so/r/YOUR_FORM_ID";

const requestUrl = $derived(
	hostname
		? `${FEEDBACK_FORM_URL}?platform=${encodeURIComponent(hostname)}`
		: FEEDBACK_FORM_URL
);
</script>

<section class="unsupported" aria-label="Unsupported platform">
	<p class="unsupported-icon" aria-hidden="true">📺</p>
	<p class="unsupported-message">Not on a supported<br>streaming platform</p>

	{#if hostname}
		<a
			href={requestUrl}
			target="_blank"
			rel="noopener noreferrer"
			class="request-btn"
		>
			Request support for {hostname}
		</a>
	{/if}
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

.request-btn {
	display: inline-block;
	background: var(--blue);
	color: var(--base);
	font-weight: var(--font-weight-6);
	padding: var(--size-2) var(--size-4);
	border-radius: var(--radius-2);
	font-size: var(--font-size-0);
	transition: background-color var(--duration-2) var(--ease-2), transform var(--duration-1) var(--ease-2);
	margin-top: var(--size-2);
	box-shadow: var(--shadow-1);
	text-decoration: none;

	&:hover {
		background: var(--mauve);
		text-decoration: none;
		transform: translateY(-1px);
	}

	&:active {
		transform: translateY(0);
	}
}
</style>
