import React, { FunctionComponent, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, CircularProgress } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import classnames from 'classnames';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { localeDate, preciseData, setTradeColor } from '../../helpers';
import {
    Market,
    openOrdersCancelFetch,
    ordersCancelAllFetch,
    RootState,
    selectCancelOpenOrdersFetching,
    selectCurrentMarket,
    selectOpenOrdersFetching,
    selectOpenOrdersList,
    selectUserLoggedIn,
    userOpenOrdersFetch,
} from '../../modules';
import { OrderCommon } from '../../modules/types';

interface ReduxProps {
    currentMarket: Market | undefined;
    list: OrderCommon[];
    fetching: boolean;
    cancelFetching: boolean;
    userLoggedIn: boolean;
}

interface DispatchProps {
    userOpenOrdersFetch: typeof userOpenOrdersFetch;
    openOrdersCancelFetch: typeof openOrdersCancelFetch;
    ordersCancelAll: typeof ordersCancelAllFetch;
}

type Props = ReduxProps & DispatchProps & InjectedIntlProps;

const OpenOrdersContainer: FunctionComponent<Props> = props => {
    const {
        currentMarket,
        userLoggedIn,
        userOpenOrdersFetch,
        list,
        fetching,
        openOrdersCancelFetch,
        ordersCancelAll,
    } = props;

    useEffect( () => {
        if (userLoggedIn && currentMarket) {
            userOpenOrdersFetch({ market: currentMarket });
        }
    }, [currentMarket, userLoggedIn, userOpenOrdersFetch]);

    const classNames = classnames('pg-open-orders', {
        'pg-open-orders--empty': !list.length,
        'pg-open-orders--loading': fetching,
    });

    const renderData = () => {
        if (list.length === 0) {
            return [[['']]];
        }

        return list.map((item: OrderCommon) => {
            const { id, price, created_at, remaining_volume, origin_volume, side } = item;
            const executedVolume = Number(origin_volume) - Number(remaining_volume);
            const remainingAmount = Number(remaining_volume);
            const total = Number(origin_volume) * Number(price);
            const filled = ((executedVolume / Number(origin_volume)) * 100).toFixed(2);
            const priceFixed = currentMarket ? currentMarket.price_precision : 0;
            const amountFixed = currentMarket ? currentMarket.amount_precision : 0;

            return [
                <span style={{ color: setTradeColor(side).color }} key={id}>{localeDate(created_at, 'fullDate')}</span>,
                side,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(remainingAmount, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(price, priceFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{preciseData(total, amountFixed)}</span>,
                <span style={{ color: setTradeColor(side).color }} key={id}>{filled}%</span>,
            ];
        });
    };

    const handleCancel = (e, index: number) => {
        const orderToDelete = list[index];
        console.log(orderToDelete);
        openOrdersCancelFetch({ id: orderToDelete.id, list });
    };

    const handleCancelAll = () => {
        ordersCancelAll({market: currentMarket.id});
    };

    const openOrders = () => {
        const currentAskUnit = currentMarket ? ` (${currentMarket.base_unit.toUpperCase()})` : null;
        const currentBidUnit = currentMarket ? ` (${currentMarket.quote_unit.toUpperCase()})` : null;
        return (
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <span className="landingTable-cell">
                                <FormattedMessage id="page.body.trade.header.openOrders.content.date"/>
                            </span>
                        </TableCell>
                        <TableCell>
                            <span className="landingTable-cell">
                                <FormattedMessage id="page.body.trade.header.openOrders.content.type"/>
                            </span>
                        </TableCell>
                        <TableCell>
                            <span className="landingTable-cell">
                                <FormattedMessage id="page.body.trade.header.openOrders.content.amount"/> {currentAskUnit}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span className="landingTable-cell">
                                <FormattedMessage id="page.body.trade.header.openOrders.content.price"/> {currentBidUnit}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span className="landingTable-cell">
                                <FormattedMessage id="page.body.trade.header.openOrders.content.total"/> {currentBidUnit}
                            </span>
                        </TableCell>
                        <TableCell>
                            <span className="landingTable-cell">
                                <FormattedMessage id="page.body.trade.header.openOrders.content.filled"/>
                            </span>
                        </TableCell>
                        <TableCell>
                            <span className="landingTable-cell cancel-order-header-span">
                                <FormattedMessage id="page.body.trade.header.openOrders.content.cancel"/>
                            </span>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {renderData().map((r, i) => {
                        return (
                            <TableRow
                                key={String(i)}
                            >
                                <TableCell>
                                    {r[0]}
                                </TableCell>
                                <TableCell>
                                    <span style={{ color: setTradeColor(r[1]).color }}>
                                        {r[1]}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    {r[2]}
                                </TableCell>
                                <TableCell>
                                    {r[3]}
                                </TableCell>
                                <TableCell>
                                    {r[4]}
                                </TableCell>
                                <TableCell>
                                    {r[5]}
                                </TableCell>
                                <TableCell>
                                    {r[1] ? (
                                        <div onClick={e => handleCancel(e, i)} className="cancel-order">
                                            <CloseIcon style={{ color: setTradeColor(r[1]).color }} />
                                        </div>
                                    ) : (
                                        <span />
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    };

    return (
        <div className={classNames}>
            <div className="cr-table-header__content">
                <div className="cr-title-component">
                    <FormattedMessage id="page.body.trade.header.openOrders" />

                    <span className="cr-table-header__cancel" onClick={handleCancelAll}>
                        <FormattedMessage id="page.body.openOrders.header.button.cancelAll" />
                        <CloseIcon />
                    </span>
                </div>
            </div>
            {fetching ? <div className="open-order-loading"><CircularProgress disableShrink /></div> : openOrders()}
        </div>
    );
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    list: selectOpenOrdersList(state),
    fetching: selectOpenOrdersFetching(state),
    cancelFetching: selectCancelOpenOrdersFetching(state),
    userLoggedIn: selectUserLoggedIn(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    userOpenOrdersFetch: payload => dispatch(userOpenOrdersFetch(payload)),
    openOrdersCancelFetch: payload => dispatch(openOrdersCancelFetch(payload)),
    ordersCancelAll: payload => dispatch(ordersCancelAllFetch(payload)),
});

export type OpenOrdersProps = ReduxProps;

export const OpenOrdersComponent = injectIntl(
    connect(
        mapStateToProps,
        mapDispatchToProps,
    )(OpenOrdersContainer),
);
