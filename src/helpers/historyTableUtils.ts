export const depositColorMapping = {
    accepted: 'var(--green)',
    collected: 'var(--green)',
    submitted: '',
    canceled: 'var(--red)',
    rejected: 'var(--red)',
};

export const withdrawColorMapping = {
    prepared: '',
    submitted: '',
    canceled: 'var(--red)',
    accepted: 'var(--green)',
    suspected: '',
    rejected: 'var(--red)',
    processing: '',
    succeed: 'var(--green)',
    failed: 'var(--red)',
    errored: 'var(--red)',
    confirming: '',
};

export const tradesColorMapping = {
    sell: {
        color: 'var(--red)',
        text: 'Sell',
    },
    buy: {
        color: 'var(--green)',
        text: 'Buy',
    },
};

export const setDepositStatusColor = (status: string): string => depositColorMapping[status];

export const setWithdrawStatusColor = (status: string): string => withdrawColorMapping[status];

export const setTradesType = (type: string) => tradesColorMapping[type] || { color: '', text: '' };
