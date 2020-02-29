import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {
    Market,
    RootState,
    selectCurrentMarket,
} from '../../modules';
import {
    MarketsList,
} from './MarketsList';
import {
    MarketsTabs,
} from './MarketsTabs';

interface ReduxProps {
    currentMarket?: Market;
}

interface State {
    searchFieldValue: string;
    marketsTabsSelectedValue: string;
}

type Props = ReduxProps & InjectedIntlProps;

class MarketSelectorComponent extends React.Component<Props, State> {
    public readonly state = {
        searchFieldValue: '',
        marketsTabsSelectedValue: '',
    };

    public render() {
        const { searchFieldValue, marketsTabsSelectedValue } = this.state;

        return (
            <div className="pg-trading-header-market-selector-container">
                <div className="cr-table-header__content">
                    <div className={'pg-market-depth__title'}>
                        <div className={'cr-title-component'}>{this.props.intl.formatMessage({id: 'page.body.trade.header.markets'})}</div>
                    </div>
                </div>                
                <div className="pg-trading-header-market-selector-list-container">
                    <MarketsTabs onSelect={this.marketsTabsSelectHandler}/>
                    <MarketsList search={searchFieldValue} currencyQuote={marketsTabsSelectedValue}/>
                    <div className={'pg-trading-header-market-selector-search-wrapper'}>
                        <div className="pg-trading-header-selector-search">
                            <div className="pg-trading-header-selector-search-icon">
                                <img alt="" src={require('./icons/search.svg')} />
                            </div>
                            <input
                                className="pg-trading-header-selector-search-field"
                                onChange={this.searchFieldChangeHandler}
                                value={searchFieldValue}
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    private searchFieldChangeHandler = e => {
        this.setState({
            searchFieldValue: e.target.value,
        });
    }

    private marketsTabsSelectHandler = value => {
        this.setState({
            marketsTabsSelectedValue: value,
        });
    }
}

const reduxProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentMarket: selectCurrentMarket(state),
});

export const MarketSelection = injectIntl(connect<ReduxProps, {}, {}, RootState>(reduxProps)(MarketSelectorComponent));
