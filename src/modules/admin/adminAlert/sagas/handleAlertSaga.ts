import { delay } from 'redux-saga';
import { put } from 'redux-saga/effects';
import { msAlertDisplayTime } from '../../../../api/config';
import { adminAlertData, adminAlertDelete, AdminAlertPush } from '../actions';

export function* handleAdminAlertSaga(action: AdminAlertPush) {
    yield put(adminAlertData(action.payload));
    yield delay(parseFloat(msAlertDisplayTime()));
    yield put(adminAlertDelete());
}
