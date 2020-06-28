import { Grid, CircularProgress, Button } from '@material-ui/core';
import { History } from 'history';
import React, { Fragment } from 'react';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect, MapStateToProps } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { setDocumentTitle } from '../../helpers';
import {
    emailVerificationFetch,
    RootState,
    selectCurrentLanguage,
    selectSendEmailVerificationLoading,
} from '../../modules';

interface OwnProps {
    history: History;
    location: {
        state: {
            email: string;
        };
    };
}

interface DispatchProps {
    emailVerificationFetch: typeof emailVerificationFetch;
}

interface ReduxProps {
    emailVerificationLoading: boolean;
}

type Props = DispatchProps & ReduxProps & OwnProps & InjectedIntlProps;

class EmailVerificationComponent extends React.Component<Props> {
    public componentDidMount() {
        setDocumentTitle('Email verification');
        if (!this.props.location.state || !this.props.location.state.email) {
            this.props.history.push('/login');
        }
    }

    public render() {
        const { emailVerificationLoading } = this.props;

        const title = this.props.intl.formatMessage({ id: 'page.header.signUp.modal.header' });
        const text = this.props.intl.formatMessage({ id: 'page.header.signUp.modal.body' });
        const button = this.props.intl.formatMessage({ id: 'page.resendConfirmation' });

        return (
            <Fragment>
                <Grid container alignItems="center" justify="center">
                    <Grid item xs={12} sm={8} md={6} lg={4} xl={4}>
                        <Grid container className="verify-email">
                            <Grid item xs={12} className="verify-email-title">
                                {title}
                            </Grid>
                            <Grid item xs={12} className="verify-email-description">
                                {text}
                            </Grid>
                            <Grid item xs={12} className="verify-email-button">
                                {emailVerificationLoading ? <CircularProgress disableShrink /> : <Button variant="contained" color="primary" onClick={this.handleClick}>{button}</Button>}
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Fragment>
        );
    }


    private handleClick = () => {
        this.props.emailVerificationFetch({
          email: this.props.location.state.email,
          lang: this.props.i18n.toLowerCase(),
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    emailVerificationLoading: selectSendEmailVerificationLoading(state),
    i18n: selectCurrentLanguage(state),
});

const mapDispatchProps = {
    emailVerificationFetch,
};

//tslint:disable-next-line:no-any
export const EmailVerificationScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(EmailVerificationComponent) as any));
