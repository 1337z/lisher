import test from "ava"
import * as fs from "fs"
import * as jsonHelper from "../build/utils/jsonHelper"

test("Get JSON from file", t => {
  t.deepEqual(JSON.parse(fs.readFileSync("./package.json").toString()), jsonHelper.fromFile("./package.json"))
})
