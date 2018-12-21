#!/usr/bin/env node

const lisher = require("../build/lisher")

const argv = require("yargs").option("debug", {
  describe: "Enable debugging",
  alias: "d",
  default: false
}).argv

lisher.run(argv)
