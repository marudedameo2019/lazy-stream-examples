MAX_N=30
NUM_ELEMENTS=5_000_000
EXENAME=lazy_map_chain_bench
SRCNAME=$EXENAME.rs

cat << EOF > $SRCNAME
use std::time::Instant;
use std::hint::black_box;

const N: usize = $NUM_ELEMENTS;

fn main() {
    let data: Vec<usize> = (0..N as usize).collect();
    let inc = |x| x + 1;

EOF

for n in $(seq 1 $MAX_N); do
    cat << EOF >> $SRCNAME
    {
        let start = Instant::now();
        let result = black_box({
            let mut r = Vec::with_capacity(N);
            let iter = data.iter().copied();
EOF
    for i in $(seq 1 $n); do
        echo "            let iter = iter.map(inc);" >> $SRCNAME
    done
    cat << EOF >> $SRCNAME
            iter.for_each(|x|{
                r.push(x);
            });
            r
        });
        let duration = start.elapsed();
        assert!(data.len() == result.len());
        for i in 0..N {
            assert!(data[i] + $n == result[i], "i: {}, expected: {}, actual: {}", i, data[i] + $n, result[i]);
        }
        println!("{}: {:?}", $n, duration);
    }
EOF
done

cat << EOF >> $SRCNAME
}
EOF

rustc -g -O $SRCNAME -o $EXENAME
./$EXENAME