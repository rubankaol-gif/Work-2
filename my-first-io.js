const fs = require('fs')

const filePath = process.argv[2]

const content = fs.readFileSync(filePath)

const lines = content.toString().split('\n').length - 1

console.log(lines)