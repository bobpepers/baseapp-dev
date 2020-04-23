import React, { FunctionComponent, useState } from 'react';
import {
    TextField,
    IconButton,
    InputAdornment,
} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';

export interface SignInProps {
    emailLabel?: string;
    passwordLabel?: string;
    receiveConfirmationLabel?: string;
    isLoading?: boolean;
    title?: string;
    onConfirmationResend?: (email?: string) => void;
    onSubmit: () => void;
    className?: string;
    emailError: string;
    passwordError: string;
    isFormValid: () => void;
    refreshError: () => void;
    changePassword: (value: string) => void;
    changeEmail: (value: string) => void;
    captchaType: string;
    renderCaptcha: JSX.Element | null;
    reCaptchaSuccess: boolean;
    captcha_response: string;
}

export const SignInComponent: FunctionComponent<SignInProps> = props => {
    const {
        emailError,
        passwordError,
        emailLabel,
        passwordLabel,
        renderCaptcha,
        onSubmit,
        changeEmail,
        changePassword,
    } = props;
    const [showPassword, setshowPassword] = useState(false);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickShowPassword = () => {
        setshowPassword(!showPassword);
    };

    const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
        }
    };

    const handleChangeEmail = (e: any) => {
        changeEmail(e.target.value);
    };

    const handleChangePassword = (e: any) => {
        changePassword(e.target.value);
    };

    return (
        <form>
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
                />
                {emailError && <div className={'signin-form-error'}>{emailError}</div>}
            </div>
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
                {passwordError && <div className={'signin-form-error'}>{passwordError}</div>}
            </div>
            {renderCaptcha}
        </form>
    );
};
