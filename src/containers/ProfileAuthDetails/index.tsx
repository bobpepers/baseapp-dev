import React, { SFC, useEffect, useState } from 'react';
import { History } from 'history';
import {
    Grid,
    Button,
    Modal,
    Backdrop,
    Fade,
    TextField,
    IconButton,
    InputAdornment,
    Switch,
} from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
    makeStyles,
    Theme,
    createStyles,
} from '@material-ui/core/styles';
import {
    FormattedMessage,
    InjectedIntlProps,
    injectIntl,
} from 'react-intl';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
//import { ProfileTwoFactorAuth } from '../';
import { PASSWORD_REGEX } from '../../helpers';
import {
    RootState,
    selectUserInfo,
    User,
} from '../../modules';
import {
    changePasswordFetch,
    selectChangePasswordSuccess,
    selectTwoFactorAuthSuccess,
    toggle2faFetch,
    toggleUser2fa,
} from '../../modules/user/profile';

interface ReduxProps {
    user: User;
    passwordChangeSuccess?: boolean;
    toggle2FASuccess?: boolean;
}

interface RouterProps {
    history: History;
}

interface OnChangeEvent {
    target: {
        value: string;
    };
}

interface DispatchProps {
    changePassword: typeof changePasswordFetch;
    clearPasswordChangeError: () => void;
    toggle2fa: typeof toggle2faFetch;
    toggleUser2fa: typeof toggleUser2fa;
}

interface ProfileProps {
    showModal: boolean;
}

type Props = ReduxProps & DispatchProps & RouterProps & ProfileProps & InjectedIntlProps & OnChangeEvent;

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modal: {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
    }),
);

const ProfileAuthDetailsComponent: SFC<Props> = (props) => {
    const {
        passwordChangeSuccess,
        //toggle2FASuccess,
        //toggleUser2fa,
        toggle2fa,
        changePassword,
        history,
        user,
    } = props;
    const classes = useStyles();
    const [showChangeModal, setshowChangeModal] = useState(false);
    const [showModal, setshowModal] = useState(false);
    const [oldPassword, setoldPassword] = useState('');
    const [newPassword, setnewPassword] = useState('');
    const [confirmationPassword, setconfirmationPassword] = useState('');
    const [code2FA, setcode2FA] = useState('');
    const [showNewPassword, setshowNewPassword] = useState(false);
    const [showOldPassword, setshowOldPassword] = useState(false);
    const [showConfirmPassword, setshowConfirmPassword] = useState(false);
    const isValid2FA = code2FA.match('^[0-9]{6}$');

    useEffect(() => {
        if (passwordChangeSuccess) {
            setshowChangeModal(false);
            setoldPassword('');
            setnewPassword('');
            setconfirmationPassword('');
        }
    }, [passwordChangeSuccess]);

    const handleClickShowNewPassword = () => {
        setshowNewPassword(!showNewPassword);
    };

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const handleClickShowOldPassword = () => {
        setshowOldPassword(!showOldPassword);
    };

    const handleClickShowConfirmPassword = () => {
        setshowConfirmPassword(!showConfirmPassword);
    };

    const handleOldPassword = (e: any) => {
        setoldPassword(e.target.value);
    };

    const handleNewPassword = (e: any) => {
        setnewPassword(e.target.value);
    };

    const handleConfPassword = (e: any) => {
        setconfirmationPassword(e.target.value);
    };

    const handleChange2FACode = (e: any) => {
        setcode2FA(e.target.value);
    };

    const isValidForm = () => {
        const isNewPasswordValid = newPassword.match(PASSWORD_REGEX);
        const isConfirmPasswordValid = newPassword === confirmationPassword;

        return oldPassword && isNewPasswordValid && isConfirmPasswordValid;
    };

    const handleChangePassword = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();

        changePassword({
            old_password: oldPassword,
            new_password: newPassword,
            confirm_password: confirmationPassword,
        });
    };

    const handleDisable2FA = () => {
        toggle2fa({
            code: code2FA,
            enable: false,
        });
        setshowModal(false)
        setcode2FA('');
        // ToDo: Fix 2FA redux state on disable. state of user.otp is not properly updated after otp disable.
    };

    const handleNavigateTo2fa = (event: React.ChangeEvent<HTMLInputElement>) => {
        const enable2fa = event.target.checked;
        if (event.target.checked) {
            history.push('/security/2fa', { enable2fa });
        } else {
            setshowModal(!showModal);
        }
    };

    const handleCancel = () => {
        setshowChangeModal(false);
        setoldPassword('');
        setnewPassword('');
    };

    const renderChangePasswordModal = (
        <Grid container alignContent="center" alignItems="center" justify="center">
            <Modal
                aria-labelledby="Change Password"
                aria-describedby="Change Password Modal"
                className={classes.modal}
                open={showChangeModal}
                onClose={handleCancel}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={showChangeModal}>
                    <Grid item xs={12} sm={10} md={10} lg={8}>
                        <Grid container className="changePassword">
                            <Grid item xs={12} className="changePassword-title">
                                <FormattedMessage id="page.body.profile.header.account.content.password.change"/>
                                <div className="changePassword-title-close" onClick={handleCancel}>
                                    <img alt="close" src={require('./close.svg')}/>
                                </div>
                            </Grid>
                            <Grid item xs={12} className="changePassword-input">
                                <TextField
                                    id="old-password"
                                    variant="outlined"
                                    label={props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.old'})}
                                    autoFocus={true}
                                    fullWidth={true}
                                    type={showOldPassword ? 'text' : 'password'}
                                    onChange={handleOldPassword}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton
                                                  aria-label="toggle password visibility"
                                                  onClick={handleClickShowOldPassword}
                                                  onMouseDown={handleMouseDownPassword}
                                                  edge="end"
                                                >
                                                    {showOldPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} className="changePassword-input">
                                <TextField
                                    id="new-password"
                                    variant="outlined"
                                    label={props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.new'})}
                                    autoFocus={false}
                                    fullWidth={true}
                                    type={showNewPassword ? 'text' : 'password'}
                                    onChange={handleNewPassword}
                                    InputProps={{
                                        endAdornment:
                                            <InputAdornment position="end">
                                                <IconButton
                                                  aria-label="toggle password visibility"
                                                  onClick={handleClickShowNewPassword}
                                                  onMouseDown={handleMouseDownPassword}
                                                  edge="end"
                                                >
                                                    {showNewPassword ? <Visibility /> : <VisibilityOff />}
                                                </IconButton>
                                            </InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} className="changePassword-input">
                                <TextField
                                    id="confirmation-password"
                                    variant="outlined"
                                    label={props.intl.formatMessage({id: 'page.body.profile.header.account.content.password.conf'})}
                                    autoFocus={false}
                                    fullWidth={true}
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    onChange={handleConfPassword}
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
                                            </InputAdornment>
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} className="changePassword-button">
                                <Button
                                    fullWidth={true}
                                    onClick={handleChangePassword}
                                    disabled={!isValidForm()}
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                >
                                    <FormattedMessage id="page.body.profile.header.account.content.password.button.change" />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Fade>
            </Modal>
        </Grid>
    );

    const renderChange2FAModal = (
        <Grid container alignContent="center" alignItems="center" justify="center">
            <Modal
                aria-labelledby="Disable 2FA"
                aria-describedby="Modal to disable Two Factor Authentication"
                className={classes.modal}
                open={showModal}
                onClose={() => setshowModal(false)}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={showModal}>
                    <Grid item xs={12} sm={10} md={10} lg={8}>
                        <Grid container className="changePassword">
                            <Grid item xs={12} className="changePassword-title">
                                <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.modalHeader"/>
                                <div className="changePassword-title-close" onClick={() => setshowModal(false)}>
                                    <img alt="close" src={require('./close.svg')}/>
                                </div>
                            </Grid>
                            <Grid item xs={12} className="changePassword-input">
                                <TextField
                                    id="2fa-code"
                                    variant="outlined"
                                    label="2FA code"
                                    autoFocus={true}
                                    fullWidth={true}
                                    type="text"
                                    onChange={handleChange2FACode}
                                />
                            </Grid>
                            <Grid item xs={12} className="changePassword-button">
                                <Button
                                    disabled={!isValid2FA}
                                    onClick={handleDisable2FA}
                                    fullWidth={true}
                                    variant="contained"
                                    color="primary"
                                >
                                    <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.disable" />
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Fade>
            </Modal>
        </Grid>
    );

    return (
        <Grid container>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={3} className="profile-item">
                <p className="profile-item-title">Email:</p>
                <p className="profile-item-description">{user.email}</p>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={3} className="profile-item">
                <p className="profile-item-title">ID:</p>
                <p className="profile-item-description">{user.uid}</p>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={3} className="profile-item">
                {/* <p>{this.props.intl.formatMessage({ id: 'page.body.profile.header.account.content.password'})}</p> */}
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setshowChangeModal(true)}
                >
                    <FormattedMessage id="page.body.profile.header.account.content.password.button.change" />
                </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6} xl={3} className="profile-item">
                <label>
                    <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication" />
                </label>
                <Switch
                    checked={user.otp}
                    onChange={handleNavigateTo2fa}
                    name="2fa-switch"
                    inputProps={{ 'aria-label': 'secondary checkbox' }}
                />
                <span className={user.otp ? 'pg-profile-page__label-value__enabled' : 'pg-profile-page__label-value__disabled'}>
                    {user.otp ? <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.enable" />
                                  : <FormattedMessage id="page.body.profile.header.account.content.twoFactorAuthentication.message.disable" />}
                </span>
            </Grid>
            {renderChangePasswordModal}
            {renderChange2FAModal}
        </Grid>
    );
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    user: selectUserInfo(state),
    passwordChangeSuccess: selectChangePasswordSuccess(state),
    toggle2FASuccess: selectTwoFactorAuthSuccess(state),
});

const mapDispatchToProps = dispatch => ({
    changePassword: ({ old_password, new_password, confirm_password }) =>
        dispatch(changePasswordFetch({ old_password, new_password, confirm_password })),
    toggle2fa: ({ code, enable }) => dispatch(toggle2faFetch({ code, enable })),
    toggleUser2fa: () => dispatch(toggleUser2fa()),
});

const ProfileAuthDetailsConnected = injectIntl(connect(mapStateToProps, mapDispatchToProps)(ProfileAuthDetailsComponent));
// tslint:disable-next-line:no-any
const ProfileAuthDetails = withRouter(ProfileAuthDetailsConnected as any);

export {
    ProfileAuthDetails,
};
