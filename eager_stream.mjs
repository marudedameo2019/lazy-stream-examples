const v = [0, 1, 2];

v.map(e => {
    console.log(`map: ${e}`);
    return e;
}).forEach((e) => {
    console.log(`for_each: ${e}`);
});