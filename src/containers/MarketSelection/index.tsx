import * as React from 'react';
import { connect, MapStateToProps } from 'react-redux';
import { InputAdornment, TextField  } from '@material-ui/core';
import { Search } from '@material-ui/icons';
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
                <div className="pg-trading-header-market-selector-list-container">
                    <MarketsTabs onSelect={this.marketsTabsSelectHandler}/>
                     <TextField
                        id="searchfield"
                        className="landingTable-head search-padding"
                        fullWidth={true}
                        onChange={this.searchFieldChangeHandler}
                        value={searchFieldValue}
                        size="medium"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <Search />
                                </InputAdornment>
                            ),
                        }}
                    />
                    <MarketsList search={searchFieldValue} currencyQuote={marketsTabsSelectedValue}/>
                </div>
        );
    }

    private searchFieldChangeHandler = e => {
        this.setState({
            searchFieldValue: e.target.value,
        });
    };

    private marketsTabsSelectHandler = value => {
        this.setState({
            marketsTabsSelectedValue: value,
        });
    };
}

const reduxProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    currentMarket: selectCurrentMarket(state),
});

export const MarketSelection = injectIntl(connect<ReduxProps, {}, {}, RootState>(reduxProps)(MarketSelectorComponent));
