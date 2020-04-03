import MockAdapter from 'axios-mock-adapter';
import { MockStoreEnhanced } from 'redux-mock-store';
import createSagaMiddleware, { SagaMiddleware } from 'redux-saga';
import { rootSaga } from '../../..';
import { mockNetworkError, setupMockAxios, setupMockStore } from '../../../../helpers/jest';
import { alertData, alertPush } from '../../alert';
import {
    feesData,
    feesError,
    feesFetch,
} from '../actions';
import { Fee } from '../types';

// tslint:disable no-any no-magic-numbers
describe('Saga: feesFetchSaga', () => {
    let store: MockStoreEnhanced;
    let sagaMiddleware: SagaMiddleware<{}>;
    let mockAxios: MockAdapter;

    beforeEach(() => {
        mockAxios = setupMockAxios();
        sagaMiddleware = createSagaMiddleware();
        store = setupMockStore(sagaMiddleware, false)();
        sagaMiddleware.run(rootSaga);
    });

    afterEach(() => {
        mockAxios.reset();
    });

    const fakeFees: Fee[] = [
        {
            id: '1',
            group: 'any',
            market_id: 'any',
            maker: '0.15',
            taker: '0.15',
            created_at: '2020-02-29T21:00:52+01:00',
            updated_at: '2020-02-29T21:00:52+01:00',
        },

        {
            id: '2',
            group: 'runebase-member',
            market_id: 'any',
            maker: '0.1',
            taker: '0.1',
            created_at: '2020-02-29T21:00:52+01:00',
            updated_at: '2020-02-29T21:00:52+01:00',
        },
    ];

    const mockFees = () => {
        mockAxios.onGet('/public/trading_fees').reply(200, fakeFees);
    };

    const alertDataPayload = {
        message: ['Server error'],
        code: 500,
        type: 'error',
    };

    it('should fetch fees', async () => {
        const expectedActions = [feesFetch(), feesData(fakeFees)];
        mockFees();
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
                if (actions.length > expectedActions.length) {
                    fail(`Unexpected action: ${JSON.stringify(actions.slice(-1)[0])}`);
                }
            });
        });
        store.dispatch(feesFetch());

        return promise;
    });

    it('should trigger an error on fees fetch', async () => {
        const expectedActions = [feesFetch(), feesError(), alertPush(alertDataPayload), alertData(alertDataPayload)];
        mockNetworkError(mockAxios);
        const promise = new Promise(resolve => {
            store.subscribe(() => {
                const actions = store.getActions();
                if (actions.length === expectedActions.length) {
                    expect(actions).toEqual(expectedActions);
                    setTimeout(resolve, 0.01);
                }
                if (actions.length > expectedActions.length) {
                    fail(`Unexpected action: ${JSON.stringify(actions.slice(-1)[0])}`);
                }
            });
        });
        store.dispatch(feesFetch());

        return promise;
    });
});
