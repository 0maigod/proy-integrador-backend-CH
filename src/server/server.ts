import express from 'express';

export default class Server {
    public app: express.Application;

    constructor(private port: number) {
        this.app = express();
    }

    start(callback: any) {
        this.app.listen(this.port, callback).on('error', console.log);
    }

    static init(port: number): Server {
        return new Server(port);
    }
}
