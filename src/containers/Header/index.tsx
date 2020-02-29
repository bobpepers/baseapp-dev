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
import { NavBar } from '../NavBar';
import { Navigation } from '../Navigation';
import logo from '../../assets/images/logo.svg';
import logoLight from '../../assets/images/logoLight.svg';

import useWindowDimensions from '../../hooks/getScreenWidth';

type ScreenWidthChildren = (screenWidth: number) => any;

interface IScreenWidthProps {
  children: ScreenWidthChildren;
}

export const ScreenWidth: React.FunctionComponent<IScreenWidthProps> = ({
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
        const tradingCls = window.location.pathname.includes('/trading') ? 'pg-container-trading' : '';
        const shouldRenderHeader = !['/confirm'].some(r => window.location.pathname.includes(r));
        
        return (
            <React.Fragment>
            {shouldRenderHeader &&
                <header className={`pg-header`}>
                    <div className={`pg-container pg-header__content ${tradingCls}`}>
                        <ScreenWidth>
                            {
                                (width) => {
                                    if (width < 996) {
                                        return (
                                            <div
                                                className={`pg-sidebar__toggler ${mobileWallet && 'pg-sidebar__toggler-mobile'}`}
                                                onClick={this.openSidebar}
                                            >
                                                <span className="pg-sidebar__toggler-item"/>
                                                <span className="pg-sidebar__toggler-item"/>
                                                <span className="pg-sidebar__toggler-item"/>
                                            </div>
                                        )
                                    } else {
                                        return <span />
                                    }                                    
                                } 
                            }
                        </ScreenWidth> 
                        
                        <div onClick={e => this.redirectToLanding()} className="pg-header__logo">
                            <div className="pg-logo">
                                {colorTheme === 'light' ? (
                                    <img src={logoLight} className="pg-logo__img" alt="Logo" />
                                ) : (
                                    <img src={logo} className="pg-logo__img" alt="Logo" />
                               )}
                            </div>
                        </div>
                        
                        <div className="pg-header__location">
                            {mobileWallet ? <span>{mobileWallet}</span> : <span>{window.location.pathname.split('/')[1]}</span>}
                        </div>
                        {this.renderMobileWalletNav()}
                         
                        <ScreenWidth>
                            {
                                (width) => {
                                    if (width >= 996) {
                                        return <Navigation />
                                    } else {
                                        return <span />
                                    }                                    
                                } 
                            }
                        </ScreenWidth>       
                        
                        <div className="pg-header__navbar">
                            <NavBar onLinkChange={this.closeMenu}/>
                        </div>
                    </div>
                </header>}
          </React.Fragment>
        );
    }

    public renderMobileWalletNav = () => {
        const { colorTheme, mobileWallet } = this.props;
        const isLight = colorTheme === 'light' ? 'Light' : '';

        return mobileWallet && (
            <div onClick={this.backWallets} className="pg-header__toggler">
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

    private closeMenu = (e: any) => this.props.setMobileWalletUi('');
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
