import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    Market,
    RootState,
    selectCurrentMarket,
} from '../../modules';
import { HeaderToolbar } from '../HeaderToolbar';

interface ReduxProps {
    currentMarket: Market | undefined;
}

type Props = ReduxProps & InjectedIntlProps;

// tslint:disable jsx-no-multiline-js
class Head extends React.Component<Props> {
    public render() {
        const { currentMarket } = this.props;
        const tradingCls = window.location.pathname.includes('/trading') ? 'pg-container-trading' : '';
        return (
            <React.Fragment>
                <div className={`pg-priceInfoBar ${tradingCls}`}>
                    <p className="pg-header__market-selector-toggle-value">
                        {currentMarket && currentMarket.name}
                    </p>
                    <div className="pg-priceInfoBar__navbar">
                        {this.renderMarketToolbar()}
                    </div>
                </div>
            </React.Fragment>
        );
    }


    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };

    private renderMarketToolbar = () => {
        if (!window.location.pathname.includes('/trading/')) {
            return null;
        }

        return <HeaderToolbar/>;
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
});


const TradeInfoBar = injectIntl(withRouter(connect(mapStateToProps)(Head) as any) as any);

export {
    TradeInfoBar,
};
