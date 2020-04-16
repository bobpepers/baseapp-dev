import {takeLatest} from 'redux-saga/effects';
import {METRICS_FETCH} from '../../constants';
import {metricsSaga} from './metricsSaga';

export function* rootMetricsSaga() {
    yield takeLatest(METRICS_FETCH, metricsSaga);
}
