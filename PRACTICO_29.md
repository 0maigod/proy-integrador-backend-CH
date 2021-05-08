NUMERO DE CPUS const numCPUs = require('os').cpus().length

---

CON NODEMON

    MODO FORK
        nodemon index.js 8080 FORK

    MODO CLUSTER
        nodemon index.js 8080 CLUSTER

CON FOREVER

    MODO FORK
        forever start --uuid "app01" index.js 8080 FORK

    MODO CLUSTER
        forever start --uuid "app01" index.js 8080 CLUSTER

    LISTAR PROCESOS
        forever list

CON PM2

    MODO FORK
        pm2 start index.js --name="app01" -- 8080 FORK

    MODO CLUSTER
        pm2 start index.js --name="app01" -i max -- 8080 CLUSTER

    LISTAR PROCESOS
        pm2 monit
    o sino
        pm2 ps

    DETENER PROCESO
        pm2 stop id

    DETENER LA APLICACION
        pm2 stop name

EL MODO ESCUCHA EN LOS CASOS DE FOREVER Y PM2 SE ACTIVAN DE LA MISMA MANERA --watch pm2 start index.js --name="app01" --watch -- 8080 FORK forever start --uuid "app01" --watch index.js 8080 FORK
