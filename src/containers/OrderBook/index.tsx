import classNames from 'classnames';
import React, { FunctionComponent, memo } from 'react';
import BigNumber from 'bignumber.js';
import {
    Grid,
    CircularProgress,
} from '@material-ui/core';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
} from 'react-redux';
import {
    accumulateVolume,
    //calcMaxVolume,
    sortAsks,
    sortBids,
} from '../../helpers';
import {
    Market,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    selectDepthAsks,
    selectDepthBids,
    selectDepthLoading,
    selectMarketTickers,
    setCurrentPrice,
} from '../../modules';

interface ReduxProps {
    asks: string[][];
    bids: string[][];
    currentMarket: Market | undefined;
    currentPrice: number | undefined;
    orderBookLoading: boolean;
}

interface DispatchProps {
    setCurrentPrice: typeof setCurrentPrice;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;


const OrderBookContainer: FunctionComponent<Props> = props => {
    const {
        asks,
        bids,
        orderBookLoading,
        intl,
        currentMarket,
        marketTickers,
        currentPrice,
    } = props;

    const fmt = {
        decimalSeparator: '.',
        groupSeparator: '',
    };

    return (
        <div className="orderBook">
            <div className="trading-component-header">
                {intl.formatMessage({id: 'page.body.trade.orderbook'})}
            </div>
            {orderBookLoading ? <div className="orderBook-loader"><CircularProgress disableShrink /></div> : smallOrderBook(sortBids(bids), sortAsks(asks), currentMarket, currentPrice, marketTickers, props.setCurrentPrice, fmt, intl)}
        </div>
    );

};

const BuyBookContainer: FunctionComponent<Props> = props => {
    const {
        asks,
        bids,
        orderBookLoading,
        intl,
        currentMarket,
        marketTickers,
        currentPrice,
    } = props;

    const fmt = {
        decimalSeparator: '.',
        groupSeparator: '',
    };

    return (
        <div className="orderBook bigbook-background">
            {orderBookLoading ? <div className="orderBook-loader"><CircularProgress disableShrink /></div> : bigBuyBook(sortBids(bids), sortAsks(asks), currentMarket, currentPrice, marketTickers, props.setCurrentPrice, fmt, intl)}
        </div>
    );

};

const SellBookContainer: FunctionComponent<Props> = props => {
    const {
        asks,
        bids,
        orderBookLoading,
        intl,
        currentMarket,
        marketTickers,
        currentPrice,
    } = props;

    const fmt = {
        decimalSeparator: '.',
        groupSeparator: '',
    };

    return (
        <div className="orderBook bigbook-background">
            {orderBookLoading ? <div className="orderBook-loader"><CircularProgress disableShrink /></div> : bigSellBook(sortBids(bids), sortAsks(asks), currentMarket, currentPrice, marketTickers, props.setCurrentPrice, fmt, intl)}
        </div>
    );

};

const LastPriceContainer: FunctionComponent<Props> = props => {
    const {
        orderBookLoading,
        intl,
        currentMarket,
        marketTickers,
        currentPrice,
    } = props;

    const fmt = {
        decimalSeparator: '.',
        groupSeparator: '',
    };

    return (
        <div className="lastPriceContainer">
            {orderBookLoading ? <div className="orderBook-loader"><CircularProgress disableShrink /></div> : lastPriceOrderBook(currentMarket, currentPrice, marketTickers, fmt, intl)}
        </div>
    );

};

const bigBuyBook = (bids, asks, currentMarket, currentPrice, marketTickers, setCurrentPrice1, fmt, intl) => {
    const arrayBids: any = renderOrderBook(bids, 'bids', intl.formatMessage({id: 'page.noDataToShow'}), 'big', fmt, currentMarket);
    const totalBids = arrayBids[arrayBids.length - 1][4];

    return (
        <Grid container style={{height: '100%', position: 'relative'}}>
            <Grid item xs={12} className="orderbook-text-color bigbook-header orderbook-border-bottom">
                <Grid container>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.volume'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.base_unit.toUpperCase()}
                        )
                    </Grid>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.estvalue'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.quote_unit.toUpperCase()}
                        )
                    </Grid>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.amount'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.base_unit.toUpperCase()}
                        )
                    </Grid>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.price'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.quote_unit.toUpperCase()}
                        )
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className="orderbook-text-color bigbook-scrollable-content">
                    {arrayBids.map((object, i) => {
                        const currentPercentage = Math.floor((object[4] / totalBids) * 100);
                        if (object[0] === 'empty') {
                            return (
                                <Grid container key={i} className="orderbook-border-bottom" style={{position: 'relative'}}>
                                    <Grid container item xs={12} justify="center" style={{zIndex: 30}}>
                                        {object[1]}
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid container key={i} onClick={e => handleOnSelectBids(e, i, currentPrice, bids, setCurrentPrice1)} className="orderbook-border-bottom orderbook-item" style={{position: 'relative', cursor: 'pointer'}}>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[3]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[2]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[1]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[0]}
                                    </Grid>
                                    <span style={{backgroundColor: 'rgba(0, 169, 44, 0.2)', position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 20, width: `${currentPercentage}%`}}/>
                                </Grid>
                            );
                        }
                    })}
            </Grid>
        </Grid>
    );
};

const bigSellBook = (bids, asks, currentMarket, currentPrice, marketTickers, setCurrentPrice1, fmt, intl) => {
    const asksData = asks.slice(0).reverse();
    const arrayAsks: any = renderOrderBook(asks, 'asks', intl.formatMessage({id: 'page.noDataToShow'}), 'big', fmt, currentMarket);
    const totalAsks = arrayAsks[arrayAsks.length - 1][4];
    console.log(arrayAsks);
    console.log(totalAsks);

    return (
        <Grid container style={{height: '100%', position: 'relative'}}>
            <Grid item xs={12} className="orderbook-text-color bigbook-header orderbook-border-bottom">
                <Grid container>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.price'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.quote_unit.toUpperCase()}
                        )
                    </Grid>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.amount'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.base_unit.toUpperCase()}
                        )
                    </Grid>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.estvalue'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.quote_unit.toUpperCase()}
                        )
                    </Grid>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.volume'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.base_unit.toUpperCase()}
                        )
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className="orderbook-text-color bigbook-scrollable-content bigbook-scrollbar-left">
                    {arrayAsks.map((object, i) => {
                        const currentPercentage = Math.floor((object[4] / totalAsks) * 100);
                        if (object[0] === 'empty') {
                            return (
                                <Grid container key={i} className="orderbook-border-bottom" style={{position: 'relative'}}>
                                    <Grid container item xs={12} justify="center" style={{zIndex: 30}}>
                                        {object[1]}
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid container key={i} onClick={e => handleOnSelectAsks(e, i, currentPrice, asksData, setCurrentPrice1)} className="orderbook-border-bottom orderbook-item" style={{position: 'relative', cursor: 'pointer'}}>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[3]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[2]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[1]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[0]}
                                    </Grid>
                                    <span style={{backgroundColor: 'rgba(215, 38, 44, 0.2)', position: 'absolute', left: 0, top: 0, bottom: 0, zIndex: 20, width: `${currentPercentage}%`}}/>
                                </Grid>
                            );
                        }
                    })}
            </Grid>
        </Grid>
    );
};

const lastPriceOrderBook = (currentMarket, currentPrice, marketTickers, fmt, intl) => {
    const defaultTicker = {
        last: 0,
        price_change_percent: '+0.00%',
    };

    return (
        <Grid container>
            <Grid container item xs={12} justify="center">
                {
                    (() => {
                        if (currentMarket && marketTickers[currentMarket.id] && marketTickers[currentMarket.id].price_change_percent) {
                            const cn = classNames('', {
                                'orderBook-negative': (marketTickers[currentMarket.id] || defaultTicker).price_change_percent.includes('-'),
                                'orderBook-positive': (marketTickers[currentMarket.id] || defaultTicker).price_change_percent.includes('+'),
                            });

                            return (
                                <Grid container>
                                    <Grid container item xs={12} justify="center" className={cn}>
                                        {new BigNumber(Number((marketTickers[currentMarket.id] || defaultTicker).last)).toFormat(currentMarket.price_precision, fmt).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1')} {currentMarket.quote_unit.toUpperCase()}
                                    </Grid>
                                    <Grid container item xs={12} justify="center" className="orderbook-text-color">
                                        {intl.formatMessage({id: 'page.body.trade.orderbook.lastMarket'})}
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid container>
                                    <Grid container item xs={12} justify="center" className={'orderBook-negative'}>
                                        <span style={{alignSelf: 'flex-end'}}>0</span>
                                    </Grid>
                                    <Grid container item xs={12} justify="center" className="orderbook-text-color">
                                        {intl.formatMessage({id: 'page.body.trade.orderbook.lastMarket'})}
                                    </Grid>
                                </Grid>
                            );
                        }
                    })()
                }
            </Grid>
        </Grid>
    );
};

const smallOrderBook = (bids, asks, currentMarket, currentPrice, marketTickers, setCurrentPrice1, fmt, intl) => {
    const defaultTicker = {
        last: 0,
        price_change_percent: '+0.00%',
    };
    const asksData = asks.slice(0).reverse();
    const arrayBids: any = renderOrderBook(bids, 'bids', intl.formatMessage({id: 'page.noDataToShow'}), 'small', fmt, currentMarket);
    const arrayAsks: any = renderOrderBook(asksData, 'asks', intl.formatMessage({id: 'page.noDataToShow'}), 'small', fmt, currentMarket);
    const totalBids = arrayBids[arrayBids.length - 1][4];
    const totalAsks = arrayAsks[0][4];

    return (
        <Grid container style={{height: '100%'}}>
            <Grid item xs={12} style={{height : '5%'}} className="orderbook-text-color">
                <Grid container>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.price'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.quote_unit.toUpperCase()}
                        )
                    </Grid>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.amount'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.base_unit.toUpperCase()}
                        )
                    </Grid>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.estvalue'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.quote_unit.toUpperCase()}
                        )
                    </Grid>
                    <Grid container item xs={3} justify="center">
                        {intl.formatMessage({id: 'page.body.trade.orderbook.header.volume'})}
                        &nbsp;
                        (
                            {currentMarket && currentMarket.base_unit.toUpperCase()}
                        )
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} className="orderbook-text-color orderbook-group-container-height orderbook-scrollable-content-top">
                <div style={{flex : '0 0 auto', width: '100%'}}>
                    {arrayAsks.map((object, i) => {
                        const currentPercentage = Math.floor((object[4] / totalAsks) * 100);
                        if (object[0] === 'empty') {
                            return (
                                <Grid container key={i} className="orderbook-border-top" style={{position: 'relative'}}>
                                    <Grid container item xs={12} justify="center" style={{zIndex: 30}}>
                                        {object[1]}
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid container key={i} onClick={e => handleOnSelectAsks(e, i, currentPrice, asks, setCurrentPrice1)} className="orderbook-border-top orderbook-item" style={{position: 'relative', cursor: 'pointer'}}>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[0]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[1]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[2]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[3]}
                                    </Grid>
                                    <span style={{backgroundColor: 'rgba(215, 38, 44, 0.2)', position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 20, width: `${currentPercentage}%`}}/>
                                </Grid>
                            );
                        }
                    })}
                </div>
            </Grid>
            <Grid container item xs={12} justify="center" className="orderbook-border-both" style={{height: '7%'}}>
                {
                    (() => {
                        if (currentMarket && marketTickers[currentMarket.id] && marketTickers[currentMarket.id].price_change_percent) {
                            const cn = classNames('', {
                                'orderBook-negative': (marketTickers[currentMarket.id] || defaultTicker).price_change_percent.includes('-'),
                                'orderBook-positive': (marketTickers[currentMarket.id] || defaultTicker).price_change_percent.includes('+'),
                            });

                            return (
                                <Grid container>
                                    <Grid container item xs={12} justify="center" className={cn}>
                                        {new BigNumber(Number((marketTickers[currentMarket.id] || defaultTicker).last)).toFormat(currentMarket.price_precision, fmt).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1')} {currentMarket.quote_unit.toUpperCase()}
                                    </Grid>
                                    <Grid container item xs={12} justify="center" className="orderbook-text-color">
                                        {intl.formatMessage({id: 'page.body.trade.orderbook.lastMarket'})}
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid container>
                                    <Grid container item xs={12} justify="center" className={'orderBook-negative'}>
                                        <span style={{alignSelf: 'flex-end'}}>0</span>
                                    </Grid>
                                    <Grid container item xs={12} justify="center" className="orderbook-text-color">
                                        {intl.formatMessage({id: 'page.body.trade.orderbook.lastMarket'})}
                                    </Grid>
                                </Grid>
                            );
                        }
                    })()
                }
            </Grid>
            <Grid item xs={12} className="orderbook-text-color orderbook-group-container-bottom orderbook-group-container-height">
                <div className="orderbook-scrollable-content-bottom">
                    {arrayBids.map((object, i) => {
                        const currentPercentage = Math.floor((object[4] / totalBids) * 100);
                        if (object[0] === 'empty') {
                            return (
                                <Grid container key={i} className="orderbook-border-bottom" style={{position: 'relative'}}>
                                    <Grid container item xs={12} justify="center" style={{zIndex: 30}}>
                                        {object[1]}
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid container key={i} onClick={e => handleOnSelectBids(e, i, currentPrice, bids, setCurrentPrice1)} className="orderbook-border-bottom orderbook-item" style={{position: 'relative', cursor: 'pointer'}}>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[0]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[1]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[2]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{zIndex: 30}}>
                                        {object[3]}
                                    </Grid>
                                    <span style={{backgroundColor: 'rgba(0, 169, 44, 0.2)', position: 'absolute', right: 0, top: 0, bottom: 0, zIndex: 20, width: `${currentPercentage}%`}}/>
                                </Grid>
                            );
                        }
                    })}
                </div>
            </Grid>
        </Grid>
    );
};

const renderOrderBook = (array: string[][], side: string, message: string, bookType: string, fmt, currentMarket?: Market) => {
    let total = accumulateVolume(array);
    const priceFixed = currentMarket ? currentMarket.price_precision : 0;
    const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

    return (array.length > 0) ? array.map((item, i) => {
        const [price, volume] = item;
        const estimateValue = Number(price) * Number(volume);
        switch (true) {
            case (side === 'asks' && bookType === 'small'):
                total = accumulateVolume(array.slice(0).reverse()).slice(0).reverse();

                return [
                    (new BigNumber(price).toFormat(priceFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
                    (new BigNumber(volume).toFormat(amountFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
                    (new BigNumber(estimateValue).toFormat(amountFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
                    (new BigNumber(total[i]).toFormat(amountFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
                    total[i],

                ];
            default:
                return [
                    (new BigNumber(price).toFormat(priceFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
                    (new BigNumber(volume).toFormat(amountFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
                    (new BigNumber(estimateValue).toFormat(amountFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
                    (new BigNumber(total[i]).toFormat(amountFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
                    total[i],
                ];
        }
    }) : [['empty', message]];
};

const handleOnSelectBids = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string, currentPrice: number, bids: any[], setCurrentPrice1) => {
    const priceToSet = bids[Number(index)] && Number(bids[Number(index)][0]);
    if (currentPrice !== priceToSet) {
        setCurrentPrice1(priceToSet);
    }
};

const handleOnSelectAsks = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string, currentPrice: number, asks: any[], setCurrentPrice1) => {
    const asksData = asks.slice(0).reverse();
    const priceToSet = asksData[Number(index)] && Number(asksData[Number(index)][0]);
    if (currentPrice !== priceToSet) {
        setCurrentPrice1(priceToSet);
    }
};

const mapStateToProps = (state: RootState) => ({
    bids: selectDepthBids(state),
    asks: selectDepthAsks(state),
    orderBookLoading: selectDepthLoading(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
    marketTickers: selectMarketTickers(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    });

const areEqual = (prev, next) => {
    return JSON.stringify(prev.asks) === JSON.stringify(next.asks)
        && JSON.stringify(prev.bids) === JSON.stringify(next.bids)
        && JSON.stringify(prev.currentMarket) === JSON.stringify(next.currentMarket)
        && JSON.stringify(prev.currentPrice) === JSON.stringify(next.currentPrice);
};

const OrderBook = injectIntl(connect(mapStateToProps, mapDispatchToProps)(memo(OrderBookContainer, areEqual)));
const BuyBook = injectIntl(connect(mapStateToProps, mapDispatchToProps)(memo(BuyBookContainer, areEqual)));
const SellBook = injectIntl(connect(mapStateToProps, mapDispatchToProps)(memo(SellBookContainer, areEqual)));
const LastPrice = injectIntl(connect(mapStateToProps, mapDispatchToProps)(memo(LastPriceContainer, areEqual)));
export type OrderBookProps = ReduxProps;

export {
    OrderBook,
    BuyBook,
    SellBook,
    LastPrice,
};
