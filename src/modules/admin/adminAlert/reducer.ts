import {
    ALERT_DATA,
    ALERT_DELETE,
    ALERT_DELETE_BY_INDEX,
} from '../constants';
import { AdminAlert, AdminAlertAction } from './actions';

export interface AdminAlertState {
    alerts: AdminAlert[];
}

export const initialAdminAlertState: AdminAlertState = { alerts: [] };

export const adminAlertReducer = (state = initialAdminAlertState, action: AdminAlertAction) => {
    switch (action.type) {
        case ALERT_DATA:
            return {
                alerts: [...state.alerts, action.payload],
            };
        case ALERT_DELETE:
            return {
                alerts: [...state.alerts.slice(1, state.alerts.length)],
            };
        case ALERT_DELETE_BY_INDEX:
            return {
                alerts: [...state.alerts.slice(0, action.index).concat(...state.alerts.slice(action.index + 1))],
            };
        default:
            return state;
    }
};
