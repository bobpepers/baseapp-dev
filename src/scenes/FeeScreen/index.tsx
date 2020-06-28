import React, { Component, Fragment } from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteProps, withRouter } from 'react-router-dom';
import { Grid, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import {
    RootState,
    selectUserLoggedIn,
    currenciesFetch,
    Currency,
    selectCurrencies,
    feesFetch,
    Fee,
    selectFees,
} from '../../modules';
import { setDocumentTitle } from '../../helpers';

interface ReduxProps {
    isLoggedIn: boolean;
    currencies: Currency[];
    fees: Fee[];
}

interface DispatchProps {
    feesFetch: typeof feesFetch;
    currenciesFetch: typeof currenciesFetch;
}

type Props = ReduxProps & RouteProps & InjectedIntlProps;

class Fees extends Component<Props> {
    public componentDidMount() {
        setDocumentTitle('Fees');
        if (!this.props.currencies.length) {
            this.props.currenciesFetch();
        }
        if (!this.props.fees.length) {
            this.props.feesFetch();
        }
    }

    public renderTradeFeeBlock() {
        const { fees } = this.props;

        return (
            <Grid container className="mb-32 wrapper-container">
                <Grid item xs={12} className="gridItemCenter">
                    <h2>{this.translate('page.body.feesTable.trade.header')}</h2>
                </Grid>
                <TableContainer className="landingTable">
                    <Table aria-label="simple table">
                        <TableHead className="landingTable-head">
                            <TableRow>
                                <TableCell>
                                    <span className="landingTable-cell">
                                        {this.translate('page.body.feesTable.trade.header.group')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {this.translate('page.body.feesTable.trade.header.market')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {this.translate('page.body.feesTable.trade.header.makerfee')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {this.translate('page.body.feesTable.trade.header.takerfee')}
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {fees[0] && fees.map(this.renderTradeFeeItem)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        );
    }

    public renderCoinFeeBlock() {
        const { currencies } = this.props;

        return (
            <Grid container className="wrapper-container">
                <Grid item xs={12} className="gridItemCenter">
                    <h2>{this.translate('page.body.feesTable.coin.header')}</h2>
                </Grid>
                <TableContainer className="landingTable">
                    <Table aria-label="simple table">
                        <TableHead className="landingTable-head">
                            <TableRow>
                                <TableCell>
                                    <span className="landingTable-cell">
                                        {this.translate('page.body.feesTable.coin.header.name')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {this.translate('page.body.feesTable.coin.header.ticker')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {this.translate('page.body.feesTable.coin.header.mindeposit')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {this.translate('page.body.feesTable.coin.header.feedeposit')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {this.translate('page.body.feesTable.coin.header.minwithdraw')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {this.translate('page.body.feesTable.coin.header.feewithdraw')}
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {currencies[0] && currencies.map(this.renderCoinFeeItem)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Grid>
        );
    }

    public render() {
        return (
            <Fragment>
                {this.renderTradeFeeBlock()}
                {this.renderCoinFeeBlock()}
            </Fragment>
        );
    }

    private renderTradeFeeItem = (trade, index: number) => {
        return (
            <TableRow key={index} className="landingTable-row">
                <TableCell>
                    <span className="landingTable-cell">
                        {trade && trade.group}
                    </span>
                </TableCell>
                <TableCell align="right">
                    <span className="landingTable-cell">
                       {trade && trade.market_id}
                    </span>
                </TableCell>
                <TableCell align="right">
                    <span className="landingTable-cell">
                        {trade && (trade.maker * 100)}%
                    </span>
                </TableCell>
                <TableCell align="right">
                    <span className="landingTable-cell">
                        {trade && (trade.taker * 100)}%
                    </span>
                </TableCell>
            </TableRow>
        );
    };

    private renderCoinFeeItem = (currency, index: number) => {
        return (
            <TableRow key={index} className="landingTable-row">
                <TableCell>
                    <span className="landingTable-cell">
                        {currency && currency.name}
                    </span>
                </TableCell>
                <TableCell align="right">
                    <span className="landingTable-cell">
                       {currency && (currency.id).toUpperCase()}
                    </span>
                </TableCell>
                <TableCell align="right">
                    <span className="landingTable-cell">
                        {currency && currency.min_deposit_amount}
                    </span>
                </TableCell>
                <TableCell align="right">
                    <span className="landingTable-cell">
                        {currency && currency.deposit_fee}
                    </span>
                </TableCell>
                <TableCell align="right">
                    <span className="landingTable-cell">
                        {currency && currency.min_withdraw_amount}
                    </span>
                </TableCell>
                <TableCell align="right">
                    <span className="landingTable-cell">
                        {currency && currency.withdraw_fee}
                    </span>
                </TableCell>
            </TableRow>
        );
    };

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
    currencies: selectCurrencies(state),
    fees: selectFees(state),
});


const mapDispatchToProps: MapDispatchToProps<DispatchProps, {}> = dispatch => ({
    currenciesFetch: () => dispatch(currenciesFetch()),
    feesFetch: () => dispatch(feesFetch()),
});

// tslint:disable no-any
export const FeeScreen = withRouter(injectIntl(connect(mapStateToProps, mapDispatchToProps)(Fees) as any));
