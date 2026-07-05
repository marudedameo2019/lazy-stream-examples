MAX_N=30
NUM_ELEMENTS=5_000_000
SRCNAME=eager_map_chain_bench.mjs

cat << EOF > $SRCNAME
const N = $NUM_ELEMENTS
const v = [...Array(N)].map((_,i)=>i)
const r = new Array(v.length)
const inc = x => x + 1;
EOF

for n in $(seq 1 $MAX_N); do
    cat << EOF >> $SRCNAME
{
    if (global.gc) global.gc();
    const s = performance.now()

    v
EOF
    for i in $(seq 1 $n); do
        echo "    .map(inc)" >> $SRCNAME
    done
    cat << EOF >> $SRCNAME
    .forEach((e, i) => {r[i] = e});

    const e = performance.now()

    if (v.length != r.length) {
        console.log(\`length mismatch(expected: \${v.length}, actual: \${r.length})\`)
    } else {
        for(let i = 0; i < v.length; ++i) {
            const expected = v[i] + $n;
            const actual = r[i];
            if (expected !== actual) {
                console.log(\`\${i}th r, v mismatch(expected: \${v[i]}, actual: \${r[i]})\`)
                break
            }
        }
    }
    console.log(\`$n: \${e - s}ms\`)
}
EOF
done

node --expose-gc $SRCNAME