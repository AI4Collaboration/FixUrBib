import { match, strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { BIN_PATH } from "./support/cli.ts";

test("CLI should warn if an unknown argument is provided", async () => {
	const proc = spawnSync(BIN_PATH, ["--foobar"], { encoding: "utf8" });
	strictEqual(proc.status, 1);
	match(proc.stderr, /Unknown option: --foobar/);
});
