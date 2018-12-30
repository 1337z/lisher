import test from "ava"

const mockIo = require("mock-stdio")

test("Test tests (On fail: The testing system might be broken, which is bad)", t => {
  mockIo.start()
  console.log("Test")
  let result = mockIo.end()

  t.is(result.stdout, "Test\n")
})
