import cr from 'classnames';
import * as React from 'react';
import { Button, Form } from 'react-bootstrap';
import { CustomInput, PasswordStrengthMeter } from '../';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../../helpers';

export interface SignUpFormProps {
    isLoading?: boolean;
    title?: string;
    onSignUp: () => void;
    className?: string;
    labelSignUp?: string;
    emailLabel?: string;
    passwordLabel?: string;
    confirmPasswordLabel?: string;
    referalCodeLabel?: string;
    termsMessage?: string;
    refId: string;
    password: string;
    email: string;
    confirmPassword: string;
    handleChangeEmail: (value: string) => void;
    handleChangePassword: (value: string) => void;
    handleChangeConfirmPassword: (value: string) => void;
    handleChangeRefId: (value: string) => void;
    hasConfirmed: boolean;
    clickCheckBox: () => void;
    validateForm: () => void;
    emailError: string;
    passwordError: string;
    confirmationError: string;
    handleFocusEmail: () => void;
    handleFocusPassword: () => void;
    handleFocusConfirmPassword: () => void;
    handleFocusRefId: () => void;
    confirmPasswordFocused: boolean;
    refIdFocused: boolean;
    emailFocused: boolean;
    passwordFocused: boolean;
    captchaType: string;
    renderCaptcha: JSX.Element | null;
    reCaptchaSuccess: boolean;
    captcha_response: string;
    currentPasswordEntropy: number;
    minPasswordEntropy: number;
    passwordErrorFirstSolved: boolean;
    passwordErrorSecondSolved: boolean;
    passwordErrorThirdSolved: boolean;
    passwordPopUp: boolean;
    myRef: any;
    passwordWrapper: any;
    translate: (id: string) => string;
}

export class SignUpForm extends React.Component<SignUpFormProps> {
    public render() {
        const {
            email,
            labelSignUp,
            confirmPassword,
            refId,
            isLoading,
            emailLabel,
            confirmPasswordLabel,
            referalCodeLabel,
            termsMessage,
            hasConfirmed,
            emailError,
            confirmationError,
            emailFocused,
            confirmPasswordFocused,
            refIdFocused,
        } = this.props;

        const emailGroupClass = cr('signup-form-group', {
            'signup-form-group-focused': emailFocused,
        });

        const confirmPasswordGroupClass = cr('signup-form-group', {
            'signup-form-group-focused': confirmPasswordFocused,
        });
        const refIdGroupClass = cr('signup-form-group', {
            'signup-form-group-focused': refIdFocused,
        });

        return (
            <form className="signup-form">
                <div className={emailGroupClass}>
                    <CustomInput
                        type="email"
                        label={emailLabel || 'Email'}
                        placeholder={emailLabel || 'Email'}
                        defaultLabel="Email"
                        handleChangeInput={this.props.handleChangeEmail}
                        inputValue={email}
                        handleFocusInput={this.props.handleFocusEmail}
                        classNameLabel="signup-form-label"
                        classNameInput="signup-form-input"
                        autoFocus={true}
                    />
                    {emailError && <div className="signup-form-error">{emailError}</div>}
                </div>
                {this.renderPasswordInput()}
                <div className={confirmPasswordGroupClass}>
                    <CustomInput
                        type="password"
                        label={confirmPasswordLabel || 'Confirm Password'}
                        placeholder={confirmPasswordLabel || 'Confirm Password'}
                        defaultLabel="Confirm Password"
                        handleChangeInput={this.props.handleChangeConfirmPassword}
                        inputValue={confirmPassword}
                        handleFocusInput={this.props.handleFocusConfirmPassword}
                        classNameLabel="signup-form-label"
                        classNameInput="signup-form-input"
                        autoFocus={false}
                    />
                    {confirmationError && <div className={'signup-form-error'}>{confirmationError}</div>}
                </div>
                <div className={refIdGroupClass}>
                    <CustomInput
                        type="text"
                        label={referalCodeLabel || 'Referral code'}
                        placeholder={referalCodeLabel || 'Referral code'}
                        defaultLabel="Referral code"
                        handleChangeInput={this.props.handleChangeRefId}
                        inputValue={refId}
                        handleFocusInput={this.props.handleFocusRefId}
                        classNameLabel="signup-form-label"
                        classNameInput="signup-form-input"
                        autoFocus={false}
                    />
                </div>
                <div className="signup-form-checkbox">
                    <Form.Check
                        type="checkbox"
                        custom
                        id="agreeWithTerms"
                        checked={hasConfirmed}
                        onChange={this.props.clickCheckBox}
                        label={termsMessage ? termsMessage : 'I have read and agree to the Terms of Service'}
                    />
                </div>
                {this.props.renderCaptcha}
                <div className="signup-form-button">
                    <Button
                        block={true}
                        type="button"
                        disabled={this.disableButton()}
                        onClick={e => this.handleClick(e)}
                        size="lg"
                        variant="primary"
                    >
                        {isLoading ? 'Loading...' : (labelSignUp ? labelSignUp : 'Sign up')}
                    </Button>
                </div>
            </form>
        );
    }

    private renderPasswordInput = () => {
        const {
            password,
            passwordLabel,
            passwordFocused,
            currentPasswordEntropy,
            passwordPopUp,
            translate,
        } = this.props;

        const passwordGroupClass = cr('signup-form-group', {
            'signup-form-group-focused': passwordFocused,
        });

        return (
            <div className={passwordGroupClass}>
                <CustomInput
                    type="password"
                    label={passwordLabel || 'Password'}
                    placeholder={passwordLabel || 'Password'}
                    defaultLabel="Password"
                    handleChangeInput={this.props.handleChangePassword}
                    inputValue={password}
                    handleFocusInput={this.props.handleFocusPassword}
                    classNameLabel="signup-form-label"
                    classNameInput="signup-form-input"
                    autoFocus={false}
                />
                {password ?
                    <PasswordStrengthMeter
                        minPasswordEntropy={this.props.minPasswordEntropy}
                        currentPasswordEntropy={currentPasswordEntropy}
                        passwordExist={password !== ''}
                        passwordErrorFirstSolved={this.props.passwordErrorFirstSolved}
                        passwordErrorSecondSolved={this.props.passwordErrorSecondSolved}
                        passwordErrorThirdSolved={this.props.passwordErrorThirdSolved}
                        passwordPopUp={passwordPopUp}
                        translate={translate}
                    /> : null}
            </div>
        );
    };

    private disableButton = (): boolean => {
        const {
            email,
            password,
            confirmPassword,
            hasConfirmed,
            reCaptchaSuccess,
            isLoading,
            captchaType,
        } = this.props;

        if (!hasConfirmed || isLoading || !email.match(EMAIL_REGEX) || !password || !confirmPassword) {
            return true;
        }
        if (captchaType === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }

        return false;
    };

    private handleSubmitForm() {
        this.props.onSignUp();
    }

    private isValidForm() {
        const { email, password, confirmPassword } = this.props;
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        return (email && isEmailValid) &&
            (password && isPasswordValid) &&
            (confirmPassword && isConfirmPasswordValid);
    }

    private handleClick = (label?: string, e?: React.FormEvent<HTMLInputElement>) => {
        if (e) {
            e.preventDefault();
        }

        if (!this.isValidForm()) {
            this.props.validateForm();
        } else {
            this.handleSubmitForm();
        }
    };
}
