import { RootState } from '../../index';

export const selectMetrics = (state: RootState) => state.admin.metrics.metrics;
