import { equal, notEqual, strictEqual } from "node:assert";
import test from "node:test";
import { tidy } from "../../bibtex-tidy.js";

const input = `@article{ strange(key)=(has_odd-characters?:*£"!<>/ ,
  title={Foo}
}
@article{
  title={An entry with no key}
}`;

const output = `@article{strange(key)=(has_odd-characters?:*£"!<>/,
  title         = {Foo}
}
@article{
  title         = {An entry with no key}
}
`;

const invalidInputs = [
	`@ARTICLE {invalid{,
  title={Foo}
}`,
	`@ARTICLE {invalid$,
  title={Foo}
}`,
	`@ARTICLE {invalid%,
  title={Foo}
}`,
	`@ARTICLE {invalid#,
  title={Foo}
}`,
	`@ARTICLE {invalid~,
  title={Foo}
}`,
];

const invalidInputWithSpaces = `@ARTICLE {in valid,
title={Foo}
}`;

test("strange characters in citation key", () => {
	const tidied = tidy(input);
	strictEqual(tidied.bibtex, output);

	for (const input of invalidInputs) {
		let err: unknown;
		try {
			tidy(input);
		} catch (e) {
			err = e;
		}
		notEqual(err, undefined);
		equal(
			String(err).includes("The entry key cannot contain the character"),
			true,
		);
	}
	let err: unknown;
	try {
		tidy(invalidInputWithSpaces);
	} catch (e) {
		err = e;
	}
	notEqual(err, undefined);
	equal(String(err).includes("The entry key cannot contain whitespace"), true);
});
