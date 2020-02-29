import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { MarketsTable } from '../../containers';
import {
    RootState,
    selectUserLoggedIn,
} from '../../modules';

const LogoImage = require('../../assets/images/logo.svg');

interface ReduxProps {
    isLoggedIn: boolean;
}

type Props = ReduxProps & RouteProps & InjectedIntlProps;

class Fees extends React.Component<Props> {
    public renderHeader() {
        if (this.props.isLoggedIn) {
            return (
                <div className="pg-landing-screen__header">
                    <div className="pg-landing-screen__header__wrap">
                        <div className="pg-landing-screen__header__wrap__left" onClick={e => this.handleScrollTop()}>
                            <img src={LogoImage} alt="BaseApp Logo"/>
                        </div>
                        <div className="pg-landing-screen__header__wrap__right">
                            <Link to="/profile" className="landing-button">
                                {this.translate('page.body.landing.header.button1')}
                            </Link>
                        </div>
                    </div>
                </div>
            );
        }

        return (
            <div className="pg-landing-screen__header">
                <div className="pg-landing-screen__header__wrap">
                    <div className="pg-landing-screen__header__wrap__left" onClick={e => this.handleScrollTop()}>
                        <img src={LogoImage} alt="BaseApp Logo"/>
                    </div>
                    <div className="pg-landing-screen__header__wrap__right">
                        <Link to="/signin" className="landing-button landing-button--simple">
                            {this.translate('page.body.landing.header.button2')}
                        </Link>
                        <Link to="/signup" className="landing-button">
                            {this.translate('page.body.landing.header.button3')}
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    public renderMarketInfoBlock() {
        return (
            <div className="pg-landing-screen__market-info">
                <div className="pg-landing-screen__market-info__wrap">
                    <div className="pg-landing-screen__market-info__wrap__title">
                        <Link to="/trading" className="landing-button">
                            {this.translate('page.body.landing.marketInfo.title.button')}
                        </Link>
                    </div>
                    <MarketsTable />
                </div>
            </div>
        );
    }

    public render() {
        return (
            <div className="pg-landing-screen">
                {this.renderHeader()}
                {this.renderMarketInfoBlock()}
            </div>
        );
    }

    private handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
});

// tslint:disable no-any
export const FeeScreen = withRouter(injectIntl(connect(mapStateToProps, null)(Fees) as any));
