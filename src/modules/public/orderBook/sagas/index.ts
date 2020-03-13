// tslint:disable-next-line
import { takeLatest } from 'redux-saga/effects';
import {
    DEPTH_FETCH,
    ORDER_BOOK_FETCH,
} from '../constants';
import { depthSaga } from './depthSaga';
import { orderBookSaga } from './orderBookSaga';

export function* rootOrderBookSaga() {
	console.log('takeLatest orderbook and depth');
    yield takeLatest(ORDER_BOOK_FETCH, orderBookSaga);
    console.log('takeLatest orderbook and depth2');
    yield takeLatest(DEPTH_FETCH, depthSaga);
}
