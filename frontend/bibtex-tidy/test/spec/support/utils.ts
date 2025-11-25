import type { Options } from "../../../src/optionUtils.ts";

export type Spec = {
	title: string;
	input: string;
	expected?: string;
	options: Options;
	warnings?: { code: string; rule: string }[];
};
