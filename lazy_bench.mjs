import { from as rx_from, map as rx_map, pipe as rx_pipe } from 'rxjs'
import { from as ix_sync_from } from 'ix/iterable'
// import { from as ix_async_from } from 'ix/asynciterable'
import { map as ix_sync_map } from 'ix/iterable/operators'
// import { map as ix_async_map } from 'ix/asynciterable/operators'
import lodash from 'lodash'
// import { pipe as rmd_pipe, map as rmd_map } from 'remeda'
import { parseArgs } from 'node:util';

(async () => {
    const config = {
        options: {
            n: { type: 'string', default: '5000000' },
            step: { type: 'string', default: '5000000' },
            min_chain: { type: 'string', default: '1' },
            max_chain: { type: 'string', default: '30' },
        },
        strict: false
    };
    const { values } = parseArgs(config);
    const N = parseInt(values.n, 10);
    const STEP = parseInt(values.step, 10);
    const MIN_CHAIN = parseInt(values.min_chain, 10);
    const MAX_CHAIN = parseInt(values.max_chain, 10);
    const inc = x => x + 1;

    const rxjs_func_normal = async (chain, v, r) => {
        let i = 0;
        await rx_from(v)
            .pipe(...Array.from({ length: chain }, () => rx_map(inc)))
            .forEach(e => { r[i++] = e });
    };
    // const rxjs_func_compose = async (chain, v, r) => {
    //     let i = 0;
    //     await rx_from(v)
    //         .pipe(rx_pipe(...Array.from({ length: chain }, () => rx_map(inc))))
    //         .forEach(e => { r[i++] = e });
    // };
    const ixjs_func_sync_normal = (chain, v, r) => {
        let i = 0;
        ix_sync_from(v)
            .pipe(...Array.from({ length: chain }, () => ix_sync_map(inc)))
            .forEach(e => { r[i++] = e });
    };
    // const ixjs_func_async_normal = async (chain, v, r) => {
    //     let i = 0;
    //     await ix_async_from(v)
    //         .pipe(...Array.from({ length: chain }, () => ix_async_map(inc)))
    //         .forEach(e => { r[i++] = e });
    // };
    const lodash_func_normal = (chain, v, r) => {
        let i = 0;
        const _ = lodash;
        const vplus = [...v, 0];
        let t = _(vplus);
        for (let c = 0; c < chain; ++c) t = t.map(inc);
        t.take(v.length).forEach(e => { r[i++] = e });
    };
    // const lodash_func_compose = (chain, v, r) => {
    //     let i = 0;
    //     const _ = lodash;
    //     const composed = _.flow(Array(chain).fill(inc));
    //     _(v).map(composed).forEach(e => { r[i++] = e });
    // };
    const stditer_func_normal = (chain, v, r) => {
        let i = 0;
        let t = v.values(v);
        for (let c = 0; c < chain; ++c) t = t.map(inc);
        t.forEach(e => { r[i++] = e });
    };
    // const remeda_func_normal = (chain, v, r) => {
    //     let i = 0;
    //     const ary = Array.from({ length: chain + 1 }, (_, i) => i == 0 ? v : rmd_map(inc));
    //     const rslt = rmd_pipe(...ary).forEach(e => { r[i++] = e });
    // };
    const oldloop_func_normal = (chain, v, r) => {
        const applied = Array(chain).fill(inc);
        for (let i = 0; i < v.length; ++i) {
            let e = v[i]
            for (let j = 0; j < applied.length; ++j) {
                e = applied[j](e);
            }
            r[i] = e;
        }
        return r;
    }

    const isThenable = f => {
        return (
            f !== null &&
            (typeof f === 'object' || typeof f === 'function') &&
            typeof f.then === 'function'
        );
    };
    const test = async (name, f, v, chain) => {
        const r = new Array(v.length)
        if (global.gc) global.gc();

        const s = performance.now();
        const result = f(chain, v, r);
        if (isThenable(result)) await result
        const e = performance.now()

        if (v.length != r.length) {
            console.log(`length mismatch(expected: ${v.length}, actual: ${r.length})`)
        } else {
            for (let i = 0; i < v.length; ++i) {
                const expected = v[i] + chain;
                const actual = r[i];
                if (actual !== expected) {
                    console.log(`${i}th r, v mismatch(expected: ${expected}, actual: ${actual})`)
                    break
                }
            }
        }
        console.log(`${name},${v.length},${chain},${e - s}`)
    };

    let lastPromise;
    for (let f of [
        stditer_func_normal,
        // ixjs_func_async_normal,
        rxjs_func_normal,
        // rxjs_func_compose,
        ixjs_func_sync_normal,
        lodash_func_normal,
        // lodash_func_compose,
        // remeda_func_normal,
        oldloop_func_normal,
    ]) {
        for (let n = STEP; n <= N; n += STEP) {
            const v = Array.from({ length: n }, (_, i) => i);
            for (let chain = MIN_CHAIN; chain <= MAX_CHAIN; ++chain) {
                if (lastPromise) await lastPromise;
                lastPromise = test(f.name, f, v, chain);
                await lastPromise;
            }
        }
    }
})();