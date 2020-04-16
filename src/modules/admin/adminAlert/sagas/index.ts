import { takeEvery } from 'redux-saga/effects';
import { ALERT_PUSH } from '../../constants';
import { handleAdminAlertSaga } from './handleAlertSaga';

export function* rootHandleAdminAlertSaga() {
    yield takeEvery(ALERT_PUSH, handleAdminAlertSaga);
}
