import { from, map } from 'rxjs'
(async () => {
    await from([1, 2, 3])
        .pipe(
            map(e => {
                console.log(`map: ${e}`);
                return e;
            }),
        )
        .forEach(e => console.log(`forEach: ${e}`));
})();