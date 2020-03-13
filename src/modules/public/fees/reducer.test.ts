import * as actions from './actions';
import {
    feesReducer,
    FeesState,
    initialFeesState,
} from './reducer';
import { Fee } from './types';

describe('Fees reducer', () => {
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

    it('should handle FEES_FETCH', () => {
        const expectedState: FeesState = {
            ...initialFeesState,
            loading: true,
        };
        expect(feesReducer(initialFeesState, actions.feesFetch())).toEqual(expectedState);
    });

    it('should handle MARKETS_DATA', () => {
        const expectedState: FeesState = {
            ...initialFeesState,
            loading: false,
            list: fakeFees,
        };
        expect(feesReducer(initialFeesState, actions.feesData(fakeFees))).toEqual(expectedState);
    });

    it('should handle MARKETS_ERROR', () => {
        const expectedState: FeesState = {
            ...initialFeesState,
            loading: false,
        };
        expect(feesReducer(initialFeesState, actions.feesError())).toEqual(expectedState);
    });
});
