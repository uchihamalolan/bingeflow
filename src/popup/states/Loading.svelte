<script lang="ts"></script>

<div class="loading">
	<div class="spinner"></div>
</div>

<style>
.loading {
	display: flex;
	justify-content: center;
	align-items: center;
	padding: 28px;
}

.spinner {
	width: 20px;
	height: 20px;
	border: 2px solid var(--surface0);
	border-top-color: var(--mauve);
	border-radius: 50%;
	animation: spin 0.7s linear infinite;
}

@keyframes spin {
	to {
		transform: rotate(360deg);
	}
}
</style>
