import { from } from 'ix/iterable'
import { map } from 'ix/iterable/operators'
(() => {
    from([1, 2, 3])
        .pipe(
            map(e => {
                console.log(`map: ${e}`);
                return e;
            }),
        )
        .forEach(e => console.log(`forEach: ${e}`));
})();