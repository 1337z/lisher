#!/usr/bin/env node

const lisher = require("../build/lisher")
const updateNotifier = require("update-notifier")
const pkg = require("../package.json")

const argv = require("yargs")
  .option("debug", {
    describe: "Enable debugging",
    alias: "d",
    default: false
  })
  .option("version", {
    describe: "Show the installed version of lisher",
    alias: "v",
    default: false
  }).argv

updateNotifier({ pkg }).notify()

lisher.run(argv)
