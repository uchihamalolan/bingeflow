<script lang="ts"></script>

<section class="unsupported" aria-label="Unsupported platform">
	<p class="unsupported-icon" aria-hidden="true">📺</p>
	<p class="unsupported-message">Not on a supported<br>streaming platform</p>
</section>

<style>
.unsupported {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: var(--size-2);
	padding: var(--size-7) var(--size-4);
	text-align: center;
}

.unsupported-icon {
	opacity: 0.5;
	margin: 0;
}

.unsupported-message {
	color: var(--subtext0);
	margin: 0;
}
</style>
