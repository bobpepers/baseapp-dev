import {METRICS_DATA} from '../constants';
import {Metrics, MetricsAction} from './actions';

export interface MetricsState {
    metrics: Metrics;
}

export const initialMetricsState: MetricsState = {
    metrics: {signups: {}, sucessful_logins: {}, failed_logins: {}, pending_applications: 0},
};

export const metricsReducer = (state = initialMetricsState, action: MetricsAction) => {
    switch (action.type) {
        case METRICS_DATA:
            return {
                ...state,
                metrics: action.payload.metrics,
            };
        default:
            return {
                ...state,
            };
    }
};
