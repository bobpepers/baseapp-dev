import classNames from 'classnames';
import * as React from 'react';
import {
    Grid,
    CircularProgress,
} from '@material-ui/core';
import {
    InjectedIntlProps,
    injectIntl
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction
} from 'react-redux';
import {
    Decimal,
} from '../../components';
import {
    accumulateVolume,
    //calcMaxVolume,
    sortAsks,
    sortBids
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

interface State {
    width: number;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

class OrderBookContainer extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.orderRef = React.createRef();
    }

    private orderRef;

    public render() {
        const {
            asks,
            bids,
            orderBookLoading,
        } = this.props;

        return (
            <div className="orderBook" ref={this.orderRef}>
                <div className={'cr-table-header__content'}>
                    {this.props.intl.formatMessage({id: 'page.body.trade.orderbook'})}
                </div>
                {orderBookLoading ? <div className="orderBook-loader"><CircularProgress disableShrink /></div> : this.orderBook(sortBids(bids), sortAsks(asks))}
            </div>
        );
    }

    private orderBook = (bids, asks) => {
        const { intl, currentMarket, marketTickers } = this.props;
        const defaultTicker = {
            last: 0,
            price_change_percent: '+0.00%',
        };
        const asksData = asks.slice(0).reverse();
        const arrayBids: any = this.renderOrderBook(bids, 'bids', this.props.intl.formatMessage({id: 'page.noDataToShow'}), this.props.currentMarket);
        const arrayAsks: any = this.renderOrderBook(asksData, 'asks', this.props.intl.formatMessage({id: 'page.noDataToShow'}), this.props.currentMarket);
        const totalBids = arrayBids[arrayBids.length - 1][4];
        const totalAsks = arrayAsks[0][4];
        console.log(arrayAsks);

        return (
            <Grid container style={{"height" : "100%"}}>
                <Grid item xs={12} style={{"height" : "5%"}} className="orderbook-text-color">
                    <Grid container>
                        <Grid container item xs={3} justify="center">
                            {intl.formatMessage({id: 'page.body.trade.orderbook.header.price'})}
                            &nbsp
                            (
                                {currentMarket && currentMarket.quote_unit.toUpperCase()}
                            )
                        </Grid>
                        <Grid container item xs={3} justify="center">
                            {intl.formatMessage({id: 'page.body.trade.orderbook.header.amount'})}
                            &nbsp
                            (
                                {currentMarket && currentMarket.base_unit.toUpperCase()}
                            )
                        </Grid>
                        <Grid container item xs={3} justify="center">
                            {intl.formatMessage({id: 'page.body.trade.orderbook.header.estvalue'})}
                            &nbsp
                            (
                                {currentMarket && currentMarket.quote_unit.toUpperCase()}
                            )
                        </Grid>
                        <Grid container item xs={3} justify="center">
                            {intl.formatMessage({id: 'page.body.trade.orderbook.header.volume'})}
                            &nbsp
                            (
                                {currentMarket && currentMarket.base_unit.toUpperCase()}
                            )
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} className="orderbook-text-color" style={{"height" : "44%", "display": "flex", "alignItems": "flex-end", "flexDirection": "row"}}>
                    <div style={{"flex" : "0 0 auto", "width": "100%"}}>
                    {arrayAsks.map((object, i) => {
                        const currentPercentage = Math.floor((object[4] / totalAsks) * 100);
                        if (object[0] === "empty") {
                            return (
                                <Grid container key={i} className="orderbook-border-top" style={{"position": "relative"}}>
                                    <Grid container item xs={12} justify="center" style={{"zIndex": 30}}>
                                        {object[1]}
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid container key={i} onClick={e => this.handleOnSelectAsks(e, i)} className="orderbook-border-top orderbook-item" style={{"position": "relative", "cursor": "pointer"}}>
                                    <Grid container item xs={3} justify="center" style={{"zIndex": 30}}>
                                        {object[0]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{"zIndex": 30}}>
                                        {object[1]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{"zIndex": 30}}>
                                        {object[2]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{"zIndex": 30}}>
                                        {object[3]}
                                    </Grid>
                                    <span style={{"backgroundColor": "rgba(215, 38, 44, 0.2)", "position": "absolute", "right": "0", "top": "0", "bottom": "0", "zIndex": 20, "width": `${currentPercentage}%`}}/>
                                </Grid>
                            );
                        }
                    })}
                    </div>
                </Grid>
                <Grid container item xs={12} justify="center" className="orderbook-border-both" style={{"height" : "7%"}}>
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
                                            {Decimal.format(Number((marketTickers[currentMarket.id] || defaultTicker).last), currentMarket.price_precision)} {currentMarket.quote_unit.toUpperCase()}
                                        </Grid>
                                        <Grid container item xs={12} justify="center" className="orderbook-text-color">
                                            {this.props.intl.formatMessage({id: 'page.body.trade.orderbook.lastMarket'})}
                                        </Grid>
                                    </Grid>
                                );
                           }
                           else {
                                return (
                                    <Grid container>
                                        <Grid container item xs={12} justify="center" className={'orderBook-negative'}>
                                            <span style={{"alignSelf" : "flex-end"}}>0</span>
                                        </Grid>
                                        <Grid container item xs={12} justify="center" className="orderbook-text-color">
                                            {this.props.intl.formatMessage({id: 'page.body.trade.orderbook.lastMarket'})}
                                        </Grid>
                                    </Grid>
                                )
                           }
                       })()
                    }
                </Grid>
                <Grid item xs={12} style={{"height" : "44%"}} className="orderbook-text-color">
                    {arrayBids.map((object, i) => {
                        const currentPercentage = Math.floor((object[4] / totalBids) * 100);
                        if (object[0] === "empty") {
                            return (
                                <Grid container key={i} className="orderbook-border-bottom" style={{"position": "relative"}}>
                                    <Grid container item xs={12} justify="center" style={{"zIndex": 30}}>
                                        {object[1]}
                                    </Grid>
                                </Grid>
                            );
                        } else {
                            return (
                                <Grid container key={i} onClick={e => this.handleOnSelectBids(e, i)} className="orderbook-border-bottom orderbook-item" style={{"position": "relative", "cursor": "pointer"}}>
                                    <Grid container item xs={3} justify="center" style={{"zIndex": 30}}>
                                        {object[0]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{"zIndex": 30}}>
                                        {object[1]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{"zIndex": 30}}>
                                        {object[2]}
                                    </Grid>
                                    <Grid container item xs={3} justify="center" style={{"zIndex": 30}}>
                                        {object[3]}
                                    </Grid>
                                    <span style={{"backgroundColor" : "rgba(0, 169, 44, 0.2)", "position": "absolute", "right": "0", "top": "0", "bottom": "0", "zIndex": 20, "width": `${currentPercentage}%`}}/>
                                </Grid>
                            );
                        }
                    })}
                </Grid>
            </Grid>
        );
    };


    private renderOrderBook = (array: string[][], side: string, message: string, currentMarket?: Market) => {
        let total = accumulateVolume(array);
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;


        return (array.length > 0) ? array.map((item, i) => {
            const [price, volume] = item;
            const estimateValue = Number(price) * Number(volume);
            switch (side) {
                case 'asks':
                    total = accumulateVolume(array.slice(0).reverse()).slice(0).reverse();

                    return [
                        <span key={i}><Decimal fixed={priceFixed} prevValue={array[i + 1] ? array[i + 1][0] : 0}>{price}</Decimal></span>,
                        <Decimal key={i} fixed={amountFixed}>{volume}</Decimal>,
                        <Decimal key={i} fixed={amountFixed}>{estimateValue}</Decimal>,
                        <Decimal key={i} fixed={amountFixed}>{total[i]}</Decimal>,
                        total[i],

                    ];
                default:
                    return [
                        <span key={i}><Decimal fixed={priceFixed} prevValue={array[i - 1] ? array[i - 1][0] : 0}>{price}</Decimal></span>,
                        <Decimal key={i} fixed={amountFixed}>{volume}</Decimal>,
                        <Decimal key={i} fixed={amountFixed}>{estimateValue}</Decimal>,
                        <Decimal key={i} fixed={amountFixed}>{total[i]}</Decimal>,
                        total[i],
                    ];
            }
        }) : [["empty", message]];
    };

    private handleOnSelectBids = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string) => {
        const { currentPrice, bids } = this.props;
        const priceToSet = bids[Number(index)] && Number(bids[Number(index)][0]);
        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };
    private handleOnSelectAsks = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, index: string) => {
        const { currentPrice, asks } = this.props;
        const asksData = asks.slice(0).reverse();
        const priceToSet = asksData[Number(index)] && Number(asksData[Number(index)][0]);
        if (currentPrice !== priceToSet) {
            this.props.setCurrentPrice(priceToSet);
        }
    };

}

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

export const OrderBook = injectIntl(connect(mapStateToProps, mapDispatchToProps)(OrderBookContainer));
export type OrderBookProps = ReduxProps;
