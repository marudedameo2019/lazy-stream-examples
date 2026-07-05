const N = 5000000
const v = Array.from({ length: N }, (_, i) => i)
const r = new Array(v.length)
const s = performance.now()
v.map(e => e)
    .forEach((e, i) => { r[i] = e })
const e = performance.now()
for (const [i, e] of r.entries()) {
    if (v[i] !== e) {
        console.log(i, e)
        break
    }
}
console.log(`${e - s}[ms]`)
