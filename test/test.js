import test from "ava"
import * as lisher from "../build/lisher"
const mockIo = require("mock-stdio")

test("Example test", t => {
  mockIo.start()

  // Code that results in console output.

  let result = mockIo.end()

  t.is("test", "test")
})
