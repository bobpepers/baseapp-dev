import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import { FormattedMessage, InjectedIntlProps, injectIntl } from 'react-intl';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { ProfileApiKeys, ProfileVerification } from '../../containers';
import { ProfileAccountActivity } from '../../containers/ProfileAccountActivity';
import { ProfileAuthDetails } from '../../containers/ProfileAuthDetails';
import { ReferralProgram } from '../../containers/ReferralProgram';
import { setDocumentTitle } from '../../helpers';

class ProfileComponent extends React.Component<RouterProps, InjectedIntlProps> {

    public componentDidMount() {
        setDocumentTitle('Profile');
    }

    public goBack = () => {
        this.props.history.goBack();
    };

    public render() {
        return (
            <Fragment>
                <Grid container className="wrapper-container">
                    <Grid container className="profile">
                        <Grid item xs={12} className="profile-title">
                            <FormattedMessage id="page.body.profile.header.account"/>
                        </Grid>
                        <Grid container className="profile-items">
                            <Grid item xs={12}>
                                <ProfileAuthDetails/>
                            </Grid>
                            <Grid item xs={12}>
                                <ProfileVerification/>
                            </Grid>
                            <Grid item xs={12}>
                                <ReferralProgram/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container className="profile">
                        <Grid item xs={12} className="profile-title">
                            <FormattedMessage id="page.body.profile.apiKeys.header"/>
                        </Grid>
                        <Grid container className="profile-items">
                            <Grid item xs={12}>
                                <ProfileApiKeys/>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid container className="profile">
                        <Grid item xs={12} className="profile-title">
                            <FormattedMessage id="page.body.profile.header.accountActivity" />
                        </Grid>
                        <Grid container className="profile-items">
                            <Grid item xs={12}>
                                <ProfileAccountActivity/>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Fragment>
        );
    }
}

// tslint:disable-next-line:no-any
const ProfileScreen = injectIntl(withRouter(ProfileComponent as any));

export {
    ProfileScreen,
};
