import test from "ava"
import * as lisher from "../build/lisher"
const mockIo = require("mock-stdio")

test("Test tests (if this test doensn't pass: The testing system might be broken, which is bad)", t => {
  mockIo.start()

  console.log("Test")

  let result = mockIo.end()

  t.is(result.stdout, "Test\n")
})
