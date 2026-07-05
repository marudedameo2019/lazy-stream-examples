process_log() {
    _log_file="$1"
    for fn in $(cut -d, -f1 "$_log_file" | uniq); do
        echo -n "    line \"$fn\" ["
        cut -d, -f1,4 "$_log_file" | grep "$fn" | sed 's/^.*,//' | tr '\n' ','
        echo
    done | sed 's/,$/]/'
}

echo "[Chain Count]"
log=lazy_bench_chaincnt.csv
node --expose-gc lazy_bench.mjs > "$log"
process_log "$log"

echo
echo "[Element Count]"
log=lazy_bench_elmcnt.csv
node --expose-gc lazy_bench.mjs --n 5000000 --step 500000 --min_chain 30 --max_chain 30 > "$log"
process_log "$log"