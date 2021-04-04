import express from 'express';
import path from 'path';

export default class Server {
    public app: express.Application;

    constructor(private port: number) {
        this.app = express();
    }

    start(callback: any) {
        this.app.get('/', function (req, res) {
            res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'));
        });
        this.app.use(express.static(path.join(__dirname, '..', '..', 'public')), (req, res) => {
            res.json({
                error: {
                    name: 'Error',
                    status: 404,
                    message: 'Invalid Request',
                    statusCode: 404,
                    stack: 'http://localhost:8080/'
                },
                message: 'Ruta no encontrada'
            });
        });
        this.app.listen(this.port, callback).on('error', console.log);
    }

    static init(port: number): Server {
        return new Server(port);
    }
}
