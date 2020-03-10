import * as React from 'react';
import { connect, MapDispatchToProps } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteProps, withRouter } from 'react-router-dom';
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

class Fees extends React.Component<Props> {
    public componentDidMount() {
        if (!this.props.currencies.length) {
            this.props.currenciesFetch();
        }
        if (!this.props.fees.length) {
            this.props.feesFetch();
        }
    }

    public renderTradeFeeBlock() {
        const { fees } = this.props;
        console.log(fees);
        return (
            <div className="pg-landing-screen__market-info">
                <div className="pg-landing-screen__market-info__wrap">
                    <h2>{this.translate('page.body.feesTable.trade.header')}</h2>
                    <div className="pg-ticker-table">
                        <div className="pg-ticker-table__table-wrap">
                            <table className="pg-ticker-table__table">
                                <thead>
                                    <tr>
                                        <th scope="col">{this.translate('page.body.feesTable.trade.header.group')}</th>
                                        <th scope="col">{this.translate('page.body.feesTable.trade.header.market')}</th>
                                        <th scope="col">{this.translate('page.body.feesTable.trade.header.makerfee')}</th>
                                        <th scope="col">{this.translate('page.body.feesTable.trade.header.takerfee')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fees[0] && fees.map(this.renderTradeFeeItem)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public renderCoinFeeBlock() {
        const { currencies } = this.props;
        console.log(currencies);
        return (
            <div className="pg-landing-screen__market-info">
                <div className="pg-landing-screen__market-info__wrap">
                    <h2>{this.translate('page.body.feesTable.coin.header')}</h2>
                    <div className="pg-ticker-table">
                        <div className="pg-ticker-table__table-wrap">
                            <table className="pg-ticker-table__table">
                                <thead>
                                    <tr>
                                        <th scope="col">{this.translate('page.body.feesTable.coin.header.name')}</th>
                                        <th scope="col">{this.translate('page.body.feesTable.coin.header.ticker')}</th>
                                        <th scope="col">{this.translate('page.body.feesTable.coin.header.mindeposit')}</th>
                                        <th scope="col">{this.translate('page.body.feesTable.coin.header.feedeposit')}</th>
                                        <th scope="col">{this.translate('page.body.feesTable.coin.header.minwithdraw')}</th>
                                        <th scope="col">{this.translate('page.body.feesTable.coin.header.feewithdraw')}</th>
                                        <th scope="col">{this.translate('page.body.feesTable.coin.header.limitwithdraw24')}</th>
                                        <th scope="col">{this.translate('page.body.feesTable.coin.header.limitwithdraw72')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currencies[0] && currencies.map(this.renderCoinFeeItem)}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    public render() {
        return (
            <div className="pg-landing-screen">
                {this.renderTradeFeeBlock()}
                {this.renderCoinFeeBlock()}
            </div>
        );
    }

    private renderTradeFeeItem = (trade, index: number) => {
        return (
            <tr key={index}>
                <td>
                    <div>
                        {trade && trade.group}
                    </div>
                </td>
                <td>
                    <span>
                       {trade && trade.market_id}
                    </span>
                </td>
                <td>
                    <span>
                        {trade && trade.maker}%
                    </span>
                </td>
                <td>
                    <span>
                        {trade && trade.taker}%
                    </span>
                </td>
            </tr>
        );
    };

    private renderCoinFeeItem = (currency, index: number) => {
        return (
            <tr key={index}>
                <td>
                    <div>
                        {currency && currency.name}
                    </div>
                </td>
                <td>
                    <span>
                       {currency && currency.id}
                    </span>
                </td>
                <td>
                    <span>
                        {currency && currency.min_deposit_amount}
                    </span>
                </td>
                <td>
                    <span>
                        {currency && currency.deposit_fee}
                    </span>
                </td>
                <td>
                    <span>
                        {currency && currency.min_withdraw_amount}
                    </span>
                </td>
                <td>
                    <span>
                        {currency && currency.withdraw_fee}
                    </span>
                </td>
                <td>
                    <span>
                        {currency && currency.withdraw_limit_24h}
                    </span>
                </td>
                <td>
                    <span>
                        {currency && currency.withdraw_limit_72h}
                    </span>
                </td>
            </tr>
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
