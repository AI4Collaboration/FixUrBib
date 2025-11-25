import { strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { BIN_PATH, tmpfile } from "./support/cli.ts";

const input = `@article{a,
    number={1},
    title={A}
}`;

const output = `@article{a,
  number        = {1},
  title         = {A}
}
`;

test("CLI should output to specified file", async () => {
	const infile = await tmpfile(input);
	const outfile = await tmpfile("");
	spawnSync(BIN_PATH, [infile, "--output", outfile], { encoding: "utf8" });
	strictEqual(await readFile(infile, "utf8"), input);
	strictEqual(await readFile(outfile, "utf8"), output);
});

test("CLI should output to specified file (from stdin)", async () => {
	const outfile = await tmpfile("");
	spawnSync(BIN_PATH, ["--output", outfile], {
		input,
		encoding: "utf8",
	});
	strictEqual(await readFile(outfile, "utf8"), output);
});
