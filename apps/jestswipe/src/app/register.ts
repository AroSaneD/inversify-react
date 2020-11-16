import { Container } from 'inversify';
import { ClientServerService } from './client-server.service';

export function registerDependencies() {
    const container = new Container();

    container.bind(ClientServerService).toSelf();

    return container;
}