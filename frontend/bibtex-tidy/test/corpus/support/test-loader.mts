import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

export function resolve(
	specifier: string,
	ctx: { parentURL: string },
	next: (...args: unknown[]) => unknown,
) {
	if (specifier.endsWith(".bib")) {
		return { url: new URL(specifier, ctx.parentURL).href, shortCircuit: true };
	}
	return next(specifier, ctx, next);
}

export async function load(
	url: string,
	ctx: unknown,
	next: (...args: unknown[]) => unknown,
) {
	if (!url.endsWith(".bib")) return next(url, ctx, next);

	const text = await readFile(fileURLToPath(url), "utf8");

	const js = `
		import test from "node:test";
		import { tidy } from "../../../bibtex-tidy.js";
		import { equal } from "node:assert";

		function alphaNumOnly(str) {
			return (
				str
					.replace(/\\W/g, "")
					.toLowerCase()
					.match(/.{1,50}/g)
					?.join("\\n") ?? ""
			);
		}

		test(${JSON.stringify(url)}, () => {
			const input = ${JSON.stringify(text)};

			const result = tidy(input, {
				escape: false,
				removeDuplicateFields: false 
			});

			equal(alphaNumOnly(result.bibtex), alphaNumOnly(input));
		})
  `;

	return { format: "module", source: js, shortCircuit: true };
}
