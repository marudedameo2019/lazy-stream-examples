fn main() {
    let v = vec![0, 1, 2];
    v.iter()
        .map(|elem| {
            println!("map: {elem}");
            elem
        })
        .for_each(|elem| {
            println!("for_each: {elem}");
        })
}
