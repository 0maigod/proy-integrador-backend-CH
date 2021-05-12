Arrancar dos instancias del servidor en el que venimos trabajando utilizando PM2 modo fork (sin -i max). Las dos instancias estarán: una en el puerto 8081 modo fork (parámetro línea de comandos en
FORK: cluster interno deshabilitado) y la otra en 8082 modo cluster (parámetro línea de comandos en CLUSTER: cluster interno habilitado). Ambas estarán en modo watch.

    MODO FORK CON PM2

        pm2 start index.js --name="app01" --watch -- 8081 FORK
        pm2 start index.js --name="app02" --watch -- 8082 FORK

Configurar un servidor Nginx para que las rutas entrantes /info y /randoms por el puerto 80 de Nginx se deriven a esas dos instancias, recibiendo la del modo cluster cuatro veces más de tráfico que la
instancia en modo fork.

        upstream node_app_fork {
            server 127.0.0.1:8081;
        }

        upstream node_app_cluster {
            server 127.0.0.1:8082 weight=4;
        }

Archivo sites-enabled/default

            upstream node_app_fork {
                server 127.0.0.1:8081;
            }

            upstream node_app_cluster {
                server 127.0.0.1:8082;
            }

            server {
                listen 80 default_server;
                listen [::]:80 default_server;

                root /var/www/html;

                index index.html index.htm index.nginx-debian.html;

                server_name _;

                location /info/ {
                    proxy_pass http://node_app_fork/;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
                }

                location /randoms/ {
                    proxy_pass http://node_app_cluster/;
                    proxy_http_version 1.1;
                    proxy_set_header Upgrade $http_upgrade;
                    proxy_set_header Connection 'upgrade';
                    proxy_set_header Host $host;
                    proxy_cache_bypass $http_upgrade;
                }

            }
