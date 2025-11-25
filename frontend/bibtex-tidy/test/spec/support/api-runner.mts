import { equal } from "node:assert";
import test from "node:test";
import { tidy } from "../../../bibtex-tidy.js";
import type { Spec } from "./utils.ts";

export function runTest(spec: Spec) {
	test(`${spec.title} - JS API`, () => {
		const result = tidy(spec.input, spec.options);
		if (spec.expected) {
			equal(result.bibtex, spec.expected);
		}
		if (spec.warnings) {
			equal(result.warnings.length, spec.warnings.length);
			for (let i = 0; i < spec.warnings.length; i++) {
				const expected: Record<string, unknown> = { ...spec.warnings[i] };
				const actual: Record<string, unknown> = { ...result.warnings[i] };
				for (const key in expected) {
					equal(actual[key], expected[key]);
				}
			}
		}
	});
}
