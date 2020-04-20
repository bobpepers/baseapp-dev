import cr from 'classnames';
import * as React from 'react';
import { Grid, CircularProgress, Button } from '@material-ui/core';
import { CustomInput } from '../';
import { EMAIL_REGEX } from '../../helpers';

export interface EmailFormProps {
    title?: string;
    buttonLabel?: string;
    errorMessage?: string;
    isLoading?: boolean;
    OnSubmit: () => void;
    className?: string;
    emailLabel?: string;
    email: string;
    message: string;
    emailError: string;
    emailFocused: boolean;
    placeholder?: string;
    validateForm: () => void;
    handleInputEmail: (value: string) => void;
    handleFieldFocus: () => void;
    handleReturnBack: () => void;
}

export class EmailForm extends React.Component<EmailFormProps> {
    public render() {
        const {
            title,
            buttonLabel,
            isLoading,
            emailLabel,
            message,
            email,
            emailFocused,
            emailError,
        } = this.props;
        const emailGroupClass = cr('password-recovery-group', {
            'password-recovery-group-focused': emailFocused,
        });

        return (
            <form>
                <Grid container className="password-recovery">
                    <Grid item xs={12} className="password-recovery-title">
                        {title ? title : 'Forgot password'}
                        <div className="password-recovery-close" onClick={this.handleCancel}>
                            <img alt="close" src={require('./close.svg')}/>
                        </div>
                    </Grid>
                    <Grid item xs={12} className="password-recovery-description">
                        {message}
                        <div className={emailGroupClass}>
                            <CustomInput
                                type="email"
                                label={emailLabel || 'Email'}
                                placeholder={emailLabel || 'Email'}
                                defaultLabel="Email"
                                handleChangeInput={this.props.handleInputEmail}
                                inputValue={email}
                                handleFocusInput={this.props.handleFieldFocus}
                                classNameLabel="password-recovery-label"
                                classNameInput="password-recovery-input"
                                autoFocus={true}
                            />
                            {emailError && <div className="password-recovery-error">{emailError}</div>}
                        </div>
                    </Grid>
                    <Grid item xs={12} className="password-recovery-button">
                        <Button
                            variant="contained"
                            color="primary"
                            disabled={isLoading || !email.match(EMAIL_REGEX)}
                            onClick={e => this.handleClick(e as any)}
                        >
                            {isLoading ? <CircularProgress disableShrink /> : buttonLabel ? buttonLabel : 'Send'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        );
    }

    private handleCancel = () => {
        this.props.handleReturnBack();
    };

    private handleSubmitForm() {
        this.props.OnSubmit();
    }

    private isValidForm() {
        const { email } = this.props;
        const isEmailValid = email.match(EMAIL_REGEX);

        return email && isEmailValid;
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
