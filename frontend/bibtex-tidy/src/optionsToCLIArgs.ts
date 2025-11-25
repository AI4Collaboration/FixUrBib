import { optionDefinitions } from "./optionDefinitions.ts";
import type { Options } from "./optionUtils.ts";

export function optionsToCLIArgs(options: Options): string[] {
	return optionDefinitions
		.map((def) => def.toCLI?.(options[def.key as keyof Options], options))
		.filter((arg): arg is string => typeof arg === "string");
}
