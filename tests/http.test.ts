import assert from "node:assert/strict";
import test from "node:test";
import { isOversized, MAX_BODY_BYTES } from "../src/lib/http";

function requestWithBodyBytes(bytes: number, chunked = false): Request {
  const headers: Record<string, string> = { "content-type": "application/x-www-form-urlencoded" };
  if (!chunked) {
    headers["content-length"] = String(bytes);
  }
  return new Request("http://127.0.0.1:3000/api/threads", { method: "POST", headers, body: null });
}

test("bodies above the cap are refused", () => {
  assert.equal(isOversized(requestWithBodyBytes(1024)), false);
  assert.equal(isOversized(requestWithBodyBytes(MAX_BODY_BYTES)), false);
  assert.equal(isOversized(requestWithBodyBytes(MAX_BODY_BYTES + 1)), true);
  assert.equal(isOversized(requestWithBodyBytes(5_000_000)), true);
});

test("a request without a content length is left to the proxy limit", () => {
  assert.equal(isOversized(requestWithBodyBytes(5_000_000, true)), false);
});

test("the cap can be lowered per call", () => {
  assert.equal(isOversized(requestWithBodyBytes(2048), 1024), true);
});
