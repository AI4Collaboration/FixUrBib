import type { Transform } from "../types.ts";
import { monthAliases } from "./abbreviateMonths.ts";

export function createPreferCurlyTransform(): Transform {
	return {
		name: "prefer-curly",
		apply: (ast) => {
			for (const field of ast.fields()) {
				if (
					field.name.toLowerCase() === "month" &&
					monthAliases[ast.lookupRenderedEntryValue(field)]
				) {
					continue;
				}
				for (const child of field.value.concat) {
					child.type = "braced";
				}
				ast.invalidateField(field);
			}
			return undefined;
		},
	};
}
