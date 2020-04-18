import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { Button, Grid } from '@material-ui/core';
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

class Landing extends Component<Props> {
    public renderMarketInfoBlock() {
        return (
            <Grid container alignItems="center" justify="center" className="frontPage wrapper-container">
                <Grid item xs={8} sm={4} md={3} lg={2} xl={2} className="logoWrapper">
                    <img src={LogoImage} alt="RuneX Logo" />
                </Grid>
                <Grid item xs={12} className="gridItemCenter">
                    <Link to="/trading">
                        <Button variant="contained" color="primary" className="tradeButton mb-32">
                            {this.translate('page.body.landing.marketInfo.title.button')}
                        </Button>
                    </Link>
                </Grid>
                <Grid item xs={12}>
                    <MarketsTable />
                </Grid>
            </Grid>
        );
    }

    public render() {
        return (
            <Fragment>
                {this.renderMarketInfoBlock()}
            </Fragment>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
});

// tslint:disable no-any
export const LandingScreen = withRouter(injectIntl(connect(mapStateToProps, null)(Landing) as any));
