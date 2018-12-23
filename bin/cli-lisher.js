#!/usr/bin/env node

const lisher = require("../build/lisher")
const updateNotifier = require("update-notifier")
const pkg = require("../package.json")

const argv = require("yargs").option("debug", {
  describe: "Enable debugging",
  alias: "d",
  default: false
}).argv

updateNotifier({ pkg }).notify()

lisher.run(argv)
