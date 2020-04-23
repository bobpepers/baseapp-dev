import cx from 'classnames';
import React, { Fragment } from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { Grid, Button } from '@material-ui/core';
import { captchaType, recaptchaSitekey } from '../../api/config';
import { SignInComponent, TwoFactorAuth } from '../../components';
import { EMAIL_REGEX, ERROR_EMPTY_PASSWORD, ERROR_INVALID_EMAIL, setDocumentTitle } from '../../helpers';
import {
    RootState,
    selectAlertState,
    selectSignInRequire2FA,
    selectSignUpRequireVerification,
    selectUserFetching,
    selectUserLoggedIn,
    signIn,
    signInError,
    signInRequire2FA,
    signUpRequireVerification,
} from '../../modules';

interface ReduxProps {
    isLoggedIn: boolean;
    loading?: boolean;
    require2FA?: boolean;
    requireEmailVerification?: boolean;
}

interface DispatchProps {
    signIn: typeof signIn;
    signInError: typeof signInError;
    signInRequire2FA: typeof signInRequire2FA;
    signUpRequireVerification: typeof signUpRequireVerification;
}

interface SignInState {
    email: string;
    emailError: string;
    emailFocused: boolean;
    password: string;
    passwordError: string;
    passwordFocused: boolean;
    otpCode: string;
    error2fa: string;
    codeFocused: boolean;
    reCaptchaSuccess: boolean;
    captcha_response: string;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

class SignIn extends React.Component<Props, SignInState> {
    public state = {
        email: '',
        emailError: '',
        emailFocused: false,
        password: '',
        passwordError: '',
        passwordFocused: false,
        otpCode: '',
        error2fa: '',
        codeFocused: false,
        captcha_response: '',
        reCaptchaSuccess: false,
    };

    public componentDidMount() {
        setDocumentTitle('Sign In');
        this.props.signInError({ code: undefined, message: undefined });
        this.props.signUpRequireVerification({requireVerification: false});
    }

    public UNSAFE_componentWillReceiveProps(props: Props) {
        if (props.isLoggedIn) {
            this.props.history.push('/wallets');
        }
        if (props.requireEmailVerification) {
            props.history.push('/email-verification', { email: this.state.email });
        }
    }

    public render() {
        const { loading } = this.props;
        const className = cx('signin-container', { loading });

        return (
            <Grid container alignItems="center" justify="center" className="signin wrapper-container">
                <Grid item xs={12} sm={8} md={6} lg={4} xl={4} className={className}>
                    {this.renderSignInForm()}
                </Grid>
            </Grid>
        );
    }

    private renderSignInForm = () => {
        const { loading } = this.props;
        const {
            emailError,
            passwordError,
            reCaptchaSuccess,
            captcha_response,
        } = this.state;

        return (
            <Fragment>
                <Grid container className="signin-title">
                    <Grid item xs={12}>
                        {this.props.intl.formatMessage({ id: 'page.header.signIn' })}
                    </Grid>
                </Grid>
                <Grid container className="signin-content">
                    <Grid item xs={12}>
                        <SignInComponent
                            emailError={emailError}
                            passwordError={passwordError}
                            emailLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.email' })}
                            passwordLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.password' })}
                            receiveConfirmationLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.receiveConfirmation' })}
                            isLoading={loading}
                            onSubmit={this.handleEnter}
                            isFormValid={this.validateForm}
                            refreshError={this.refreshError}
                            changeEmail={this.handleChangeEmailValue}
                            changePassword={this.handleChangePasswordValue}
                            renderCaptcha={this.renderCaptcha()}
                            captchaType={captchaType()}
                            reCaptchaSuccess={reCaptchaSuccess}
                            captcha_response={captcha_response}
                        />
                        <TwoFactorAuth
                            onSubmit={this.handleEnter}
                            label={this.props.intl.formatMessage({ id: 'login.2facode' })}
                            handleOtpCodeChange={this.handleChangeOtpCode}
                        />
                        <div className="signin-form-input">
                            <Button
                                variant="contained"
                                color="primary"
                                disabled={this.disableButton()}
                                onClick={e => this.handleClick(e)}
                                fullWidth={true}
                                size="large"
                            >
                                {loading ? 'Loading...' : this.props.intl.formatMessage({ id: 'page.header.signIn' })}
                            </Button>
                        </div>
                        <div
                            className="signin-forgot"
                            onClick={() => this.forgotPassword()}
                        >
                            {this.props.intl.formatMessage({ id: 'page.header.signIn.forgotPassword' })}
                        </div>
                    </Grid>
                </Grid>
            </Fragment>
        );
    };

    private handleValidateForm = () => {
        this.props.isFormValid();
    };

    private handleSubmitForm = () => {
        this.refreshError();
        this.handleSignIn();
    };

    private isValidForm = () => {
        const { email, password } = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid && password;
    };

    private handleEnter = () => {
        if (!this.isValidForm()) {
            this.handleValidateForm();
        } else {
            this.handleSubmitForm();
        }
    };

    private handleClick = (e?: React.MouseEvent<HTMLButtonElement>) => {
        if (e) {
            e.preventDefault();
        }
        if (!this.isValidForm()) {
            this.handleValidateForm();
        } else {
            this.handleSubmitForm();
        }
    };

    private disableButton = (): boolean => {
        const { loading } = this.props;
        const {
            email,
            password,
            reCaptchaSuccess,
        } = this.state;

        if (loading || !email.match(EMAIL_REGEX) || !password) {
            return true;
        }
        if (captchaType() === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }

        return false;
    };

    private handleReCaptchaSuccess = (value: string) => {
        this.setState({
            reCaptchaSuccess: true,
            captcha_response: value,
        });
    };

    private renderCaptcha = () => {
        switch (captchaType()) {
            case 'recaptcha':
                return (
                    <div className="signin-recaptcha">
                        <ReCAPTCHA
                            sitekey={recaptchaSitekey()}
                            onChange={this.handleReCaptchaSuccess}
                        />
                    </div>
                );
            default:
                return null;

        }
    };

    private refreshError = () => {
        this.setState({
            emailError: '',
            passwordError: '',
        });
    };

    private handleChangeOtpCode = (e: any) => {
        this.setState({
            error2fa: '',
            otpCode: e.target.value,
        });
    };

    private handleSignIn = () => {
        const {
            email,
            password,
            captcha_response,
            otpCode,
        } = this.state;
        if (!otpCode) {
            this.props.signIn({
                email,
                password,
                captcha_response,
            });
        } else {
            this.props.signIn({
                email,
                password,
                otp_code: otpCode,
                captcha_response,
            });
        }
    };

    private forgotPassword = () => {
        this.props.history.push('/forgot_password');
    };

    private validateForm = () => {
        const { email, password } = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);

        if (!isEmailValid) {
            this.setState({
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: '',
            });

            return;
        }
        if (!password) {
            this.setState({
                emailError: '',
                passwordError: this.props.intl.formatMessage({ id: ERROR_EMPTY_PASSWORD }),
            });

            return;
        }
    };

    private handleChangeEmailValue = (value: string) => {
        this.setState({
            email: value,
        });
    };

    private handleChangePasswordValue = (value: string) => {
        this.setState({
            password: value,
        });
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    alert: selectAlertState(state),
    isLoggedIn: selectUserLoggedIn(state),
    loading: selectUserFetching(state),
    require2FA: selectSignInRequire2FA(state),
    requireEmailVerification: selectSignUpRequireVerification(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    signIn: data => dispatch(signIn(data)),
    signInError: error => dispatch(signInError(error)),
    signInRequire2FA: payload => dispatch(signInRequire2FA(payload)),
    signUpRequireVerification: data => dispatch(signUpRequireVerification(data)),
});

// tslint:disable no-any
const SignInScreen = injectIntl(
    withRouter(connect(
        mapStateToProps,
        mapDispatchProps,
    )(SignIn) as any),
);
// tslint:enable no-any

export {
    SignInScreen,
};
