// tslint:disable-next-line
import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import {
  orderBookData,
  orderBookError,
  OrderBookFetch,
} from '../actions';

const orderBookOptions: RequestOptions = {
  apiVersion: 'peatio',
};

export function* orderBookSaga(action: OrderBookFetch) {
    console.log('function orderbooksage');
    try {
        console.log('orderBookSaga 123');

        const market = action.payload;
        console.log(market.id);
        if (!market.id) {
            console.log('no market id');
            throw new Error(`ERROR: Empty market provided to orderBookSaga`);
        }

        const orderBook = yield call(API.get(orderBookOptions), `/public/markets/${market.id}/order-book`);
        console.log('orderBook');
        console.log(orderBook);
        yield put(orderBookData(orderBook));
    } catch (error) {
        yield put(orderBookError(error));
    }
}
