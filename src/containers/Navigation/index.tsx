import classnames from 'classnames';
import { History } from 'history';
import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { Link, RouteProps, withRouter } from 'react-router-dom';
import { Timeline, Dvr, AccountCircle, Restore, AccountBalanceWallet, PersonAdd, Person, ExitToApp, Help } from '@material-ui/icons';
import { pgRoutes } from '../../constants';
import {
    changeLanguage,
    logoutFetch,
    Market,
    RootState,
    selectCurrentColorTheme,
    selectCurrentLanguage,
    selectCurrentMarket,
    selectSidebarState,
    selectUserLoggedIn,
    toggleSidebar,
} from '../../modules';
import { languages } from '../../api/config';
import { Dropdown } from 'react-bootstrap';

interface State {
    isOpenLanguage: boolean;
}

interface DispatchProps {
    changeLanguage: typeof changeLanguage;
    toggleSidebar: typeof toggleSidebar;
    logoutFetch: typeof logoutFetch;
}

interface ReduxProps {
    lang: string;
    colorTheme: string;
    isLoggedIn: boolean;
    currentMarket: Market | undefined;
    isActive: boolean;
}

interface OwnProps {
    onLinkChange?: () => void;
    history: History;
}

type Props = OwnProps & ReduxProps & RouteProps & DispatchProps;

class NavigationContainer extends Component<Props, State> {
    public state = {
        isOpenLanguage: false,
    };

    public render() {
        const { isLoggedIn, lang } = this.props;
        const { isOpenLanguage } = this.state;

        const address = this.props.history.location ? this.props.history.location.pathname : '';
        const languageName = lang.toUpperCase();

        const languageClassName = classnames('dropdown-menu-language-field', {
            'dropdown-menu-language-field-active': isOpenLanguage,
        });

        return (
            <div className="pg-navigation-wrapper">
                {pgRoutes(isLoggedIn).map(this.renderNavItems(address))}
                <div className="pg-navigations-wrapper-lng">
                    <div className="btn-group pg-navbar__header-settings__account-dropdown dropdown-menu-language-container">
                        <Dropdown alignRight>
                            <Dropdown.Toggle variant="primary" id={languageClassName}>
                                <img
                                    src={this.tryRequire(lang) && require(`../../assets/images/languages/${lang}.svg`)}
                                    alt={`${lang}-flag-icon`}
                                />
                                <span className="dropdown-menu-language-selected">{languageName}</span>
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {this.getLanguageDropdownItems()}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>
        );
    }

    public renderNavImage = (imgName: string, isActive: boolean) => {
        switch (imgName) {

            case 'trade':
                return <Timeline className={`menu-icon ${isActive && 'route-selected'}`} />;
            case 'signin':
                return <Person className={`menu-icon ${isActive && 'route-selected'}`} />;
            case 'signup':
                return <PersonAdd className={`menu-icon ${isActive && 'route-selected'}`} />;
            case 'wallets':
                return <AccountBalanceWallet className={`menu-icon ${isActive && 'route-selected'}`} />;
            case 'orders':
                return <Dvr className={`menu-icon ${isActive && 'route-selected'}`} />;
            case 'history':
                return <Restore className={`menu-icon ${isActive && 'route-selected'}`} />;
            case 'profile':
                return <AccountCircle className={`menu-icon ${isActive && 'route-selected'}`} />;
            case 'logout':
                return <ExitToApp className={`menu-icon ${isActive && 'route-selected'}`} />;
            default:
                return <Help className={`menu-icon ${isActive && 'route-selected'}`} />;
        }
    }

    public renderNavItems = (address: string) => (values: string[], index: number) => {
        const { currentMarket } = this.props;
        const [name, url, imgName] = values;

        const handleLinkChange = () => this.props.toggleSidebar(false);
        const path = url.includes('/trading') && currentMarket ? `/trading/${currentMarket.id}` : url;
        const isActive = (url === '/trading/' && address.includes('/trading')) || address === url;

        return (
            <Link
                to={path}
                key={index}
                onClick={() => { imgName === 'logout' ? this.props.logoutFetch() : handleLinkChange(); }}
                className={`${isActive && 'route-selected'}`}
            >
                <div className="pg-navigations-wrapper-nav-item">
                    <div className="menu-icon-wrapper">
                        {this.renderNavImage(imgName, isActive)}
                    </div>
                    <p className="pg-navigation-wrapper-nav-item-text">
                        <FormattedMessage id={name} />
                    </p>
                </div>
            </Link>
        );
    };

    public getLanguageDropdownItems = () => {
        return languages.map((l: string) =>
            <Dropdown.Item key={l} onClick={e => this.handleChangeLanguage(l)}>
                <div className="dropdown-row">
                    <img
                        src={this.tryRequire(l) && require(`../../assets/images/languages/${l}.svg`)}
                        alt={`${l}-flag-icon`}
                    />
                    <span>{l.toUpperCase()}</span>
                </div>
            </Dropdown.Item>,
        );
    };

    private tryRequire = (name: string) => {
        try {
            require(`../../assets/images/languages/${name}.svg`);
            return true;
        } catch (err) {
            return false;
        }
    };


    private handleChangeLanguage = (language: string) => {
        this.props.changeLanguage(language);
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    isLoggedIn: selectUserLoggedIn(state),
    currentMarket: selectCurrentMarket(state),
    lang: selectCurrentLanguage(state),
    isActive: selectSidebarState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeLanguage: payload => dispatch(changeLanguage(payload)),
        toggleSidebar: payload => dispatch(toggleSidebar(payload)),
        logoutFetch: () => dispatch(logoutFetch()),
    });

// tslint:disable no-any
const Navigation = withRouter(connect(mapStateToProps, mapDispatchToProps)(NavigationContainer) as any) as any;

export {
    Navigation,
};
