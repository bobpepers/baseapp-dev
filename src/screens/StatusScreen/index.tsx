import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { MarketsTable } from '../../containers';
import {
    RootState,
    selectUserLoggedIn,
} from '../../modules';

interface ReduxProps {
    isLoggedIn: boolean;
}

type Props = ReduxProps & RouteProps & InjectedIntlProps;

class Status extends React.Component<Props> {
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
export const StatusScreen = withRouter(injectIntl(connect(mapStateToProps, null)(Status) as any));
