import { match, strictEqual } from "node:assert";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { BIN_PATH } from "./support/cli.ts";

test("CLI help", async () => {
	const proc1 = spawnSync(BIN_PATH, [], {
		encoding: "utf8",
		//HACK to prevent stdin being detected
		env: { ...process.env, PRE_COMMIT: "1" },
	});

	const proc2 = spawnSync(BIN_PATH, ["--help"], { encoding: "utf8" });

	strictEqual(proc1.stdout, proc2.stdout);
	match(proc1.stdout, /cleaner and formatter/i);
	match(proc1.stdout, /Examples/i);
	match(proc1.stdout, /--space/i);
});
