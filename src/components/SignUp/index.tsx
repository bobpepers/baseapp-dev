import React, { FunctionComponent, useState } from 'react';
import {
    TextField,
    IconButton,
    InputAdornment,
    Button,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Form } from 'react-bootstrap';
import { PasswordStrengthMeter } from '../';
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
    handleChangeEmail: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleChangePassword: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleChangeConfirmPassword: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    handleChangeRefId: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    hasConfirmed: boolean;
    clickCheckBox: () => void;
    validateForm: () => void;
    emailError: string;
    passwordError: string;
    confirmationError: string;
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
    handleFocusPassword: () => void;
}

export const SignUpForm: FunctionComponent<SignUpFormProps> = props => {
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
        password,
        passwordLabel,
        currentPasswordEntropy,
        passwordPopUp,
        translate,
        reCaptchaSuccess,
        captchaType,
        onSignUp,
        validateForm,
        handleChangeEmail,
        handleChangeRefId,
        handleChangePassword,
        minPasswordEntropy,
        passwordErrorFirstSolved,
        passwordErrorSecondSolved,
        passwordErrorThirdSolved,
        handleChangeConfirmPassword,
        clickCheckBox,
        renderCaptcha,
        handleFocusPassword,
    } = props;

    const [showPassword, setshowPassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickShowPassword = () => {
        setshowPassword(!showPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setshowConfirmPassword(!showConfirmPassword);
    };


    const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSignUp();
        }
    };

    const handleSubmitForm = () => {
        onSignUp();
    };

    const renderPasswordInput = () => {
        return (
            <div className="signin-form-input">
                <TextField
                    id="password"
                    variant="outlined"
                    label={passwordLabel || 'Password'}
                    autoFocus={false}
                    fullWidth={true}
                    type={showPassword ? 'text' : 'password'}
                    onChange={handleChangePassword}
                    onKeyPress={handleEnterPress}
                    onFocus={handleFocusPassword}
                    onBlur={handleFocusPassword}
                    value={password.toString()}
                    InputProps={{
                        endAdornment:
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>,
                    }}
                />
                {password ?
                    <PasswordStrengthMeter
                        minPasswordEntropy={minPasswordEntropy}
                        currentPasswordEntropy={currentPasswordEntropy}
                        passwordExist={password !== ''}
                        passwordErrorFirstSolved={passwordErrorFirstSolved}
                        passwordErrorSecondSolved={passwordErrorSecondSolved}
                        passwordErrorThirdSolved={passwordErrorThirdSolved}
                        passwordPopUp={passwordPopUp}
                        translate={translate}
                    /> : null}
            </div>
        );
    };

    const disableButton = (): boolean => {
        if (!hasConfirmed || isLoading || !email.match(EMAIL_REGEX) || !password || !confirmPassword) {
            return true;
        }
        if (captchaType === 'recaptcha' && !reCaptchaSuccess) {
            return true;
        }

        return false;
    };

    const isValidForm = () => {
        const isEmailValid = email.match(EMAIL_REGEX);
        const isPasswordValid = password.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = password === confirmPassword;

        return (email && isEmailValid) &&
            (password && isPasswordValid) &&
            (confirmPassword && isConfirmPasswordValid);
    };

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (e) {
            e.preventDefault();
        }

        if (!isValidForm()) {
            validateForm();
        } else {
            handleSubmitForm();
        }
    };

    return (
            <form className="signup-form">
                <div className="signin-form-input">
                    <TextField
                        id="email"
                        variant="outlined"
                        label={emailLabel || 'Email'}
                        autoFocus={true}
                        fullWidth={true}
                        type="email"
                        onChange={handleChangeEmail}
                        onKeyPress={handleEnterPress}
                        value={email.toString()}
                    />
                    {emailError && <div className="signup-form-error">{emailError}</div>}
                </div>
                {renderPasswordInput()}
                <div className="signin-form-input">
                    <TextField
                        id="confirm-password"
                        variant="outlined"
                        label={confirmPasswordLabel || 'Confirm Password'}
                        autoFocus={false}
                        fullWidth={true}
                        type={showConfirmPassword ? 'text' : 'password'}
                        onChange={handleChangeConfirmPassword}
                        onKeyPress={handleEnterPress}
                        value={confirmPassword.toString()}
                        InputProps={{
                            endAdornment:
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={handleClickShowConfirmPassword}
                                        onMouseDown={handleMouseDownPassword}
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>,
                        }}
                    />
                    {confirmationError && <div className={'signup-form-error'}>{confirmationError}</div>}
                </div>
                <div className="signin-form-input">
                    <TextField
                        id="referal-code"
                        variant="outlined"
                        label={referalCodeLabel || 'Referral code'}
                        autoFocus={false}
                        fullWidth={true}
                        type="text"
                        onChange={handleChangeRefId}
                        onKeyPress={handleEnterPress}
                        value={refId.toString()}
                    />
                </div>
                <div className="signin-form-input">
                    <Form.Check
                        type="checkbox"
                        custom
                        id="agreeWithTerms"
                        checked={hasConfirmed}
                        onChange={clickCheckBox}
                        label={termsMessage ? termsMessage : 'I have read and agree to the Terms of Service'}
                    />
                </div>
                {renderCaptcha}
                <div className="signup-form-button">
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={disableButton()}
                        onClick={handleClick}
                        fullWidth={true}
                        size="large"
                    >
                        {isLoading ? 'Loading...' : (labelSignUp ? labelSignUp : 'Sign up')}
                    </Button>
                </div>
            </form>
    );
};
