import {
    ALERT_DATA,
    ALERT_DELETE,
    ALERT_DELETE_BY_INDEX,
    ALERT_PUSH,
} from '../constants';

export interface AdminAlert {
    type: string;
    code?: number;
    message: string[];
}

export interface AdminAlertPush {
    type: typeof ALERT_PUSH;
    payload: AdminAlert;
}

export interface AdminAlertData {
    type: typeof ALERT_DATA;
    payload: AdminAlert;
}

export interface AdminAlertDelete {
    type: typeof ALERT_DELETE;
}

export interface AdminAlertDeleteByIndex {
    type: typeof ALERT_DELETE_BY_INDEX;
    index: number;
}

export type AdminAlertAction =
    AdminAlertPush
    | AdminAlertData
    | AdminAlertDelete
    | AdminAlertDeleteByIndex;

export const adminAlertPush = (payload: AdminAlertPush['payload']): AdminAlertPush => ({
    type: ALERT_PUSH,
    payload,
});

export const adminAlertData = (payload: AdminAlertData['payload']): AdminAlertData => ({
    type: ALERT_DATA,
    payload,
});

export const adminAlertDelete = (): AdminAlertDelete => ({
    type: ALERT_DELETE,
});

export const adminAlertDeleteByIndex = (index: number): AdminAlertDeleteByIndex => ({
    type: ALERT_DELETE_BY_INDEX,
    index,
});
