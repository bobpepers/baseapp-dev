import * as actions from './actions';
import {initialMetricsState, metricsReducer} from './reducer';

describe('Metrics reducer', () => {
    it('should handle metrics fetch', () => {
        expect(metricsReducer(initialMetricsState, actions.metricsFetch())).toEqual(initialMetricsState);
    });

    it('should handle metrics data', () => {
        const payload: actions.MetricsData['payload'] = {
            metrics: {
                signups: 1,
                sucessful_logins: 1,
                failed_logins: 1,
                pending_applications: 1,
            },
        };
        const expectedState = {
            ...initialMetricsState,
            metrics: payload.metrics,
        };
        expect(metricsReducer(initialMetricsState, actions.metricsData(payload))).toEqual(expectedState);
    });
});
