import React, { Fragment } from 'react';
import { Grid } from '@material-ui/core';
import { BorderColor, AccessTime, DoneOutline } from '@material-ui/icons';
import { FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Label, labelFetch, selectLabelData, selectUserInfo, User } from '../../modules';

interface ReduxProps {
    label: Label[];
}

interface DispatchProps {
    labelFetch: typeof labelFetch;
}

interface ProfileVerificationProps {
    user: User;
}

type Props =  DispatchProps & ProfileVerificationProps & ReduxProps;

class ProfileVerificationComponent extends React.Component<Props> {
    public componentDidMount() {
        this.props.labelFetch();
    }

    public render() {
        const { user } = this.props;
        const userLevel = user.level;

        return (
            <Grid container className="profile-item">
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12}>
                            <p className="profile-item-title">
                                <FormattedMessage id="page.body.profile.header.account.profile" />:
                            </p>
                        </Grid>
                        <Grid item xs={6}>
                            {this.renderFirstLevel(userLevel)}
                        </Grid>
                        <Grid item xs={6}>
                            {this.renderSecondLevel(userLevel)}
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    private renderFirstLevel(userLevel: number) {
        const targetLevel = 1;

        return (
            <div>
                {this.renderVerificationLevel('page.body.profile.header.account.profile.email', userLevel, targetLevel)}
                <p><FormattedMessage id="page.body.profile.header.account.profile.email.message" /></p>
            </div>
        );
    }

    /*
    private renderThirdLevel(userLevel: number) {
        const targetLevel = 3;
        const documentLabel = this.props.label.find((label: Label) => label.key === 'document');
        const isPending = documentLabel && documentLabel.value === 'pending' ? this.renderPendingIcon() : '';
        const {
            titleClassName,
        } = this.getLevelsClassNames(userLevel, targetLevel);
        return (
            <div className="pg-profile-page__row pg-profile-page__level-verification">
                <div className={titleClassName}>
                    {this.renderVerificationLevel('page.body.profile.header.account.profile.phone', userLevel, targetLevel)}
                    <p><FormattedMessage id="page.body.profile.header.account.profile.phone.message" /></p>
                </div>
                {isPending}
            </div>
        );
    }
    */

    private renderSecondLevel(userLevel: number) {
        const targetLevel = 2;
        const documentLabel = this.props.label.find((label: Label) => label.key === 'document');
        //const isPending = documentLabel && documentLabel.value === 'pending' ? this.renderPendingIcon() : '';

        return (
            <div>
                {this.renderIdentityVerification('page.body.profile.header.account.profile.identity', userLevel, targetLevel, documentLabel)}
                <p><FormattedMessage id="page.body.profile.header.account.profile.identity.message" /></p>
            </div>
        );
    }

    private renderVerificationLevel(text: string, userLevel, targetLevel) {
        if (userLevel === (targetLevel - 1)) {
            return (
                <Fragment>
                    <div className="inline-block">
                        <a href="/confirm">
                            <BorderColor />
                        </a>
                    </div>
                    <div className="inline-block">
                        <a href="/confirm">
                            <FormattedMessage id={`${text}.unverified.title`}/>
                        </a>
                    </div>
                </Fragment>
            );
        } else {
            if (userLevel < targetLevel) {
                return (
                    <Fragment>
                        <div className="inline-block">
                            <AccessTime />
                        </div>
                        <div className="inline-block">
                            <p className="verification-paragraph">
                                <FormattedMessage id={`${text}.unverified.title`}/>
                            </p>
                        </div>
                    </Fragment>
                );
            } else {
                return (
                    <Fragment>
                        <div className="inline-block">
                            <DoneOutline />
                        </div>
                        <div className="inline-block">
                            <p className="verification-paragraph">
                                <FormattedMessage id={`${text}.title`}/>
                            </p>
                        </div>
                    </Fragment>
                );
            }
        }
    }

    private renderIdentityVerification(text: string, userLevel, targetLevel, documentLabel) {
      const isLabelExist = this.props.label;

      if (isLabelExist.length > 0) {
        switch (userLevel) {
          case targetLevel - 1: {
            if (documentLabel) {
              return (
                <Fragment>
                    <div className="inline-block">
                        <AccessTime />
                    </div>
                    <div className="inline-block">
                        <p className="verification-paragraph">
                          <FormattedMessage id={`${text}.unverified.title`}/>
                        </p>
                    </div>
                </Fragment>
              );
            } else {
              return (
                <Fragment>
                    <div className="inline-block">
                        <a href="/confirm">
                          <BorderColor />
                        </a>
                    </div>
                    <div className="inline-block">
                        <a href="/confirm">
                          <FormattedMessage id={`${text}.unverified.title`}/>
                        </a>
                    </div>
                </Fragment>
              );
            }
          }
          case targetLevel: return (
            <Fragment>
                <div className="inline-block">
                    <DoneOutline />
                </div>
                <div className="inline-block">
                    <p className="verification-paragraph">
                      <FormattedMessage id={`${text}.title`}/>
                    </p>
                </div>
            </Fragment>
          );
          default: return(
            <Fragment>
                <div className="inline-block">
                    <AccessTime />
                </div>
                <div className="inline-block">
                    <p className="verification-paragraph">
                      <FormattedMessage id={`${text}.unverified.title`}/>
                    </p>
                </div>
            </Fragment>
          );
        }
      } else {
        return (
            <Fragment>
                <div className="inline-block">
                    <DoneOutline />
                </div>
                <div className="inline-block">
                    <p className="verification-paragraph">
                        <FormattedMessage id={`${text}.unverified.title`}/>
                    </p>
                </div>
            </Fragment>
        );
      }
    }
}

const mapStateToProps = state => ({
    user: selectUserInfo(state),
    label: selectLabelData(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        labelFetch: () => dispatch(labelFetch()),
    });

const ProfileVerification = connect(mapStateToProps, mapDispatchProps)(ProfileVerificationComponent);

export {
    ProfileVerification,
};
