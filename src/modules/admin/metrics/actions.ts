import {METRICS_DATA, METRICS_FETCH} from '../constants';

export interface Metrics {
    signups: {};
    sucessful_logins: {};
    failed_logins: {};
    pending_applications: number;
}

export interface MetricsFetch {
    type: typeof METRICS_FETCH;
}

export interface MetricsData {
    type: typeof METRICS_DATA;
    payload: {
        metrics: Metrics,
    };
}

export type MetricsAction =
    MetricsFetch | MetricsData;

export const metricsFetch = (): MetricsFetch => ({
    type: METRICS_FETCH,
});

export const metricsData = (payload: MetricsData['payload']): MetricsData => ({
    type: METRICS_DATA,
    payload,
});
