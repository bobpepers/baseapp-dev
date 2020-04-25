import React, { useEffect, FunctionComponent, memo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import BigNumber from 'bignumber.js';
import {
    InjectedIntlProps,
    injectIntl,
    FormattedMessage,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate, setTradeColor } from '../../helpers';
import {
    Market,
    PublicTrade,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    setCurrentPrice,
} from '../../modules';
import { recentTradesFetch, selectRecentTradesOfCurrentMarket } from '../../modules/public/recentTrades';

interface ReduxProps {
    recentTrades: PublicTrade[];
    currentMarket: Market | undefined;
    currentPrice: number | undefined;
}

interface DispatchProps {
    tradesFetch: typeof recentTradesFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

type Props = DispatchProps & ReduxProps & InjectedIntlProps;

const handleHighlightValue = (prevValue: string, curValue: string) => {
    let highlighted = '';
    let val = curValue;
    let prev = prevValue;

    while (val !== prev && val.length > 0) {
        highlighted = val[val.length - 1] + highlighted;
        val = val.slice(0, -1);
        prev = prev.slice(0, -1);
    }

    return (
        <React.Fragment>
            <span className="cr-decimal__opacity">{val}</span>
            <span>{highlighted}</span>
        </React.Fragment>
    );
};

const MarketComponent: FunctionComponent<Props> = props => {
    const {
        currentMarket,
        recentTrades,
        currentPrice,
    } = props;

    const fmt = {
        decimalSeparator: '.',
        groupSeparator: '',
    };

    useEffect( () => {
        props.tradesFetch(currentMarket);
    }, [currentMarket, props]);

    const getTrades: any = (trades: PublicTrade[]) => {
        const priceFixed: number = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed: number = currentMarket ? currentMarket.amount_precision : 0;
        const baseunit = currentMarket ? currentMarket.base_unit.toUpperCase() : '';
        const quoteunit = currentMarket ? currentMarket.quote_unit.toUpperCase() : '';

        const renderRow = (item, i) => {
            const { created_at, taker_type, price, amount } = item;
            const total = price * amount;
            const higlightedDate = handleHighlightValue(String(localeDate(trades[i - 1] ? trades[i - 1].created_at : '', 'fullDate')), String(localeDate(created_at, 'fullDate')));

            return [
                <span style={{ color: setTradeColor(taker_type).color }} key={i}>
                    {higlightedDate}
                </span>,
                <span style={{ color: setTradeColor(taker_type).color }} key={i}>
                    {(new BigNumber(amount).toFormat(amountFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1')} {baseunit}
                </span>,
                <span style={{ color: setTradeColor(taker_type).color }} key={i}>
                    {(new BigNumber(price).toFormat(priceFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1')} {quoteunit}
                </span>,
                <span style={{ color: setTradeColor(taker_type).color }} key={i}>
                    {(new BigNumber(total).toFormat(priceFixed + amountFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1')} {quoteunit}
                </span>,
            ];
        };

        return (trades.length > 0)
            ? trades.map(renderRow)
            : [[['']]];
    };

    const handleOnSelect = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, index: string) => {
        const priceToSet = recentTrades[Number(index)] ? recentTrades[Number(index)].price : '';

        if (currentPrice !== priceToSet) {
            props.setCurrentPrice(priceToSet);
        }
    };

    return (
        <Table aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell>
                        <span className="landingTable-cell">
                            <FormattedMessage id="page.body.trade.header.recentTrades.content.time"/>
                        </span>
                    </TableCell>
                    <TableCell>
                        <span className="landingTable-cell">
                            <FormattedMessage id="page.body.trade.header.recentTrades.content.amount"/>
                        </span>
                    </TableCell>
                    <TableCell>
                        <span className="landingTable-cell">
                            <FormattedMessage id="page.body.trade.header.recentTrades.content.price"/>
                        </span>
                    </TableCell>
                    <TableCell>
                        <span className="landingTable-cell">
                            <FormattedMessage id="page.body.trade.header.recentTrades.content.total"/>
                        </span>
                    </TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {getTrades(recentTrades).map((r, i) => {
                    const rowKey = String(i);

                    return (
                        <TableRow
                            key={rowKey}
                            onClick={e => handleOnSelect(e, rowKey)}
                            className="landingTable-row"
                        >
                            <TableCell>
                                {r[0]}
                            </TableCell>
                            <TableCell>
                                {r[1]}
                            </TableCell>
                            <TableCell>
                                {r[2]}
                            </TableCell>
                            <TableCell>
                                {r[3]}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
};

const mapStateToProps = (state: RootState): ReduxProps => ({
    recentTrades: selectRecentTradesOfCurrentMarket(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    tradesFetch: market => dispatch(recentTradesFetch(market)),
    setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
});

const marketComponentPropsAreEqual = (prevMarket, nextMarket) => {
    return JSON.stringify(prevMarket.recentTrades) === JSON.stringify(nextMarket.recentTrades)
        && JSON.stringify(prevMarket.currentMarket) === JSON.stringify(nextMarket.currentMarket);
};

const MarketTab = injectIntl(connect(mapStateToProps, mapDispatchToProps)(memo(MarketComponent, marketComponentPropsAreEqual)));

export {
    handleHighlightValue,
    MarketTab,
};
