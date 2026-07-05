import _ from 'lodash'
(() => {
    _([1, 2, 3, 0])
        .map(e => {
            console.log(`map1: ${e}`);
            return e;
        })
        .map(e => {
            console.log(`map2: ${e}`);
            return e;
        })
        .take(3)
        .forEach(e => console.log(`forEach: ${e}`));
})();