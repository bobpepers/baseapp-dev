import { RootState } from '../../index';
import { AdminAlertState } from './reducer';

export const selectAdminAlertState = (state: RootState): AdminAlertState => state.admin.alerts;
