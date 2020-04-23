import React, { FunctionComponent } from 'react';
import { TextField } from '@material-ui/core';

export interface TwoFactorAuthProps {
    errorMessage?: string;
    onSubmit: () => void;
    label: string;
    handleOtpCodeChange: (otp: any) => void;
}

const TwoFactorAuthComponent: FunctionComponent<TwoFactorAuthProps> = props => {
    const {
        errorMessage,
        label,
        handleOtpCodeChange,
        onSubmit,
    } = props;

    const handleEnterPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            onSubmit();
        }
    };

    return (
        <form>
            <TextField
                id="2fa"
                variant="outlined"
                label={label || 'Two Factor Authenticator Code'}
                autoFocus={false}
                fullWidth={true}
                type="number"
                onChange={handleOtpCodeChange}
                onKeyPress={handleEnterPress}
            />
            {errorMessage && <div className="login-error-message">{errorMessage}</div>}
        </form>
    );
};

export const TwoFactorAuth = TwoFactorAuthComponent;
