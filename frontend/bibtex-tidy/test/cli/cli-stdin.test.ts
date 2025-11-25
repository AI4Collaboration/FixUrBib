import { match, strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { BIN_PATH } from "./support/cli.ts";

const input = `@article{a,
    number={1},
    title={A}
}`;

const output = `@article{a,
  number        = {1},
  title         = {A}
}
`;

test("CLI should accept stdin", async () => {
	const proc = spawnSync(BIN_PATH, [], { input, encoding: "utf8" });
	strictEqual(proc.stdout, output);
});

test("CLI should throw if specifying --backup with stdin", async () => {
	const proc = spawnSync(BIN_PATH, ["--backup"], { input, encoding: "utf8" });
	match(proc.stderr, /--backup is only valid when specifying input files/);
	strictEqual(proc.stdout, "");
	strictEqual(proc.status, 1);
});

test("CLI should throw if specifying --modify with stdin", async () => {
	const proc = spawnSync(BIN_PATH, ["--modify"], { input, encoding: "utf8" });
	match(proc.stderr, /--modify\/-m is only valid when specifying input files/);
	strictEqual(proc.stdout, "");
	strictEqual(proc.status, 1);
});
