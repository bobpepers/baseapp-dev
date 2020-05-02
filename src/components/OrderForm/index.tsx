import * as React from 'react';
import classnames from 'classnames';
import {
    withStyles,
    Theme,
} from '@material-ui/core/styles';
import {
    green,
    red,
} from '@material-ui/core/colors';
import {
    Button,
    Slider,
    InputLabel,
    FormControl,
    Select,
    MenuItem,
    InputAdornment,
    OutlinedInput,
} from '@material-ui/core';
import BigNumber from 'bignumber.js';
import { Decimal } from '../Decimal';
import {
    cleanPositiveFloatInput,
    getAmount,
    getTotalPrice
} from '../../helpers';
import { OrderProps } from '../Order';

// tslint:disable:no-magic-numbers jsx-no-lambda jsx-no-multiline-js
type OnSubmitCallback = (order: OrderProps) => void;
type DropdownElem = number | string | React.ReactNode;
type FormType = 'buy' | 'sell';

export interface OrderFormProps {
    /**
     * Price that is applied during total order amount calculation when type is Market
     */
    priceMarket: number;
    /**
     * Price that is applied during total order amount calculation when type is Market
     */
    priceLimit?: number;
    /**
     * Type of form, can be 'buy' or 'cell'
     */
    type: FormType;
    /**
     * Available types of order
     */
    orderTypes: DropdownElem[];
    /**
     * Available types of order without translations
     */
    orderTypesIndex: DropdownElem[];
    /**
     * Additional class name. By default element receives `cr-order` class
     * @default empty
     */
    className?: string;
    /**
     * Name of currency for price field
     */
    from: string;
    /**
     * Name of currency for amount field
     */
    to: string;
    /**
     * Amount of money in a wallet
     */
    available?: number;
    /**
     * Precision of amount, total, available, fee value
     */
    currentMarketAskPrecision: number;
    /**
     * Precision of price value
     */
    currentMarketBidPrecision: number;
    /**
     * Whether order is disabled to execute
     */
    disabled?: boolean;
    /**
     * Callback that is called when form is submitted
     */
    onSubmit: OnSubmitCallback;
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
     * @default type.toUpperCase()
     * Text for submit Button.
     */
    submitButtonText?: string;
    /**
     * proposal data for buy or sell [[price, volume]]
     */
    proposals: string[][];
    /**
     * start handling change price
     */
    listenInputPrice?: () => void;
}

interface OrderFormState {
    orderType: string | React.ReactNode;
    amount: string;
    price: string;
    priceMarket: number;
    currentMarketAskPrecision: number;
    currentMarketBidPrecision: number;
    amountFocused: boolean;
    priceFocused: boolean;
    sliderValue: number | number[];
    orderTypeSelected: number;
}

const handleSetValue = (value: string | number | undefined, defaultValue: string) => (
    value || defaultValue
);

const checkButtonIsDisabled = (safeAmount: number, safePrice: number, price: string, props: OrderFormProps, state: OrderFormState) => {
    const invalidAmount = safeAmount <= 0;
    const invalidLimitPrice = Number(price) <= 0 && state.orderType === 'Limit';
    const invalidMarketPrice = safePrice <= 0 && state.orderType === 'Market';

    return props.disabled || !props.available || invalidAmount || invalidLimitPrice || invalidMarketPrice;
};

const BuyButton = withStyles((theme: Theme) => ({
  root: {
    color: green[50],
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
}))(Button);

const SellButton = withStyles((theme: Theme) => ({
  root: {
    color: red[50],
    backgroundColor: red[500],
    '&:hover': {
      backgroundColor: red[700],
    },
  },
}))(Button);

const sliderMarks = [
  {
    value: 0,
    label: '0%',
  },
  {
    value: 25,
    label: '25%',
  },
  {
    value: 50,
    label: '50%',
  },
  {
    value: 75,
    label: '75%',
  },
  {
    value: 100,
    label: '100%',
  },
];

const fmt = {
    decimalSeparator: '.',
    groupSeparator: '',
};

export class OrderForm extends React.Component<OrderFormProps, OrderFormState> {
    constructor(props: OrderFormProps) {
        super(props);
        this.state = {
            orderType: 'Limit',
            amount: '',
            price: '',
            priceMarket: this.props.priceMarket,
            currentMarketAskPrecision: this.props.currentMarketAskPrecision || 6,
            currentMarketBidPrecision: this.props.currentMarketBidPrecision || 6,
            priceFocused: false,
            amountFocused: false,
            sliderValue: 0,
            orderTypeSelected: 0,
        };
    }

    public UNSAFE_componentWillReceiveProps(next: OrderFormProps) {
        const nextPriceLimitTruncated = Decimal.format(next.priceLimit, this.state.currentMarketBidPrecision);
        if (this.state.orderType === 'Limit' && next.priceLimit && nextPriceLimitTruncated !== this.state.price) {
            this.setState({
                price: nextPriceLimitTruncated,
            });
        }

        this.setState({
            priceMarket: next.priceMarket,
            currentMarketAskPrecision: next.currentMarketAskPrecision,
            currentMarketBidPrecision: next.currentMarketBidPrecision,
        });
    }

    public render() {
        const {
            type,
            orderTypes,
            className,
            from,
            to,
            available,
            //orderTypeText,
            priceText,
            amountText,
            totalText,
            availableText,
            submitButtonText,
            proposals,
        } = this.props;
        const {
            orderType,
            amount,
            price,
            priceMarket,
            currentMarketAskPrecision,
            currentMarketBidPrecision,
            //priceFocused,
            //amountFocused,
            sliderValue,
            orderTypeSelected,
        } = this.state;
        const safeAmount = Number(amount) || 0;
        const totalPrice = getTotalPrice(amount, proposals);
        const safePrice = totalPrice / Number(amount) || priceMarket;

        const total = orderType === 'Market'
            ? totalPrice : safeAmount * (Number(price) || 0);

        const cx = classnames('cr-order-form', className);
        const availablePrecision = type === 'buy' ? currentMarketBidPrecision : currentMarketAskPrecision;
        const availableCurrency = type === 'buy' ? from : to;
        console.log(orderTypes);

        return (
            <div className={cx}>
                <div className="order-item-wrapper">
                    <div className="ordertype-select">
                        <FormControl
                            variant="outlined"
                            style={{width: '100%'}}
                            className="ordertype-select"
                        >
                            <InputLabel htmlFor="outlined-ordertype-native-simple">OrderType</InputLabel>
                            <Select
                                MenuProps={{
                                    classes: { paper: "ordertype-option-wrapper" },
                                    anchorOrigin: {
                                        vertical: "bottom",
                                        horizontal: "left"
                                    },
                                    transformOrigin: {
                                        vertical: "top",
                                        horizontal: "left"
                                    },
                                    getContentAnchorEl: null
                                }}
                                value={orderTypeSelected}
                                onChange={this.handleOrderTypeChange}
                                label="OrderType"
                                inputProps={{
                                    name: 'orderType',
                                    id: 'outlined-ordertype-native-simple',
                                }}
                            >
                                <MenuItem
                                    value={0}
                                    className="ordertype-select-option"
                                >
                                    {orderTypes[0]}
                                </MenuItem>
                                <MenuItem
                                    value={1}
                                    className="ordertype-select-option"
                                >
                                    {orderTypes[1]}
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </div>
                </div>
                {orderType === 'Limit' ? (
                    <div className="order-item-wrapper">
                        <FormControl variant="outlined" fullWidth={true}>
                          <InputLabel htmlFor="outlined-adornment-order-price">{priceText}</InputLabel>
                          <OutlinedInput
                            id="outlined-adornment-order-price"
                            type={'number'}
                            value={handleSetValue(price, '')}
                            onChange={this.handlePriceChange}
                            endAdornment={
                                <InputAdornment
                                    position="end"
                                    className="text-end-input-price"
                                >
                                    <img src={`https://downloads.runebase.io/${from}.svg`} alt={`${from} icon`} className="fieldImage-input" />
                                    {from.toUpperCase()}
                                </InputAdornment>
                            }
                            labelWidth={70}
                          />
                        </FormControl>
                    </div>
                ) : (
                    <div className="order-item-wrapper">
                        <FormControl variant="outlined" fullWidth={true}>
                          <InputLabel htmlFor="outlined-adornment-order-price">{priceText}</InputLabel>
                          <OutlinedInput
                            inputProps={{
                                readOnly: Boolean(true),
                                disabled: Boolean(true),
                            }}
                            id="outlined-adornment-order-price"
                            type={'number'}
                            value={handleSetValue(Decimal.format(safePrice, currentMarketBidPrecision), '0')}
                            endAdornment={
                                <InputAdornment
                                    position="end"
                                    className="text-end-input-price"
                                >
                                    <img src={`https://downloads.runebase.io/${from}.svg`} alt={`${from} icon`} className="fieldImage-input" />
                                    {from.toUpperCase()}
                                </InputAdornment>
                            }
                            startAdornment={
                                <InputAdornment
                                    position="start"
                                    className="text-start-input-price"
                                >
                                    ~
                                </InputAdornment>
                            }
                            labelWidth={70}
                          />
                        </FormControl>
                    </div>
                )}
                <div className="order-item-wrapper">
                    <FormControl variant="outlined" fullWidth={true}>
                      <InputLabel htmlFor="outlined-adornment-order">{amountText}</InputLabel>
                      <OutlinedInput
                        id="outlined-adornment-order"
                        type={'number'}
                        value={handleSetValue(amount, '')}
                        onChange={this.handleAmountChange}
                        endAdornment={
                            <InputAdornment
                                position="end"
                                className="text-end-input-amount"
                            >
                                <img src={`https://downloads.runebase.io/${to}.svg`} alt={`${to} icon`} className="fieldImage-input" />
                                {to.toUpperCase()}
                            </InputAdornment>
                        }
                        labelWidth={70}
                      />
                    </FormControl>
                </div>

                <div className="order-slider-wrapper">
                    <Slider
                        value={typeof sliderValue === 'number' ? sliderValue : 0}
                        onChange={(e, val) => this.handleSliderChange(e, val, type)}
                        aria-labelledby="input-slider"
                        marks={sliderMarks}
                    />
                </div>

                <div className="order-item-wrapper">
                    <div className="order-total-wrapper">
                        <label>
                            {handleSetValue(totalText, 'Total')}
                        </label>
                        <div className="order-total-content">
                            {orderType === 'Limit' ? (
                                <span className="order-total-content-num">
                                    {new BigNumber(total).toFormat(currentMarketBidPrecision + currentMarketAskPrecision, fmt)}
                                    {/* Decimal.format(total, currentMarketBidPrecision + currentMarketAskPrecision) */}
                                </span>
                            ) : (
                                <span className="order-total-content-num">
                                    {new BigNumber(total).toFormat(currentMarketBidPrecision + currentMarketAskPrecision, fmt)}
                                    {'\u00A0'}{/* Decimal.format(total, currentMarketBidPrecision + currentMarketAskPrecision) */}
                                </span>
                            )}
                            <span className="order-total-coin">
                                {'\u00A0'}{from.toUpperCase()}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="order-item-wrapper">
                    <div className="order-amount-available-wrapper">
                        <label>
                            {handleSetValue(availableText, 'Available')}
                        </label>
                        <div className="order-amount-available-content">
                            <span className="order-amount-available-content-num">
                                {available ? Decimal.format(available, availablePrecision) : ''}
                            </span>
                            <span className="order-amount-available-content-num">
                               {'\u00A0'}{available ? availableCurrency.toUpperCase() : ''}
                            </span>
                        </div>
                    </div>
                </div>
                <div className="order-item-wrapper">
                    {type === 'buy' ? (
                        <BuyButton
                            variant="contained"
                            fullWidth={true}
                            disabled={checkButtonIsDisabled(safeAmount, safePrice, price, this.props, this.state)}
                            onClick={this.handleSubmit}
                        >
                            {submitButtonText || type}
                        </BuyButton>
                    ) : (
                        <SellButton
                            variant="contained"
                            fullWidth={true}
                            disabled={checkButtonIsDisabled(safeAmount, safePrice, price, this.props, this.state)}
                            onClick={this.handleSubmit}
                        >
                            {submitButtonText || type}
                        </SellButton>
                    )
                    }
                </div>
            </div>
        );
    }

    private handleOrderTypeChange = (event: any) => {
        console.log(event.target.value);
        const { orderTypesIndex } = this.props;
        this.setState({
            orderType: orderTypesIndex[event.target.value],
            orderTypeSelected: event.target.value,
        });
        console.log(this.state.orderType);
    };

    private handlePriceChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {
            available,
            type,
        } = this.props;
        const {
            amount,
            currentMarketBidPrecision,
        } = this.state;
        const value = event.target.value
        const amountNumber = Number(amount);
        const buyTotal = Number(value) * amountNumber;
        const percSell = available && ((amountNumber/available) * 100).toFixed(0);
        const percBuy = available && ((buyTotal/available) * 100).toFixed(0);
        BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });
        const roundDownAmount = available && new BigNumber(available).dividedBy(value).toFormat(currentMarketBidPrecision, fmt);

        const convertedValue = cleanPositiveFloatInput(String(value));

        const condition = new RegExp(`^(?:[\\d-]*\\.?[\\d-]{0,${currentMarketBidPrecision}}|[\\d-]*\\.[\\d-])$`);

        // Buy
        if (type === 'buy' && convertedValue.match(condition) && percBuy && Number(percBuy) <= 100) {
            this.setState({
                price: convertedValue,
                sliderValue: Number(percBuy),
            });
        }

        if (type === 'buy' && convertedValue.match(condition) && percBuy && Number(percBuy) > 100) {
            this.setState({
                price: convertedValue,
                sliderValue: 100,
                amount: String(roundDownAmount),
            });
        }

        // Sell

        if (type === 'sell' && convertedValue.match(condition)) {
            this.setState({
                price: convertedValue,
                sliderValue: Number(percSell),
            });
        }

        this.props.listenInputPrice && this.props.listenInputPrice();
    };

    private handleAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const {
            available,
            type,
        } = this.props;
        const {
            price,
            currentMarketAskPrecision,
        } = this.state;
        const value = event.target.value;
        const valueNumber = Number(value);
        const buyTotal = Number(price) * valueNumber;
        const percSell = available && ((valueNumber/available) * 100).toFixed(0);
        const percBuy = available && ((buyTotal/available) * 100)
        const percBuyFixed = percBuy && percBuy.toFixed(0);
        const convertedValue = cleanPositiveFloatInput(String(value));
        const condition = new RegExp(`^(?:[\\d-]*\\.?[\\d-]{0,${currentMarketAskPrecision}}|[\\d-]*\\.[\\d-])$`);
        BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_FLOOR });
        const roundDownAmount = available && new BigNumber(available).dividedBy(price).toFormat(currentMarketAskPrecision, fmt);

        // Buy
        if (type === 'buy' && convertedValue.match(condition) && Number(percBuy) <= 100) {
            this.setState({
                amount: convertedValue,
                sliderValue: Number(percBuyFixed),
            });
        }

        if (type === 'buy' && convertedValue.match(condition) && Number(percBuy) > 100) {
            this.setState({
                amount: String(roundDownAmount),
                sliderValue: 100,
            });
        }

        // Sell
        if (type === 'sell' && convertedValue.match(condition) && percSell && Number(percSell) <= 100) {
            this.setState({
                amount: convertedValue,
                sliderValue: Number(percSell),
            });
        }

        if (type === 'sell' && convertedValue.match(condition) && valueNumber > Number(available)) {
            this.setState({
                amount: String(available),
                sliderValue: 100,
            });
        }

    };

    private handleSliderChange = (event: any, val: number | number[], type: string) => {
        this.setState({ sliderValue: val });
        const value = val as number / 100;
        switch (type) {
            case 'buy':
                switch (this.state.orderType) {
                    case 'Limit':
                        this.setState({
                            amount: this.props.available && + this.state.price ? (
                                Decimal.format(this.props.available / +this.state.price * value, this.state.currentMarketAskPrecision)
                            ) : '',
                        });
                        break;
                    case 'Market':
                        this.setState({
                            amount: this.props.available ? (
                                Decimal.format(getAmount(Number(this.props.available), this.props.proposals, value), this.state.currentMarketAskPrecision)
                            ) : '',
                        });
                        break;
                    default:
                        break;
                }
                break;
            case 'sell':
                this.setState({
                    amount: this.props.available ? (
                        Decimal.format(this.props.available * value, this.state.currentMarketAskPrecision)
                    ) : '',
                });
                break;
            default:
                break;
        }
    };

    private handleSubmit = () => {
        const { available, type } = this.props;
        const { amount, price, priceMarket, orderType } = this.state;

        const order = {
            type,
            orderType,
            amount,
            price: orderType === 'Market' ? priceMarket : price,
            available: available || 0,
        };
        console.log(order);
        this.props.onSubmit(order);
        this.setState({
            amount: '',
            price: '',
        });
    };
}
