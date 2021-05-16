PROFILING

    node --prof ./src/index.js

    Corro el comando anterior dos veces, una usando la ruta info y la otra usando info2

        node --prof-process nologInfo.log > nolog_info.txt
        node --prof-process logInfo.log > log_info.txt

TEST CON ARTILLERY

    artillery quick -c 50 -n 20 "http://localhost:8080/info" > artillery_nolog.txt
    artillery quick -c 50 -n 20 "http://localhost:8080/info2" > artillery_log.txt

PERFILAMIENTO MODO INSPECTOR INTERNO NODEJS

    node --inspect ./src/index.js

AUTOCANNON

    autocannon -d 20 -c 100 "http://localhost:8080/info"
    autocannon -d 20 -c 100 "http://localhost:8080/info2"

0X

    0x ./src/index.js
