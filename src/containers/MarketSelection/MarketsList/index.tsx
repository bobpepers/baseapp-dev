import classnames from 'classnames';
import React, { useState, FunctionComponent } from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { incrementalOrderBook } from '../../../api';
import { SortAsc, SortDefault, SortDesc } from '../../../assets/images/SortIcons';
import { Decimal, MarketSelectionTable } from '../../../components';
import {
    depthFetch,
    Market,
    RootState,
    selectCurrentMarket,
    selectMarkets,
    selectMarketTickers,
    setCurrentMarket,
    setCurrentPrice,
    Ticker,
} from '../../../modules';

interface ReduxProps {
    currentMarket: Market | undefined;
    markets: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
}

interface DispatchProps {
    setCurrentMarket: typeof setCurrentMarket;
    depthFetch: typeof depthFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

interface OwnProps {
    search: string;
    currencyQuote: string;
}

const handleChangeSortIcon = (sortBy: string, id: string, reverseOrder: boolean) => {
    if (sortBy !== 'none' && id === sortBy && !reverseOrder) {
        return <SortDesc/>;
    }

    if (sortBy !== 'none' && id === sortBy && reverseOrder) {
        return <SortAsc/>;
    }

    return <SortDefault/>;
};

type Props = ReduxProps & OwnProps & DispatchProps & InjectedIntlProps;

const MarketsListComponent: FunctionComponent<Props> = (props) => {

    const {
        setCurrentPrice,
        depthFetch,
        markets,
        marketTickers,
        search,
        currencyQuote,
        currentMarket,
    } = props;

    const [sortBy, setsortBy] = useState('none');
    const [reverseOrder, setreverseOrder] = useState(false);

    const currencyPairSelectHandler = (key: string) => {
        const marketToSet = markets.find(el => el.name === key);

        setCurrentPrice();
        if (marketToSet) {
            setCurrentMarket(marketToSet);
            if (!incrementalOrderBook()) {
              depthFetch(marketToSet);
            }
        }
    };

    const getHeaders = () => [
        {id: 'id', translationKey: 'market'},
        {id: 'last', translationKey: 'last_price'},
        {id: 'vol', translationKey: 'volume'},
        {id: 'price_change_percent_num', translationKey: 'change'},
    ].map(obj => {
        return (
            {
                ...obj,
                selected: sortBy === obj.id,
                reversed: sortBy === obj.id && reverseOrder,
            }
        );
    }).map(obj => {
        const classname = classnames({
            'pg-dropdown-markets-list-container__header-selected': obj.selected,
        });

        return (
            <span className={classname} key={obj.id} onClick={() => handleHeaderClick(obj.id)}>
            {props.intl.formatMessage({id: `page.body.trade.header.markets.content.${obj.translationKey}`})}
                <span className="sort-icon">
                    {handleChangeSortIcon(sortBy, obj.id, reverseOrder)}
                </span>
            </span>
        );
    });

    const mapMarkets = () => {
        const defaultTicker = {
            last: 0,
            vol: 0,
            price_change_percent: '+0.00%',
        };
        const regExp = new RegExp(search.toLowerCase());
        const arr: Market[] = [];

        const marketsMapped = markets.map((market: Market) => {
            return {
                ...market,
                last: (marketTickers[market.id] || defaultTicker).last,
                vol: (marketTickers[market.id] || defaultTicker).vol,
                price_change_percent: (marketTickers[market.id] || defaultTicker).price_change_percent,
                price_change_percent_num: Number.parseFloat((marketTickers[market.id] || defaultTicker).price_change_percent),
            };
        });


        if (sortBy !== 'none') {
            marketsMapped.sort((a, b) => a[sortBy] > b[sortBy] ? 1 : b[sortBy] > a[sortBy] ? -1 : 0);
        }

        reverseOrder && marketsMapped.reverse();

        return marketsMapped.reduce((pV, cV) => {
            const [,quote] = cV.name.toLowerCase().split('/');
            if (
                regExp.test(cV.id.toLowerCase()) &&
                (
                    currencyQuote === '' ||
                    currencyQuote.toLowerCase() === quote ||
                    currencyQuote.toLowerCase() === 'all'
                )
            ) {
                pV.push(cV);
            }

            return pV;
        }, arr).map((market: Market & Ticker, index: number) => {
            const isPositive = /\+/.test((marketTickers[market.id] || defaultTicker).price_change_percent);
            const classname = classnames({
                'pg-dropdown-markets-list-container__positive': isPositive,
                'pg-dropdown-markets-list-container__negative': !isPositive,
            });

            return [
                market.name,
                (<span><img src={`https://downloads.runebase.io/${market.base_unit}.svg` }alt={`${market.name} market icon`} className="MarketListCoinIcon" />{market.name}</span>),
                (<span className={classname}>{Decimal.format(Number(market.last), market.price_precision)}</span>),
                (<span className={classname}>{Decimal.format(Number(market.vol), market.amount_precision)}</span>),
                (<span className={classname}>{market.price_change_percent}</span>),
            ];
        });
    }

    const handleHeaderClick = (key: string) => {
        if (key !== sortBy) {
            setsortBy(key);
            setreverseOrder(false);
        } else if (key === sortBy && !reverseOrder) {
            setreverseOrder(true);
        } else {
            setsortBy('none');
            setreverseOrder(false);
        }
    };

    const data = mapMarkets();

    return (
        <div className="pg-dropdown-markets-list-container">
            <MarketSelectionTable
                data={data.length > 0 ? data : [[]]}
                header={getHeaders()}
                onSelect={currencyPairSelectHandler}
                selectedKey={currentMarket && currentMarket.name}
                rowKeyIndex={0}
            />
        </div>
    );
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    markets: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
});

const mapDispatchToProps = {
    setCurrentMarket,
    depthFetch,
    setCurrentPrice,
};

export const MarketsList = injectIntl(connect(mapStateToProps, mapDispatchToProps)(MarketsListComponent));
