import Axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { Action, Middleware } from 'redux';
import configureMockStore from 'redux-mock-store';
// tslint:disable-next-line
import * as WebSocket from 'ws';

// tslint:disable no-any no-console
export const loggerMiddleware: Middleware = (store: {}) => (next: any) => (action: Action) => {
    console.log(`dispatching: ${JSON.stringify(action)}`);

    return next(action);
};

export const setupMockStore = (appMiddleware: Middleware, log = false) => {
    const middlewares = log ? [loggerMiddleware, appMiddleware] : [appMiddleware];

    return configureMockStore(middlewares);
};

export const setupMockAxios = () => {
    return new MockAdapter(Axios);
};

export const mockNetworkError = (mockAxios: any) => {
    mockAxios.onAny().networkError();
};

export const createEchoServer = (port: number, debug: boolean) => {
    const server = new WebSocket.Server({ port: port });
    server.on('connection', (ws, request) => {
        if (debug) {
            ws.addEventListener('open', () => {
                console.log(`Ping Server: listening on port ${port}`);
            });
        }
        ws.on('message', (message: string) => {
            if (debug) {
                console.log(`Ping Server: sending back ${message}`);
            }
            ws.send(message);
        });
    });

    return server;
};
