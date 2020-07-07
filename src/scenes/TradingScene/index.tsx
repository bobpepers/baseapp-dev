import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { incrementalOrderBook } from '../../api';
import { Decimal } from '../../components/Decimal';
//import { Grid } from '../../components/Grid';
import { Grid } from '@material-ui/core';
import {
    MarketSelection,
    OpenOrdersComponent,
    OrderBook,
    SellBook,
    BuyBook,
    LastPrice,
    OrderComponent,
    RecentTrades,
    TradeInfoBar,
    TradingChart,
} from '../../containers';
import { getUrlPart, setDocumentTitle } from '../../helpers';
import {
    RootState,
    selectCurrentMarket,
    selectMarketTickers,
    selectUserInfo,
    selectUserLoggedIn,
    setCurrentMarket,
    setCurrentPrice,
    Ticker,
    User,
} from '../../modules';
import { GridLayoutState, saveLayouts, selectGridLayoutState } from '../../modules/public/gridLayout';
import { Market, marketsFetch, selectMarkets } from '../../modules/public/markets';
import { depthFetch } from '../../modules/public/orderBook';
import { rangerConnectFetch, RangerConnectFetch } from '../../modules/public/ranger';
import { RangerState } from '../../modules/public/ranger/reducer';
import { selectRanger } from '../../modules/public/ranger/selectors';
import { selectWallets, Wallet, walletsFetch } from '../../modules/user/wallets';

interface ReduxProps {
    currentMarket: Market | undefined;
    markets: Market[];
    wallets: Wallet [];
    user: User;
    rangerState: RangerState;
    userLoggedIn: boolean;
    rgl: GridLayoutState;
    tickers: {
        [pair: string]: Ticker,
    };
}

interface DispatchProps {
    depthFetch: typeof depthFetch;
    marketsFetch: typeof marketsFetch;
    accountWallets: typeof walletsFetch;
    rangerConnect: typeof rangerConnectFetch;
    setCurrentPrice: typeof setCurrentPrice;
    setCurrentMarket: typeof setCurrentMarket;
    saveLayouts: typeof saveLayouts;
}

interface StateProps {
    orderComponentResized: number;
    orderBookComponentResized: number;
    width: number;
    height: number;
}

type Props = DispatchProps & ReduxProps & RouteComponentProps & InjectedIntlProps;

class Trading extends React.Component<Props, StateProps> {
    public state = {
        orderComponentResized: 5,
        orderBookComponentResized: 5,
        width: 0,
        height: 0,
    };

    public updateDimensions = () => {
        this.setState({ width: window.innerWidth, height: window.innerHeight });
    };

    public componentDidMount() {
        setDocumentTitle('Trading');
        window.addEventListener('resize', this.updateDimensions);
        this.setState({ width: window.innerWidth, height: window.innerHeight });
        const { wallets, markets, currentMarket, userLoggedIn, rangerState: { connected, withAuth } } = this.props;

        if (markets.length < 1) {
            this.props.marketsFetch();
        }
        if (!wallets || wallets.length === 0) {
            this.props.accountWallets();
        }
        if (currentMarket && !incrementalOrderBook()) {
            this.props.depthFetch(currentMarket);
        }
        if (!connected) {
            this.props.rangerConnect({ withAuth: userLoggedIn });
        }

        if (userLoggedIn && !withAuth) {
            this.props.rangerConnect({ withAuth: userLoggedIn });
        }
    }

    public componentWillUnmount() {
        this.props.setCurrentPrice(undefined);
        window.removeEventListener('resize', this.updateDimensions);
    }

    public UNSAFE_componentWillReceiveProps(nextProps) {
        const {
            history,
            markets,
            userLoggedIn,
        } = this.props;

        if (userLoggedIn !== nextProps.userLoggedIn) {
            this.props.rangerConnect({ withAuth: nextProps.userLoggedIn });
        }

        if (markets.length !== nextProps.markets.length) {
            this.setMarketFromUrlIfExists(nextProps.markets);
        }

        if (nextProps.currentMarket) {
            const marketFromUrl = history.location.pathname.split('/');
            const marketNotMatched = nextProps.currentMarket.id !== marketFromUrl[marketFromUrl.length - 1];
            if (marketNotMatched) {
                history.replace(`/trading/${nextProps.currentMarket.id}`);

                if (!incrementalOrderBook()) {
                  this.props.depthFetch(nextProps.currentMarket);
                }
            }
        }

        if (nextProps.currentMarket && nextProps.tickers) {
            this.setTradingTitle(nextProps.currentMarket, nextProps.tickers);
        }
    }

    public render() {
        const bigContainer = {
            margin: 0,
        };
        const bigRow1 = {
            margin: 0,
        };
        const bigRow2 = {
            height: "700px",
            margin: 0,
        };
        const bigRow3 = {
            height: "445.75px",
            margin: 0,
        };
        const bigRow4 = {
            height: "445.75px",
            margin: 0,
        };
        const bigRow5 = {
            height: "445.75px",
            margin: 0,
        };
        const smallContainer = {
            margin: 0,
        };
        const smallRow1 = {
            margin: 0,
        };
        const smallRow2 = {
            height: "700px",
            margin: 0,
        };
        const smallRow3 = {
            height: "700px",
            margin: 0,
        };
        const smallRow4 = {
            height: "600px",
            margin: 0,
        };
        const smallRow5 = {
            margin: 0,
        };
        const smallRow6 = {
            height: "445.75px",
            margin: 0,
        };
        const smallRow7 = {
            height: "445.75px",
            margin: 0,
        };
        const columnHeight = {
            height: "100%",
        };
        if (this.state.width > 996) {
            return (
                <div className="trade-scene">
                    <Grid container xs={12} spacing={1} style={bigContainer}>
                        <Grid container item xs={12} spacing={1} style={bigRow1}>
                            <Grid item xs={12} style={columnHeight} className="infobar-wrapper">
                                <TradeInfoBar />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={1} style={bigRow2}>
                            <Grid item xs={7} style={columnHeight}>
                                <TradingChart />
                            </Grid>
                            <Grid item xs={5} style={columnHeight}>
                                <MarketSelection />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={1} style={bigRow3}>
                            <Grid item xs={4} style={columnHeight}>
                                <BuyBook />
                            </Grid>
                            <Grid container item xs={4} style={columnHeight}>
                                <Grid item xs={12}>
                                    <LastPrice />
                                </Grid>
                                <Grid item xs={12}>
                                    <OrderComponent size={this.state.orderComponentResized} />
                                </Grid>
                            </Grid>
                            <Grid item xs={4} style={columnHeight}>
                                <SellBook />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={1} style={bigRow4} className="my-orders">
                            <Grid item xs={12} style={columnHeight}>
                                <OpenOrdersComponent />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={1} style={bigRow5} className="market-history">
                            <Grid item xs={12} style={columnHeight}>
                                <RecentTrades />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            );
        } else {
            return (
                <div className="trade-scene">
                    <Grid container xs={12} spacing={1} style={smallContainer}>
                        <Grid container item xs={12} spacing={1} style={smallRow1}>
                            <Grid item xs={12} style={columnHeight} className="infobar-wrapper">
                                <TradeInfoBar />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={1} style={smallRow2}>
                            <Grid item xs={12} style={columnHeight}>
                                <MarketSelection />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={1}style={smallRow3}>
                            <Grid item xs={12} style={columnHeight}>
                                <TradingChart />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={1} style={smallRow4}>
                            <Grid item xs={12} style={columnHeight}>
                                <OrderBook size={this.state.orderBookComponentResized} />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={1} style={smallRow5}>
                            <Grid item xs={12} style={columnHeight}>
                                <OrderComponent size={this.state.orderComponentResized} />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={1} style={smallRow6} className="my-orders">
                            <Grid item xs={12} style={columnHeight}>
                                <OpenOrdersComponent />
                            </Grid>
                        </Grid>
                        <Grid container item xs={12} spacing={1} style={smallRow7} className="market-history">
                            <Grid item xs={12} style={columnHeight}>
                                <RecentTrades />
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            );
        }

    }

    private setMarketFromUrlIfExists = (markets: Market[]): void => {
        const urlMarket: string = getUrlPart(2, window.location.pathname);
        const market: Market | undefined = markets.find(item => item.id === urlMarket);

        if (market) {
            this.props.setCurrentMarket(market);
        }
    };

/*
    private setTradingTitle = (market: Market, tickers: ReduxProps['tickers']) => {
        const tickerPrice = tickers[market.id] ? tickers[market.id].last : '0.0';
        document.title = `${Decimal.format(tickerPrice, market.price_precision)} ${market.name}`;
    };
*/
    private setTradingTitle = (market: Market, tickers: ReduxProps['tickers']) => {
        const tickerPrice = tickers[market.id] ? tickers[market.id].last : '0.0';
        document.title = `RunesX - ${market.name} ${Decimal.format(tickerPrice, market.price_precision)} `;
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentMarket: selectCurrentMarket(state),
    markets: selectMarkets(state),
    wallets: selectWallets(state),
    user: selectUserInfo(state),
    rangerState: selectRanger(state),
    userLoggedIn: selectUserLoggedIn(state),
    rgl: selectGridLayoutState(state),
    tickers: selectMarketTickers(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    marketsFetch: () => dispatch(marketsFetch()),
    depthFetch: payload => dispatch(depthFetch(payload)),
    accountWallets: () => dispatch(walletsFetch()),
    rangerConnect: (payload: RangerConnectFetch['payload']) => dispatch(rangerConnectFetch(payload)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    setCurrentMarket: payload => dispatch(setCurrentMarket(payload)),
    saveLayouts: payload => dispatch(saveLayouts(payload)),
});

// tslint:disable-next-line no-any
const TradingScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Trading) as any));

export {
    TradingScreen,
};
