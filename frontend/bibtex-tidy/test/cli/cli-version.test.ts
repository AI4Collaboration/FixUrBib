import { match } from "node:assert";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { BIN_PATH } from "./support/cli.ts";

test("CLI version", async () => {
	const proc = spawnSync(BIN_PATH, ["--version"], { encoding: "utf8" });
	match(proc.stdout, /^v\d+\.\d+.\d+\n$/);
});
