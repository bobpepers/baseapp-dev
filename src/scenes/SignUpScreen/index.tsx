import cx from 'classnames';
import { History } from 'history';
import React from 'react';
import { Grid } from '@material-ui/core';
import { Button } from 'react-bootstrap';
import ReCAPTCHA from 'react-google-recaptcha';
import { captchaType, recaptchaSitekey } from '../../api/config';
import {
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { withRouter } from 'react-router-dom';
import { Modal, SignUpForm } from '../../components';
import {
    EMAIL_REGEX,
    ERROR_INVALID_EMAIL,
    ERROR_INVALID_PASSWORD,
    ERROR_PASSWORD_CONFIRMATION,
    PASSWORD_REGEX,
    setDocumentTitle,
    passwordErrorFirstSolution,
    passwordErrorSecondSolution,
    passwordErrorThirdSolution,
} from '../../helpers';
import {
    Configs,
    RootState,
    selectConfigs,
    selectCurrentLanguage,
    selectSignUpError,
    selectSignUpRequireVerification,
    signUp,
    entropyPasswordFetch,
    selectCurrentPasswordEntropy,
} from '../../modules';

interface ReduxProps {
    configs: Configs;
    requireVerification?: boolean;
    loading?: boolean;
    currentPasswordEntropy: number;
}

interface DispatchProps {
    signUp: typeof signUp;
    fetchCurrentPasswordEntropy: typeof entropyPasswordFetch;
}

interface RouterProps {
    location: {
        search: string;
    };
    history: History;
}

type Props = ReduxProps & DispatchProps & RouterProps & InjectedIntlProps;

export const extractRefID = (props: RouterProps) => new URLSearchParams(props.location.search).get('refid');

class SignUp extends React.Component<Props> {
    public readonly state = {
        showModal: false,
        email: '',
        password: '',
        confirmPassword: '',
        captcha_response: '',
        reCaptchaSuccess: false,
        refId: '',
        hasConfirmed: false,
        emailError: '',
        passwordError: '',
        confirmationError: '',
        typingTimeout: 0,
        passwordErrorFirstSolved: false,
        passwordErrorSecondSolved: false,
        passwordErrorThirdSolved: false,
        passwordPopUp: false,
        passwordFocused: false,
    };

    public constructor(props) {
        super(props);
        this.reCaptchaRef = React.createRef();
    }

    private myRef = React.createRef<HTMLInputElement>();
    private passwordWrapper = React.createRef<HTMLDivElement>();
    private reCaptchaRef;

    public componentDidMount() {
        setDocumentTitle('Sign Up');
        const localReferralCode = localStorage.getItem('referralCode');
        const refId = this.extractRefID(this.props.location.search);
        const referralCode = refId || localReferralCode || '';
        this.setState({
            refId: referralCode,
        });
        if (refId && refId !== localReferralCode) {
            localStorage.setItem('referralCode', referralCode);
        }

        document.addEventListener('click', this.handleOutsideClick, false);
    }

    public componentWillUnmount() {
        document.removeEventListener('click', this.handleOutsideClick, false);
    }

    public UNSAFE_componentWillReceiveProps(nextProps: Props) {
        const { email } = this.state;

        if (nextProps.requireVerification) {
            nextProps.history.push('/email-verification', {email: email});
        }

        if (nextProps.signUpError) {
            if (this.reCaptchaRef.current) {
                this.reCaptchaRef.current.reset();
            }
        }
    }

    public render() {
        const { configs, loading, currentPasswordEntropy } = this.props;
        const {
            email,
            password,
            confirmPassword,
            refId,
            captcha_response,
            reCaptchaSuccess,
            hasConfirmed,
            emailError,
            passwordError,
            confirmationError,
            passwordErrorFirstSolved,
            passwordErrorSecondSolved,
            passwordErrorThirdSolved,
            passwordPopUp,
        } = this.state;

        const className = cx('signup-container', { loading });

        return (
            <Grid container alignItems="center" justify="center" className="signup wrapper-container">
                <Grid item xs={12} sm={8} md={6} lg={4} xl={4} className={className}>
                    <Grid container className="signup-title">
                        <Grid item xs={12}>
                            {this.props.intl.formatMessage({ id: 'page.header.signUp' })}
                        </Grid>
                    </Grid>
                    <Grid container className="signup-content">
                        <Grid item xs={12}>
                            <SignUpForm
                                labelSignUp={this.props.intl.formatMessage({ id: 'page.header.signUp'})}
                                emailLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.email'})}
                                passwordLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.password'})}
                                confirmPasswordLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.confirmPassword'})}
                                referalCodeLabel={this.props.intl.formatMessage({ id: 'page.header.signUp.referalCode'})}
                                termsMessage={this.props.intl.formatMessage({ id: 'page.header.signUp.terms'})}
                                refId={refId}
                                handleChangeRefId={this.handleChangeRefId}
                                isLoading={loading}
                                onSignUp={this.handleSignUp}
                                email={email}
                                handleChangeEmail={this.handleChangeEmail}
                                password={password}
                                handleChangePassword={this.handleChangePassword}
                                confirmPassword={confirmPassword}
                                handleChangeConfirmPassword={this.handleChangeConfirmPassword}
                                hasConfirmed={hasConfirmed}
                                clickCheckBox={this.handleCheckboxClick}
                                validateForm={this.handleValidateForm}
                                emailError={emailError}
                                passwordError={passwordError}
                                confirmationError={confirmationError}
                                captchaType={captchaType()}
                                renderCaptcha={this.renderCaptcha()}
                                reCaptchaSuccess={reCaptchaSuccess}
                                captcha_response={captcha_response}
                                currentPasswordEntropy={currentPasswordEntropy}
                                minPasswordEntropy={configs.password_min_entropy}
                                passwordErrorFirstSolved={passwordErrorFirstSolved}
                                passwordErrorSecondSolved={passwordErrorSecondSolved}
                                passwordErrorThirdSolved={passwordErrorThirdSolved}
                                passwordPopUp={passwordPopUp}
                                myRef={this.myRef}
                                passwordWrapper={this.passwordWrapper}
                                translate={this.translate}
                                handleFocusPassword={this.handleFocusPassword}
                            />
                            <Modal
                                show={this.state.showModal}
                                header={this.renderModalHeader()}
                                content={this.renderModalBody()}
                                footer={this.renderModalFooter()}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});

    private handleOutsideClick = event => {
        const wrapperElement = this.passwordWrapper.current;

        if (wrapperElement && !wrapperElement.contains(event.target)) {
            this.setState({
                passwordPopUp: false,
            });
        }
    };

    private renderCaptcha = () => {
        switch (captchaType()) {
            case 'recaptcha':
                return (
                    <div className="signup-recaptcha">
                        <ReCAPTCHA
                            ref={this.reCaptchaRef}
                            sitekey={recaptchaSitekey()}
                            onChange={this.handleReCaptchaSuccess}
                        />
                    </div>
                );
            default:
                return null;

        }
    };

    private handleCheckboxClick = () => {
        this.setState({
            hasConfirmed: !this.state.hasConfirmed,
        });
    };

    private handleChangeEmail = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({
            email: e.target.value,
        });
    };

    private handleChangePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { passwordErrorFirstSolved, passwordErrorSecondSolved, passwordErrorThirdSolved } = this.state;

        const value = e.target.value;

        if (passwordErrorFirstSolution(value) && !passwordErrorFirstSolved) {
            this.setState({
                passwordErrorFirstSolved: true,
            });
        } else if (!passwordErrorFirstSolution(value) && passwordErrorFirstSolved) {
            this.setState({
                passwordErrorFirstSolved: false,

            });

        }

        if (passwordErrorSecondSolution(value) && !passwordErrorSecondSolved) {
            this.setState({
                passwordErrorSecondSolved: true,
            });
        } else if (!passwordErrorSecondSolution(value) && passwordErrorSecondSolved) {
            this.setState({
                passwordErrorSecondSolved: false,
            });
        }

        if (passwordErrorThirdSolution(value) && !passwordErrorThirdSolved) {
            this.setState({
                passwordErrorThirdSolved: true,
            });
        } else if (!passwordErrorThirdSolution(value) && passwordErrorThirdSolved) {
            this.setState({
                passwordErrorThirdSolved: false,
            });
        }

        if (this.state.typingTimeout) {
            clearTimeout(this.state.typingTimeout);
         }

        this.setState({
            password: value,
            typingTimeout: setTimeout(() => {
                this.props.fetchCurrentPasswordEntropy({ password: value });
            }, 500),
        });
    };

    private handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({
            confirmPassword: e.target.value,
        });
    };

    private handleChangeRefId = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        this.setState({
            refId: e.target.value,
        });
    };


    private handleFocusPassword = () => {
        this.setState({
            passwordFocused: !this.state.passwordFocused,
            passwordPopUp: !this.state.passwordPopUp,
        });
    };

    private handleReCaptchaSuccess = (value: string) => {
        this.setState({
            reCaptchaSuccess: true,
            captcha_response: value,
        });
    };


    private handleSignUp = () => {
        const { configs, i18n } = this.props;
        const {
            email,
            password,
            captcha_response,
            refId,
        } = this.state;

        if (refId) {
            switch (configs.captcha_type) {
                case 'none':
                    this.props.signUp({
                        email,
                        password,
                        refid: refId,
                        lang: i18n.toUpperCase(),
                    });
                    break;
                case 'recaptcha':
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        refid: refId,
                    });
                    break;
                default:
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        refid: refId,
                        lang: i18n.toUpperCase(),
                    });
                    break;
            }
        } else {
            switch (configs.captcha_type) {
                case 'none':
                    this.props.signUp({
                        email,
                        password,
                        lang: i18n.toUpperCase(),
                    });
                    break;
                case 'recaptcha':
                default:
                    this.props.signUp({
                        email,
                        password,
                        captcha_response,
                        lang: i18n.toUpperCase(),
                    });
                    break;
            }
        }

        this.setState({
            reCaptchaSuccess: false,
            captcha_response: '',
        });
    };

    private renderModalHeader = () => {
        return (
            <div className="pg-exchange-modal-submit-header">
                {this.props.intl.formatMessage({id: 'page.header.signUp.modal.header'})}
            </div>
        );
    };

    private renderModalBody = () => {
        return (
            <div className="pg-exchange-modal-submit-body">
                <h2>
                    {this.props.intl.formatMessage({id: 'page.header.signUp.modal.body'})}
                </h2>
            </div>
        );
    };

    private renderModalFooter = () => {
        return (
            <div className="pg-exchange-modal-submit-footer">
                <Button
                    block={true}
                    onClick={this.closeModal}
                    size="lg"
                    variant="primary"
                >
                    {this.props.intl.formatMessage({id: 'page.header.signUp.modal.footer'})}
                </Button>
            </div>
        );
    };

    private closeModal = () => {
        this.setState({showModal: false});
        this.props.history.push('/login');
    };

    private extractRefID = (url: string) => new URLSearchParams(url).get('refid');

    private handleValidateForm = () => {
        const {email, password, confirmPassword} = this.state;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        if (!isEmailValid && !isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                hasConfirmed: false,
            });

            return;
        }

        if (!isEmailValid) {
            this.setState({
                confirmationError: '',
                emailError: this.props.intl.formatMessage({ id: ERROR_INVALID_EMAIL }),
                passwordError: '',
                hasConfirmed: false,
            });

            return;
        }

        if (!isPasswordValid) {
            this.setState({
                confirmationError: '',
                emailError: '',
                passwordError: this.props.intl.formatMessage({ id: ERROR_INVALID_PASSWORD }),
                hasConfirmed: false,
            });

            return;
        }

        if (!isConfirmPasswordValid) {
            this.setState({
                confirmationError: this.props.intl.formatMessage({ id: ERROR_PASSWORD_CONFIRMATION }),
                emailError: '',
                passwordError: '',
                hasConfirmed: false,
            });

            return;
        }
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> = state => ({
    configs: selectConfigs(state),
    i18n: selectCurrentLanguage(state),
    requireVerification: selectSignUpRequireVerification(state),
    signUpError: selectSignUpError(state),
    currentPasswordEntropy: selectCurrentPasswordEntropy(state),
});

const mapDispatchProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        signUp: credentials => dispatch(signUp(credentials)),
        fetchCurrentPasswordEntropy: payload => dispatch(entropyPasswordFetch(payload)),
    });

// tslint:disable-next-line:no-any
const SignUpScreen = injectIntl(withRouter(connect(mapStateToProps, mapDispatchProps)(SignUp) as any));

export {
    SignUpScreen,
};
