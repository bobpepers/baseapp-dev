import { call, put } from 'redux-saga/effects';
import { API, RequestOptions } from '../../../../api';
import { adminAlertPush } from '../../adminAlert';
import { metricsData } from '../actions';

const requestOptions: RequestOptions = {
    apiVersion: 'barong',
    withHeaders: true,
};

export function* metricsSaga() {
    try {
        const metrics = yield call(API.get(requestOptions), '/admin/metrics');
        console.log(metrics);
        console.log(metrics.data);
        yield put(metricsData({ metrics: metrics.data }));
    } catch (error) {
        yield put(adminAlertPush({ message: error.message, code: error.code, type: 'error' }));
    }
}
