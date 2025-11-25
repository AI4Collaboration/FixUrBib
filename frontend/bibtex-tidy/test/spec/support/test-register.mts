import { register } from "node:module";
import { pathToFileURL } from "node:url";

register("./test/spec/support/test-loader.mts", pathToFileURL("./"));
