import cr from 'classnames';
import { CustomInput } from '../';
import * as React from 'react';

export interface TwoFactorAuthProps {
    errorMessage?: string;
    onSubmit: () => void;
    label: string;
    message: string;
    otpCode: string;
    codeFocused: boolean;
    handleOtpCodeChange: (otp: string) => void;
    handleChangeFocusField: () => void;
}

class TwoFactorAuthComponent extends React.Component<TwoFactorAuthProps> {
    public render() {
        const {
            errorMessage,
            label,
            message,
            otpCode,
            codeFocused,
        } = this.props;

        const emailGroupClass = cr('cr-email-form__group', {
            'cr-email-form__group--focused': codeFocused,
        });

        return (
            <form>
                <div className="cr-2fa-form">
                    <div className="cr-2fa-form__form-content">
                        <div className="cr-email-form__header">
                            {message}
                        </div>
                        <div className={emailGroupClass}>
                            <CustomInput
                                type="number"
                                label={label || '6-digit Google Authenticator Code'}
                                placeholder={label || '6-digit Google Authenticator Code'}
                                defaultLabel="6-digit Google Authenticator Code"
                                handleChangeInput={this.props.handleOtpCodeChange}
                                inputValue={otpCode}
                                handleFocusInput={this.props.handleChangeFocusField}
                                classNameLabel="cr-email-form__label"
                                classNameInput="cr-email-form__input"
                                onKeyPress={this.handleEnterPress}
                                autoFocus={true}
                            />
                            {errorMessage && <div className="cr-email-form__error">{errorMessage}</div>}
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    private handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            this.props.onSubmit();
        }
    };
}

export const TwoFactorAuth = TwoFactorAuthComponent;
