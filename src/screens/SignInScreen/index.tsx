import cx from 'classnames';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction, MapStateToProps } from 'react-redux';
import { RouterProps } from 'react-router';
import { withRouter } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
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
        const className = cx('pg-sign-in-screen__container', { loading });

        return (
            <div className="pg-sign-in-screen">
                <div className={className}>
                    {this.renderSignInForm()}
                </div>
            </div>
        );
    }

    private renderSignInForm = () => {
        const { loading } = this.props;
        const {
            email,
            emailError,
            emailFocused,
            password,
            passwordError,
            passwordFocused,
            reCaptchaSuccess,
            captcha_response,
            otpCode,
            codeFocused,
        } = this.state;

        return (
            <React.Fragment>
                <div className="cr-sign-in-form">
                    <div className="cr-sign-in-form__options-group">
                        <div className="cr-sign-in-form__option">
                            <div className="cr-sign-in-form__option-inner __selected">
                                {this.props.intl.formatMessage({ id: 'page.header.signIn' })}
                            </div>
                        </div>
                        <div className="cr-sign-in-form__option">
                            <div className="cr-sign-in-form__option-inner cr-sign-in-form__tab-signup" onClick={this.handleSignUp}>
                                {this.props.intl.formatMessage({ id: 'page.header.signUp' })}
                            </div>
                        </div>
                    </div>
                    <SignInComponent
                        email={email}
                        emailError={emailError}
                        emailFocused={emailFocused}
                        emailPlaceholder={this.props.intl.formatMessage({ id: 'page.header.signIn.email' })}
                        password={password}
                        passwordError={passwordError}
                        passwordFocused={passwordFocused}
                        passwordPlaceholder={this.props.intl.formatMessage({ id: 'page.header.signIn.password' })}
                        emailLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.email' })}
                        passwordLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.password' })}
                        receiveConfirmationLabel={this.props.intl.formatMessage({ id: 'page.header.signIn.receiveConfirmation' })}
                        isLoading={loading}
                        onSubmit={this.handleEnter}
                        handleChangeFocusField={this.handleFieldFocus}
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
                        label={this.props.intl.formatMessage({ id: 'page.body.wallets.tabs.withdraw.content.code2fa' })}
                        message={this.props.intl.formatMessage({ id: 'page.password2fa.message' })}
                        codeFocused={codeFocused}
                        otpCode={otpCode}
                        handleOtpCodeChange={this.handleChangeOtpCode}
                        handleChangeFocusField={this.handle2faFocus}
                    />
                    <div className="cr-sign-in-form__button-wrapper">
                        <Button
                            block={true}
                            type="button"
                            disabled={this.disableButton()}
                            onClick={e => this.handleClick(e)}
                            size="lg"
                            variant="primary"
                        >
                            {loading ? 'Loading...' : this.props.intl.formatMessage({ id: 'page.header.signIn' })}
                        </Button>
                    </div>
                    <div className="cr-sign-in-form__bottom-section">
                        <div
                            className="cr-sign-in-form__bottom-section-password"
                            onClick={() => this.forgotPassword()}
                        >
                            {this.props.intl.formatMessage({ id: 'page.header.signIn.forgotPassword' })}
                        </div>
                    </div>
                </div>
            </React.Fragment>
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

    private handleClick = (label?: string, e?: React.FormEvent<HTMLInputElement>) => {
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
                    <div className="cr-sign-in-form__recaptcha-wrapper">
                        <div className="cr-sign-in-form__recaptcha">
                            <ReCAPTCHA
                                sitekey={recaptchaSitekey()}
                                onChange={this.handleReCaptchaSuccess}
                            />
                        </div>
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

    private handleChangeOtpCode = (value: string) => {
        this.setState({
            error2fa: '',
            otpCode: value,
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

    private handleSignUp = () => {
        this.props.history.push('/signup');
    };

    private forgotPassword = () => {
        this.props.history.push('/forgot_password');
    };

    private handleFieldFocus = (field: string) => {
        switch (field) {
            case 'email':
                this.setState(prev => ({
                    emailFocused: !prev.emailFocused,
                }));
                break;
            case 'password':
                this.setState(prev => ({
                    passwordFocused: !prev.passwordFocused,
                }));
                break;
            default:
                break;
        }
    };

    private handle2faFocus = () => {
        this.setState(prev => ({
            codeFocused: !prev.codeFocused,
        }));
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
