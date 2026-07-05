#
# ex) sh mermaid_base.sh rust_lazy_map_chain_bench.sh js_eager_map_chain_bench.sh js_lazy_map_chain_bench.sh
FILES="$*"

for f in $FILES; do
    log=$f.log
    echo "[$f]"
    sh $f | tee $f.log
done

for f in $FILES; do
    lang=$(echo $f | sed 's/_.*$//')
    type=$(echo $f | sed 's/^[^_]*_\([^_]*\)_.*$/\1/')
    log=$f.log
    echo -n "    line \"${lang}_${type}\" ["
    sed 's/^[^:]*: //;s/ms$//' $log | tr '\n' ',' | sed 's/,$/]/'
    echo
done