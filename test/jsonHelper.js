import * as fs from "fs"
import * as jsonHelper from "../build/utils/jsonHelper"
import test from "ava"

test("Get JSON from file", t => {
  t.deepEqual(JSON.parse(fs.readFileSync("./package.json").toString()), jsonHelper.fromFile("./package.json"))
})
