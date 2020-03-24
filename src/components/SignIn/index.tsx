import cr from 'classnames';
import * as React from 'react';
import { CustomInput } from '../';

export interface SignInProps {
    emailLabel?: string;
    passwordLabel?: string;
    receiveConfirmationLabel?: string;
    isLoading?: boolean;
    title?: string;
    onConfirmationResend?: (email?: string) => void;
    onSubmit: () => void;
    className?: string;
    image?: string;
    email: string;
    emailError: string;
    password: string;
    passwordError: string;
    emailFocused: boolean;
    emailPlaceholder: string;
    passwordFocused: boolean;
    passwordPlaceholder: string;
    isFormValid: () => void;
    refreshError: () => void;
    handleChangeFocusField: (value: string) => void;
    changePassword: (value: string) => void;
    changeEmail: (value: string) => void;
    captchaType: string;
    renderCaptcha: JSX.Element | null;
    reCaptchaSuccess: boolean;
    captcha_response: string;
}

export class SignInComponent extends React.Component<SignInProps> {
    public render() {
        const {
            email,
            emailError,
            emailPlaceholder,
            password,
            passwordError,
            passwordPlaceholder,
            image,
            emailLabel,
            passwordLabel,
            emailFocused,
            passwordFocused,
            renderCaptcha,
        } = this.props;
        const emailGroupClass = cr('cr-sign-in-form__group', {
            'cr-sign-in-form__group--focused': emailFocused,
        });
        const passwordGroupClass = cr('cr-sign-in-form__group', {
            'cr-sign-in-form__group--focused': passwordFocused,
        });
        const logo = image ? (
            <h1 className="cr-sign-in-form__title">
                <img className="cr-sign-in-form__image" src={image} alt="logo" />
            </h1>
        ) : null;

        // tslint:disable:jsx-no-lambda
        return (
            <form>
                <div className="cr-sign-in-form__form-content">
                    {logo}
                    <div className={emailGroupClass}>
                        <CustomInput
                            type="email"
                            label={emailLabel || 'Email'}
                            placeholder={emailPlaceholder}
                            defaultLabel="Email"
                            handleChangeInput={this.handleChangeEmail}
                            inputValue={email}
                            handleFocusInput={() => this.handleFieldFocus('email')}
                            classNameLabel="cr-sign-in-form__label"
                            onKeyPress={this.handleEnterPress}
                            autoFocus={true}
                        />
                        {emailError && <div className={'cr-sign-in-form__error'}>{emailError}</div>}
                    </div>
                    <div className={passwordGroupClass}>
                        <CustomInput
                            type="password"
                            label={passwordLabel || 'Password'}
                            placeholder={passwordPlaceholder}
                            defaultLabel="Password"
                            handleChangeInput={this.handleChangePassword}
                            inputValue={password}
                            handleFocusInput={() => this.handleFieldFocus('password')}
                            classNameLabel="cr-sign-in-form__label"
                            onKeyPress={this.handleEnterPress}
                            autoFocus={false}
                        />
                        {passwordError && <div className={'cr-sign-in-form__error'}>{passwordError}</div>}
                    </div>
                    {renderCaptcha}
                </div>
            </form>
        );
        // tslint:enable:jsx-no-lambda
    }

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.props.onSubmit();
        }
    }

    private handleChangeEmail = (value: string) => {
        this.props.changeEmail(value);
    };

    private handleChangePassword = (value: string) => {
        this.props.changePassword(value);
    };

    private handleFieldFocus = (field: string) => {
        this.props.handleChangeFocusField(field);
    };

}
