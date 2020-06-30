import * as React from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    Market,
    RootState,
    selectCurrentMarket,
} from '../../modules';
import { HeaderToolbar } from '../HeaderToolbar';

const WebsiteIcon = require('../../assets/images/icons/Website.svg');
const GithubIcon = require('../../assets/images/icons/Github.svg');
const ExplorerIcon = require('../../assets/images/icons/Explorer.svg');
const CoinMarketCapIcon = require('../../assets/images/icons/CoinMarketCap.svg');
const CoinPaprikaIcon = require('../../assets/images/icons/CoinPaprika.svg');
const CoinGeckoIcon = require('../../assets/images/icons/CoinGecko.svg');
const PosIcon = require('../../assets/images/icons/Pos.svg');
const PowIcon = require('../../assets/images/icons/Pow.svg');

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
                <div className={`info-bar ${tradingCls}`}>
                    <div className="info-bar__marketInfo">
                        {currentMarket && this.renderCoinImage()}
                        <p className="pg-header__market-selector-toggle-value">
                            {currentMarket && currentMarket.name}
                        </p>
                        {currentMarket && this.renderCoinWebsite()}
                        {currentMarket && this.renderCoinGithub()}
                        {currentMarket && this.renderCoinExplorer()}
                        {currentMarket && this.renderCoinCoinPaprika()}
                        {currentMarket && this.renderCoinCoinGecko()}
                        {currentMarket && this.renderCoinCoinMarketCap()}
                        {currentMarket && this.renderCoinType()}
                    </div>
                    <span className="info-bar-break"></span>
                    <div className="info-bar__priceInfo">
                        {this.renderMarketToolbar()}
                    </div>
                </div>
            </React.Fragment>
        );
    }

    private renderCoinType = () => {
        const { coin_type } = this.props.currentMarket;

        switch (coin_type) {
            case 'pos':
                return (
                    <span className="info-bar__coinLink">
                        <img src={PosIcon} alt="PoS Icon" className="info-bar__coinImage" />
                    </span>
                );
            case 'pow':
                return (
                    <span className="info-bar__coinLink">
                        <img src={PowIcon} alt="PoW Icon" className="info-bar__coinImage" />
                    </span>
                );
            default:
                return <span />;
        }
    };

    private renderCoinCoinGecko = () => {
        const { base_unit, coingecko } = this.props.currentMarket;
        if (!!coingecko) {
            return (
                <a rel="noopener noreferrer" target="_blank" href={`https://www.coingecko.com/en/coins/${coingecko}`} className="info-bar__coinLink">
                    <img src={CoinGeckoIcon} alt={`${base_unit} coingecko icon`}  className="info-bar__coinImage" />
                </a>
            );
        } else {
            return <span />;
        }

    };

    private renderCoinCoinPaprika = () => {
        const { base_unit, coinpaprika } = this.props.currentMarket;
        if (!!coinpaprika) {
            return (
                <a rel="noopener noreferrer" target="_blank" href={`https://coinpaprika.com/coin/${coinpaprika}`} className="info-bar__coinLink">
                    <img src={CoinPaprikaIcon} alt={`${base_unit} coinpaprika icon`}  className="info-bar__coinImage" />
                </a>
            );
        } else {
            return <span />;
        }
    };

    private renderCoinCoinMarketCap = () => {
        const { base_unit, coinmarketcap } = this.props.currentMarket;
        if (!!coinmarketcap) {
            return (
                <a rel="noopener noreferrer" target="_blank" href={`https://coinmarketcap.com/currencies/${coinmarketcap}`} className="info-bar__coinLink">
                    <img src={CoinMarketCapIcon} alt={`${base_unit} coinmarketcap icon`}  className="info-bar__coinImage" />
                </a>
            );
        } else {
            return <span />;
        }
    };

    private renderCoinExplorer = () => {
        const { base_unit, explorer_url } = this.props.currentMarket;
        if (!!explorer_url) {
            return (
                <a rel="noopener noreferrer" target="_blank" href={explorer_url} className="info-bar__coinLink">
                    <img src={ExplorerIcon} alt={`${base_unit} explorer icon`}  className="info-bar__coinImage" />
                </a>
            );
        } else {
            return <span />;
        }
    };

    private renderCoinGithub = () => {
        const { base_unit, github } = this.props.currentMarket;
        if (!!github) {
            return (
                <a rel="noopener noreferrer" target="_blank" href={`https://github.com/${github}`} className="info-bar__coinLink">
                    <img src={GithubIcon} alt={`${base_unit} github icon`}  className="info-bar__coinImage" />
                </a>
            );
        } else {
            return <span />;
        }
    };

    private renderCoinWebsite = () => {
        const { base_unit, website } = this.props.currentMarket;
        if (!!website) {
           return (
                <a rel="noopener noreferrer" target="_blank" href={website} className="info-bar__coinLink">
                    <img src={WebsiteIcon} alt={`${base_unit} website icon`}  className="info-bar__coinImage" />
                </a>
            );
       } else {
            return <span />;
       }
    };

    private renderCoinImage = () => {
        const { base_unit } = this.props.currentMarket;
        if (!!base_unit) {
            return (
                <div className="info-bar__coinLink">
                    <img src={`https://downloads.runebase.io/${base_unit}.svg`} alt={`${base_unit} coin`}  className="info-bar__coinImage" />
                </div>
            );
        } else {
            return <span />;
        }
    };

    private renderMarketToolbar = () => {
        if (!window.location.pathname.includes('/trading/')) {
            return null;
        }

        return <HeaderToolbar/>;
    };
    /*
    private translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };
    */
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
});


const TradeInfoBar = injectIntl(withRouter(connect(mapStateToProps)(Head) as any) as any);

export {
    TradeInfoBar,
};
