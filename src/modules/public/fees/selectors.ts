
import { RootState } from '../../index';
import { FeesState } from './reducer';
import { Fee } from './types';

const selectFeesState = (state: RootState): FeesState => state.public.fees;

console.log(selectFeesState);

export const selectFees = (state: RootState): Fee[] =>
    selectFeesState(state).list;

export const selectFeesLoading = (state: RootState): boolean | undefined =>
    selectFeesState(state).loading;
