const { writeFileSync } = require("fs")

const str = `
--- @field playerX integer
--- @field playerY integer
--- @field contactX integer
--- @field contactY integer
--- @field speedX number
--- @field speedY number
`

const out = []

const m = str.matchAll(/^--- *@field (\w+) (\S+) ?@?(.*)$/gm)
for (const [_, name, type, desc] of m) {
    if (desc && desc.length > 0)   out.push(`/**\n * ${desc}\n */`)
    out.push(`${name}: ${type};`)
}
writeFileSync("gen.js", out.join("\n"))