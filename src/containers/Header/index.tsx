import { History } from 'history';
import * as React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { connect, MapDispatchToPropsFunction } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {
    RootState,
    selectCurrentColorTheme,
    selectMobileWalletUi,
    selectSidebarState,
    setMobileWalletUi,
    toggleSidebar,
} from '../../modules';
import { Navigation } from '../Navigation';
import logo from '../../assets/images/logo.svg';

import { useWindowDimensions } from '../../hooks/getScreenWidth';

type ScreenWidthChildren = (screenWidth: number) => any;

interface ScreenWidthProps {
  children: ScreenWidthChildren;
}

export const ScreenWidth: React.FunctionComponent<ScreenWidthProps> = ({
  children,
}) => {
  const screenWidth: number = useWindowDimensions();

  return children(screenWidth);
};

interface ReduxProps {
    colorTheme: string;
    mobileWallet: string;
    sidebarOpened: boolean;
}

interface DispatchProps {
    setMobileWalletUi: typeof setMobileWalletUi;
    toggleSidebar: typeof toggleSidebar;
}

interface HistoryProps {
    history: History;
}

type Props = ReduxProps & HistoryProps & DispatchProps & InjectedIntlProps;

// tslint:disable jsx-no-multiline-js
class Head extends React.Component<Props> {

    public render() {
        const { colorTheme, mobileWallet } = this.props;
        const headerLogoImageActive = window.location.pathname === '/' ? '-active' : '';
        const shouldRenderHeader = !['/confirm'].some(r => window.location.pathname.includes(r));

        return (
            <React.Fragment>
            {shouldRenderHeader &&
                <header className="header">
                    <div className="header-container header-content">
                        <ScreenWidth>
                            {
                                width => {
                                    if (width < 996) {
                                        return (
                                            <div
                                                className={`header-mobile-toggle ${mobileWallet && 'header-mobile-toggle-menu'}`}
                                                onClick={this.openSidebar}
                                            >
                                                <span className="header-mobile-toggle-item"/>
                                                <span className="header-mobile-toggle-item"/>
                                                <span className="header-mobile-toggle-item"/>
                                            </div>
                                        );
                                    } else {
                                        return <span />;
                                    }
                                }
                            }
                        </ScreenWidth>

                        <div onClick={e => this.redirectToLanding()} className="header-logo">
                            <img
                                src={logo}
                                className={`header-logo-img ${colorTheme === 'light' ? `header-logo-img-light${headerLogoImageActive}` : `header-logo-img-dark${headerLogoImageActive}`}`}
                                alt="Logo"
                            />
                        </div>

                        <div className="header-location">
                            {mobileWallet ? <span>{mobileWallet}</span> : <span>{window.location.pathname.split('/')[1]}</span>}
                        </div>
                        {this.renderMobileWalletNav()}

                        <ScreenWidth>
                            {
                                width => {
                                    if (width >= 996) {
                                        this.props.toggleSidebar(false);
                                        return <Navigation />;
                                    } else {
                                        return <span />;
                                    }
                                }
                            }
                        </ScreenWidth>
                    </div>
                </header>}
          </React.Fragment>
        );
    }

    public renderMobileWalletNav = () => {
        const { colorTheme, mobileWallet } = this.props;
        const isLight = colorTheme === 'light' ? 'Light' : '';

        return mobileWallet && (
            <div onClick={this.backWallets} className="header-toggler">
                <img alt="" src={require(`./back${isLight}.svg`)} />
            </div>
        );
    };

    public translate = (id: string) => {
        return id ? this.props.intl.formatMessage({ id }) : '';
    };


    private redirectToLanding = () => {
        this.props.toggleSidebar(false);
        this.props.history.push('/');
    }

    private openSidebar = () => this.props.toggleSidebar(!this.props.sidebarOpened);

    private backWallets = () => this.props.setMobileWalletUi('');
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    colorTheme: selectCurrentColorTheme(state),
    mobileWallet: selectMobileWalletUi(state),
    sidebarOpened: selectSidebarState(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        setMobileWalletUi: payload => dispatch(setMobileWalletUi(payload)),
        toggleSidebar: payload => dispatch(toggleSidebar(payload)),
    });

const Header = injectIntl(withRouter(connect(mapStateToProps, mapDispatchToProps)(Head) as any) as any);

export {
    Header,
};
