import * as actions from './actions';

describe('Metrics actions', () => {
    it('should check metrics fetch action creator', () => {
        const expectedAction = {type: 'METRICS_FETCH'};
        expect(actions.metricsFetch()).toEqual(expectedAction);
    });

    it('should check metrics data action creator', () => {
        // tslint:disable-next-line:no-any
        const payload = {metrics: {} as any as actions.Metrics};
        // tslint:disable-next-line:no-any
        const expectedAction = {type: 'METRICS_DATA', payload};
        expect(actions.metricsData(payload)).toEqual(expectedAction);
    });
});
