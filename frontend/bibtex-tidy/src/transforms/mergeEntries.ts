import { checkForDuplicates } from "../duplicates.ts";
import type { MergeStrategy, OptionsNormalized } from "../optionUtils.ts";
import type { Transform } from "../types.ts";
import { isEntryNode } from "../utils.ts";

export function createMergeEntriesTransform(
	duplicatesOpt: OptionsNormalized["duplicates"],
	merge?: MergeStrategy,
): Transform {
	// Must happen after generate keys, before sorting entries
	return {
		name: "merge-entries",
		dependencies: ["generate-keys", "sort-entries"],

		apply: (astProxy) => {
			const duplicates = checkForDuplicates(astProxy, duplicatesOpt, merge);

			const root = astProxy.root();
			root.children = root.children.filter(
				(child) => !isEntryNode(child) || !duplicates.entries.has(child.block),
			);

			return duplicates.warnings;
		},
	};
}
