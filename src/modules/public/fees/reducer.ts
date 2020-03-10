import { CommonState } from '../../types';
import { FeesAction } from './actions';
import {
    FEES_DATA,
    FEES_ERROR,
    FEES_FETCH,
} from './constants';
import { Fee } from './types';

export interface FeesState extends CommonState {
    list: Fee[];
    loading: boolean;
}

export const initialFeesState: FeesState = {
    list: [],
    loading: false,
};

export const feesReducer = (state = initialFeesState, action: FeesAction) => {
    switch (action.type) {
        case FEES_FETCH:
            return {
                ...state,
                loading: true,
            };
        case FEES_DATA:
            return {
                ...state,
                loading: false,
                list: action.payload,
            };
        case FEES_ERROR:
            return {
                ...state,
                loading: false,
            };
        default:
            return state;
    }
};
