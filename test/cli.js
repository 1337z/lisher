import test from "ava"
import * as lisher from "../build/lisher"
import { execSync } from "child_process"
import { readFileSync } from "fs";
const mockIo = require("mock-stdio")

test("Argument: --version", t => {
  let result = execSync("node ./bin/cli-lisher --version").toString()

  t.is(result, JSON.parse(readFileSync("package.json")).version + "\n")
})

test("Argument: -v", t => {
  let result = execSync("node ./bin/cli-lisher -v").toString()

  t.is(result, JSON.parse(readFileSync("package.json")).version + "\n")
})

