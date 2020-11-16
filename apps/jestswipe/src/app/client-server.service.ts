import { inject, injectable } from 'inversify';

@injectable()
export class ClientServerService {

    get isClient() {
        return !this.isServer;
    }

    constructor(@inject("isServer") public isServer: boolean) {

    }
}