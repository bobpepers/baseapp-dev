import React, { FunctionComponent, memo, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@material-ui/core';
import BigNumber from 'bignumber.js';
import {
    InjectedIntlProps,
    injectIntl,
    FormattedMessage,
} from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate, setTradesType } from '../../helpers';
import {
    fetchHistory,
    Market,
    RootState,
    selectCurrentMarket,
    selectCurrentPrice,
    selectFullHistory,
    selectHistory,
    selectHistoryLoading,
    selectMarkets,
    setCurrentPrice,
    WalletHistoryList,
} from '../../modules';
import { handleHighlightValue } from './Market';

interface ReduxProps {
    marketsData: Market[];
    list: WalletHistoryList;
    fetching: boolean;
    fullHistory: number;
    currentMarket: Market | undefined;
    currentPrice: number | undefined;
}

interface DispatchProps {
    fetchHistory: typeof fetchHistory;
    setCurrentPrice: typeof setCurrentPrice;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

const timeFrom = Math.floor((Date.now() - 1000 * 60 * 60 * 24) / 1000);

const YoursComponent: FunctionComponent<Props> = props => {
    const {
        currentMarket,
        fetchHistory,
        fetching,
        list,
        currentPrice,
    } = props;

    const fmt = {
        decimalSeparator: '.',
        groupSeparator: '',
    };

    useEffect( () => {
        console.log('currentmarket updated');
        fetchHistory({ type: 'trades', page: 0, time_from: timeFrom, market: currentMarket.id});
    }, [currentMarket, fetchHistory]);

    const renderContent = () => {
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
                    {retrieveData().map((r, i) => {
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

    const renderRow = (item, i) => {
        const { id, created_at, price, amount, side } = item;
        const priceFixed = currentMarket ? currentMarket.price_precision : 0;
        const amountFixed = currentMarket ? currentMarket.amount_precision : 0;
        const baseunit = currentMarket ? currentMarket.base_unit.toUpperCase() : "";
        const quoteunit = currentMarket ? currentMarket.quote_unit.toUpperCase() : "";
        const total = price * amount;
        const orderSide = side === 'sell' ?  'sell' : 'buy';
        const higlightedDate = handleHighlightValue(String(localeDate([...list][i - 1] ? [...list][i - 1].created_at : '', 'fullDate')), String(localeDate(created_at, 'fullDate')));

        return [
            <span style={{ color: setTradesType(orderSide).color }} key={id}>
                {higlightedDate}
            </span>,
            <span style={{ color: setTradesType(orderSide).color }} key={id}>
                {(new BigNumber(amount).toFormat(amountFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1')} {baseunit}
            </span>,
            <span style={{ color: setTradesType(orderSide).color }} key={id}>
                {(new BigNumber(price).toFormat(priceFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1')} {quoteunit}
            </span>,
            <span style={{ color: setTradesType(orderSide).color }} key={id}>
                {(new BigNumber(total).toFormat(priceFixed + amountFixed, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1')} {quoteunit}
            </span>,
        ];
    };

    const retrieveData: any = () => {

        return [...list].length > 0
            ? [...list].map(renderRow)
            : [[['']]];
    };


    const handleOnSelect = (e: React.MouseEvent<HTMLTableRowElement, MouseEvent>, index: string) => {
        const priceToSet = list[Number(index)] ? list[Number(index)].price : '';

        if (currentPrice !== priceToSet) {
            setCurrentPrice(priceToSet);
        }
    };

    console.log(fetching);
    return (
        <div>
            {fetching ?
                <div className="cr-tab-content-loading">
                    <CircularProgress disableShrink />
                </div> : renderContent()
            }
        </div>
    );

}

const mapStateToProps = (state: RootState): ReduxProps => ({
    marketsData: selectMarkets(state),
    list: selectHistory(state),
    fetching: selectHistoryLoading(state),
    fullHistory: selectFullHistory(state),
    currentMarket: selectCurrentMarket(state),
    currentPrice: selectCurrentPrice(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        fetchHistory: params => dispatch(fetchHistory(params)),
        setCurrentPrice: payload => dispatch(setCurrentPrice(payload)),
    });

const areEqual = (prevMarket, nextMarket) => {
    return JSON.stringify(prevMarket.recentTrades) === JSON.stringify(nextMarket.recentTrades)
        && JSON.stringify(prevMarket.list) === JSON.stringify(nextMarket.list)
        && JSON.stringify(prevMarket.currentMarket) === JSON.stringify(nextMarket.currentMarket);
}

const YoursTab = injectIntl(connect(mapStateToProps, mapDispatchToProps)(memo(YoursComponent, areEqual)));

export {
    YoursTab,
};
