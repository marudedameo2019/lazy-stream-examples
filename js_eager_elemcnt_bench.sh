CHAIN=30
NUM_ELEMENTS=5000000
STEP=500000
SRCNAME=eager_elemcnt_bench.mjs

cat << EOF > $SRCNAME
const N = $NUM_ELEMENTS
const inc = x => x + 1;
EOF

for n in $(seq $STEP $STEP $NUM_ELEMENTS); do
    cat << EOF >> $SRCNAME
{
    if (global.gc) global.gc();
    const n = $n
    const v = [...Array(n)].map((_,i)=>i)
    const r = new Array(v.length)
    const s = performance.now()

    v
EOF
    for i in $(seq 1 $CHAIN); do
        echo "    .map(inc)" >> $SRCNAME
    done
    cat << EOF >> $SRCNAME
    .forEach((e, i) => {r[i] = e});

    const e = performance.now()

    if (v.length !== r.length) {
        console.log(\`length mismatch(expected: \${v.length}, actual: \${r.length})\`)
    } else {
        for(let i = 0; i < v.length; ++i) {
            const expected = v[i] + $CHAIN;
            const actual = r[i];
            if (expected !== actual) {
                console.log(\`\${i}th r, v mismatch(expected: \${expected}, actual: \${actual})\`)
                break
            }
        }
    }
    console.log(\`\${n}: \${e - s}ms\`)
}
EOF
done

node --expose-gc $SRCNAME