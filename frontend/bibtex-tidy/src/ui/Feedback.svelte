<script lang="ts">
import type { BibTeXTidyResult } from "../index.ts";
import type { OptionsNormalized } from "../optionUtils.ts";
import FeedbackError from "./FeedbackError.svelte";
import FeedbackSuccess from "./FeedbackSuccess.svelte";

export let options: OptionsNormalized;
export let status:
	| { status: "success"; result: BibTeXTidyResult }
	| { status: "error"; error: unknown }
	| { status: "llm-success"; count: number }
	| { status: "llm-error"; error: string };
</script>

<div role="alert">
	{#if status.status === 'success'}
		<FeedbackSuccess {options} result={status.result} />
	{:else if status.status === 'llm-success'}
		<div class="llm-success">
			Fixed {status.count} {status.count === 1 ? 'entry' : 'entries'} with LLM
		</div>
	{:else if status.status === 'llm-error'}
		<div class="llm-error">
			LLM Error: {status.error}
		</div>
	{:else}
		<FeedbackError error={status.error} />
	{/if}
</div>

<style>
	div {
		background: var(--dark2);
		border: 1px solid var(--border-color);
		padding: 12px;
		margin-bottom: 20px;
		border-radius: 8px;
	}
	.llm-success {
		color: var(--green);
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
	}
	.llm-error {
		color: var(--red);
		background: transparent;
		border: none;
		padding: 0;
		margin: 0;
	}
</style>
