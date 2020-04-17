export interface Config {
    api: {
        authUrl: string;
        tradeUrl: string;
        applogicUrl: string;
        rangerUrl: string;
    };
    minutesUntilAutoLogout?: string;
    rangerReconnectPeriod?: string;
    withCredentials: boolean;
    storage: {
        defaultStorageLimit?: number;
    };
    captcha: {
        type?: string;
        siteKey?: string;
    };
    gaTrackerKey?: string;
    msAlertDisplayTime?: string;
    incrementalOrderBook: boolean;
    isResizable: boolean;
    isDraggable: boolean;
    languages: string[];
    passwordEntropyStep: number;
}
