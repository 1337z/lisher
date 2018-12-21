#!/usr/bin/env node

const lish = require("../build/lish")

let args = process.argv.splice(process.execArgv.length + 2)

lish.run(args)
