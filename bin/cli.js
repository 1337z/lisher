#!/usr/bin/env node

const index = require("../src/index")

let args = process.argv.splice(process.execArgv.length + 2)

index.run(args)
