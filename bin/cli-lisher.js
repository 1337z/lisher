#!/usr/bin/env node

const lisher = require("../build/lisher")

let args = process.argv.splice(process.execArgv.length + 2)

lisher.run(args)
