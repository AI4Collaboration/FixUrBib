<script lang="ts">
export let apiKey: string = "";
export let apiEndpoint: string = "http://localhost:8000";
export let model: string = "gpt-4o-mini";

const models = [
	{ value: "gpt-4o-mini", label: "GPT-4o Mini (Fast)" },
	{ value: "gpt-4o", label: "GPT-4o (Powerful)" },
	{ value: "gpt-4-turbo", label: "GPT-4 Turbo" },
];
</script>

<section>
	<h2>LLM Settings</h2>
	<p>Use AI to fix and complete BibTeX entries with web search.</p>

	<div class="field">
		<label for="api-endpoint">API Endpoint</label>
		<input
			type="text"
			id="api-endpoint"
			bind:value={apiEndpoint}
			placeholder="http://localhost:8000"
		/>
	</div>

	<div class="field">
		<label for="api-key">OpenAI API Key</label>
		<input
			type="password"
			id="api-key"
			bind:value={apiKey}
			placeholder="sk-..."
		/>
	</div>

	<div class="field">
		<label for="model">Model</label>
		<select id="model" bind:value={model}>
			{#each models as m}
				<option value={m.value}>{m.label}</option>
			{/each}
		</select>
	</div>
</section>

<style>
	section {
		margin-bottom: 20px;
		padding-bottom: 20px;
		border-bottom: 1px solid var(--border-color);
	}
	h2 {
		font: var(--sans-h2);
		color: var(--header-fg);
		margin: 0 0 8px 0;
	}
	p {
		color: var(--light-gray);
		margin: 0 0 12px 0;
	}
	.field {
		margin-bottom: 12px;
	}
	.field label {
		display: block;
		margin-bottom: 4px;
		color: var(--light-gray);
	}
	.field input,
	.field select {
		width: 100%;
		background: var(--textfield-bg);
		color: var(--header-fg);
		border: 1px solid var(--border-color);
		padding: 8px;
		font: var(--sans-normal);
		border-radius: 3px;
	}
	.field select {
		cursor: pointer;
	}
</style>