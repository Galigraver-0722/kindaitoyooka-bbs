import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { CHANNEL, IS_BETA, VERSION, versionTag } from "../src/lib/version";

const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8")) as {
  version: string;
};

test("the displayed version matches package.json", () => {
  assert.equal(VERSION, pkg.version);
});

test("the tag carries the channel and the number", () => {
  assert.equal(versionTag(), IS_BETA ? `v.beta${pkg.version}` : `v${pkg.version}`);
  assert.equal(versionTag(), "v.beta0.1.0");
});

test("the channel is one of the two supported values", () => {
  assert.ok(CHANNEL === "beta" || CHANNEL === "stable");
  assert.equal(IS_BETA, CHANNEL === "beta");
});
