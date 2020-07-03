//import { TabPanel } from '../../components';
import * as React from 'react';
import { OrderForm } from '../';

export type FormType = 'buy' | 'sell';

export type DropdownElem = number | string | React.ReactNode;

export interface OrderProps {
    type: FormType;
    orderType: string | React.ReactNode;
    price: number | string;
    amount: number | string;
    available: number;
}

export type OnSubmitCallback = (order: OrderProps) => void;

export interface OrderComponentProps {
    /**
     * Amount of money in base currency wallet
     */
    availableBase: number;
    /**
     * Amount of money in quote currency wallet
     */
    availableQuote: number;
    /**
     * Callback which is called when a form is submitted
     */
    onSubmit: OnSubmitCallback;
    /**
     * If orderType is 'Market' this value will be used as price for buy tab
     */
    priceMarketBuy: number;
    /**
     * If orderType is 'Market' this value will be used as price for sell tab
     */
    priceMarketSell: number;
    /**
     * If orderType is 'Limit' this value will be used as price
     */
    priceLimit?: number;
    /**
     * Name of currency for price field
     */
    from: string;
    /**
     * Name of currency for amount field
     */
    to: string;
    /**
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    handleSendType?: (index: number, label: string) => void;
    /**
     * Index of tab to switch on
     */
    /**
     * Precision of amount, total, available, fee value
     */
    currentMarketAskPrecision: number;
    /**
     * Precision of price value
     */
    currentMarketBidPrecision: number;
    /**
     * @default 'Order Type'
     * Text for order type dropdown label.
     */
    orderTypeText?: string;
    /**
     * @default 'Price'
     * Text for Price field Text.
     */
    priceText?: string;
    /**
     * @default 'Amount'
     * Text for Amount field Text.
     */
    amountText?: string;
    /**
     * @default 'Total'
     * Text for Total field Text.
     */
    totalText?: string;
    /**
     * @default 'Available'
     * Text for Available field Text.
     */
    availableText?: string;
    /**
     * @default 'BUY'
     * Text for buy order submit button.
     */
    submitBuyButtonText?: string;
    /**
     * @default 'SELL'
     * Text for sell order submit button.
     */
    submitSellButtonText?: string;
    /**
     * @default 'Buy'
     * Text for Buy tab label.
     */
    labelFirst?: string;
    /**
     * @default 'Sell'
     * Text for Sell tab label.
     */
    labelSecond?: string;
    orderTypes?: DropdownElem[];
    orderTypesIndex?: DropdownElem[];
    /**
     *
     */
    width?: number;
    /**
     * proposals for buy
     */
    bids: string[][];
    /**
     * proposals for sell
     */
    asks: string[][];
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
}

interface State {
    index: number;
}

interface Tab {
    content: React.ReactNode;
    disabled?: boolean;
    hidden?: boolean;
    label: string;
}

const defaultOrderTypes: DropdownElem[] = [
    'Limit',
    'Market',
];



class Order extends React.PureComponent<OrderComponentProps, State> {

    public state = {
        index: 0,
    };

    public render() {
        const contents = this.getPanels()
                .filter((panel, index) => index === this.state.index)
                .map(this.renderTabContent);
        return (
            <div className="cr-order">
                <div>
                    <ul className="nav nav-pills" role="tablist">
                            <li key={0} onClick={() => this.handleChangeTab(0, "Buy")}>
                                <span className={`nav-link ${this.state.index === 0 && 'active'}`}>
                                    Buy
                                </span>
                            </li>
                            <li key={1} onClick={() => this.handleChangeTab(1, "Sell")}>
                                <span className={`nav-link ${this.state.index === 1 && 'active'}`}>
                                    Sell
                                </span>
                            </li>
                    </ul>
                </div>
                <div className="cr-tab-panel">
                    {contents}
                </div>
            </div>
        );
    }

    private getPanels = () => {
        const {
            availableBase,
            availableQuote,
            disabled,
            priceMarketBuy,
            priceMarketSell,
            priceLimit,
            from,
            to,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            orderTypeText,
            priceText,
            amountText,
            totalText,
            availableText,
            submitBuyButtonText,
            submitSellButtonText,
            labelFirst,
            labelSecond,
            orderTypes,
            orderTypesIndex,
            asks,
            bids,
            listenInputPrice,
        } = this.props;

        return [
            {
                content: (
                    <OrderForm
                        proposals={asks}
                        disabled={disabled}
                        type="buy"
                        from={from}
                        to={to}
                        available={availableQuote}
                        priceMarket={priceMarketBuy}
                        priceLimit={priceLimit}
                        onSubmit={this.props.onSubmit}
                        orderTypes={orderTypes ? orderTypes : defaultOrderTypes}
                        orderTypesIndex={orderTypesIndex ? orderTypesIndex : defaultOrderTypes}
                        currentMarketAskPrecision={currentMarketAskPrecision}
                        currentMarketBidPrecision={currentMarketBidPrecision}
                        orderTypeText={orderTypeText}
                        priceText={priceText}
                        amountText={amountText}
                        totalText={totalText}
                        availableText={availableText}
                        submitButtonText={submitBuyButtonText}
                        listenInputPrice={listenInputPrice}
                    />
                ),
                label: labelFirst ? labelFirst : 'Buy',
            },
            {
                content: (
                    <OrderForm
                        proposals={bids}
                        type="sell"
                        from={from}
                        to={to}
                        available={availableBase}
                        priceMarket={priceMarketSell}
                        priceLimit={priceLimit}
                        onSubmit={this.props.onSubmit}
                        orderTypes={orderTypes ? orderTypes : defaultOrderTypes}
                        orderTypesIndex={orderTypesIndex ? orderTypesIndex : defaultOrderTypes}
                        currentMarketAskPrecision={currentMarketAskPrecision}
                        currentMarketBidPrecision={currentMarketBidPrecision}
                        orderTypeText={orderTypeText}
                        priceText={priceText}
                        amountText={amountText}
                        totalText={totalText}
                        availableText={availableText}
                        submitButtonText={submitSellButtonText}
                        listenInputPrice={listenInputPrice}
                    />
                ),
                label: labelSecond ? labelSecond : 'Sell',
            },
        ];
    };

    private renderTabContent = (tab: Tab, index: number) => {

        return (
            <div className="cr-tab-content__active cr-tab-content" key={`${tab.label}-${index}`}>
                {tab.content}
            </div>
        );
    };
/*
    private getPanelsBuy = () => {
        const {
            availableQuote,
            disabled,
            priceMarketBuy,
            priceLimit,
            from,
            to,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            orderTypeText,
            priceText,
            amountText,
            totalText,
            availableText,
            submitBuyButtonText,
            labelFirst,
            orderTypes,
            orderTypesIndex,
            asks,
            listenInputPrice,
        } = this.props;

        return [
            {
                content: (
                    <OrderForm
                        proposals={asks}
                        disabled={disabled}
                        type="buy"
                        from={from}
                        to={to}
                        available={availableQuote}
                        priceMarket={priceMarketBuy}
                        priceLimit={priceLimit}
                        onSubmit={this.props.onSubmit}
                        orderTypes={orderTypes ? orderTypes : defaultOrderTypes}
                        orderTypesIndex={orderTypesIndex ? orderTypesIndex : defaultOrderTypes}
                        currentMarketAskPrecision={currentMarketAskPrecision}
                        currentMarketBidPrecision={currentMarketBidPrecision}
                        orderTypeText={orderTypeText}
                        priceText={priceText}
                        amountText={amountText}
                        totalText={totalText}
                        availableText={availableText}
                        submitButtonText={submitBuyButtonText}
                        listenInputPrice={listenInputPrice}
                    />
                ),
                label: labelFirst ? labelFirst : 'Buy',
            },
        ];
    };

    private getPanelsSell = () => {
        const {
            availableBase,
            priceMarketSell,
            priceLimit,
            from,
            to,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            orderTypeText,
            priceText,
            amountText,
            totalText,
            availableText,
            submitSellButtonText,
            labelSecond,
            orderTypes,
            orderTypesIndex,
            bids,
            listenInputPrice,
        } = this.props;

        return [
            {
                content: (
                    <OrderForm
                        proposals={bids}
                        type="sell"
                        from={from}
                        to={to}
                        available={availableBase}
                        priceMarket={priceMarketSell}
                        priceLimit={priceLimit}
                        onSubmit={this.props.onSubmit}
                        orderTypes={orderTypes ? orderTypes : defaultOrderTypes}
                        orderTypesIndex={orderTypesIndex ? orderTypesIndex : defaultOrderTypes}
                        currentMarketAskPrecision={currentMarketAskPrecision}
                        currentMarketBidPrecision={currentMarketBidPrecision}
                        orderTypeText={orderTypeText}
                        priceText={priceText}
                        amountText={amountText}
                        totalText={totalText}
                        availableText={availableText}
                        submitButtonText={submitSellButtonText}
                        listenInputPrice={listenInputPrice}
                    />
                ),
                label: labelSecond ? labelSecond : 'Sell',
            },
        ];
    };
*/
    private handleChangeTab = (index: number, label?: string) => {
        console.log(index);
        console.log(label);
        if (this.props.handleSendType && label) {
          this.props.handleSendType(index, label);
        }

        this.setState({
            index: index,
        });
    };
}

export {
    Order,
};
