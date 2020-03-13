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

class Landing extends React.Component<Props> {
    public renderMarketInfoBlock() {
        return (
            <div className="pg-landing-screen__market-info">
                <div className="pg-landing-screen__market-info__wrap">
                    <div className="pg-landing-screen__market-info__wrap__title">
                        <img src={LogoImage} alt="RuneX Logo" />
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
                {this.renderMarketInfoBlock()}
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
});

// tslint:disable no-any
export const LandingScreen = withRouter(injectIntl(connect(mapStateToProps, null)(Landing) as any));
