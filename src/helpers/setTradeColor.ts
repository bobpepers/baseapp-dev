const tradesColorMapping = {
    buy: {
        color: 'var(--green)',
    },
    sell: {
        color: 'var(--red)',
    },
};

export const setTradeColor = (side: string) => tradesColorMapping[side] || { color: ''};
