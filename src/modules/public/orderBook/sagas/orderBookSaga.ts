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
        console.log(action);
        console.log(action.payload);
        const market = action.payload;
        console.log(market.id);
        if (!market.id) {
            console.log('no market id');
            throw new Error(`ERROR: Empty market provided to orderBookSaga`);
        }
        console.log('orderBookOptions');
        console.log(orderBookOptions);
        const orderBook = yield call(API.get(orderBookOptions), `/public/markets/${market.id}/order-book`);
        console.log('orderBook');
        console.log(orderBook);
        yield put(orderBookData(orderBook));
    } catch (error) {
        yield put(orderBookError(error));
    }
}
