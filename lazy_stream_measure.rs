use std::hint::black_box;
use std::time::Instant;

const N: usize = 5_000_000;

fn main() {
    let v: Vec<usize> = (0..N).collect();

    let start = Instant::now();
    let result = black_box({
        let mut r = Vec::with_capacity(N);
        let iter = v.iter().copied();
        let iter = iter.map(|elem| elem);
        iter.for_each(|elem| {
            r.push(elem);
        });
        r
    });
    let duration = start.elapsed();

    for (i, &e) in result.iter().enumerate() {
        if v[i] != e {
            panic!("expected: {}, actual: {}", i, e);
        }
    }
    println!("{:?}", duration);
}
