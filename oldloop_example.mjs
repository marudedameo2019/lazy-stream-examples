(() => {
    const v = [1, 2, 3];
    const pipe = [
        e => {
            console.log(`map1: ${e}`);
            return e;
        },
        e => {
            console.log(`map2: ${e}`);
            return e;
        },
    ];
    const foreach_f = e => console.log(`forEach: ${e}`);

    for (let i = 0; i < v.length; ++i) {
        let e = v[i];
        for (let j = 0; j < pipe.length; ++j) {
            e = pipe[j](e);
        }
        foreach_f(e);
    }
})();