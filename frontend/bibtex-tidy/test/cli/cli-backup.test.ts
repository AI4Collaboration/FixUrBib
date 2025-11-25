import { match, strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { BIN_PATH, tmpfile } from "./support/cli.ts";

const input = "@article{a,number={1},title={A}}";

test("CLI should allowing creating backup in modify mode", async () => {
	const path = await tmpfile(input);
	spawnSync(BIN_PATH, [path, "--modify", "--backup"], { encoding: "utf8" });
	strictEqual(await readFile(`${path}.original`, "utf8"), input);
});

test("CLI should error if creating backup in non-modify mode", async () => {
	const path = await tmpfile(input);
	const proc = spawnSync(BIN_PATH, [path, "--output", "foo.bib", "--backup"], {
		encoding: "utf8",
	});
	strictEqual(await readFile(path, "utf8"), input);
	match(
		proc.stderr,
		/--backup is only permitted when --modify\/-m is provided/,
	);
	strictEqual(proc.stdout, "");
	strictEqual(proc.status, 1);
});

test("CLI should create backup by default in legacy modify mode", async () => {
	const path = await tmpfile(input);
	spawnSync(BIN_PATH, [path], { encoding: "utf8" });
	strictEqual(await readFile(`${path}.original`, "utf8"), input);
});
