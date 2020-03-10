import * as React from 'react';
import { RouterProps } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { InjectedIntlProps, injectIntl } from 'react-intl';

const TelegramIcon = require('../../assets/images/social/Telegram.svg');
const TwitterIcon = require('../../assets/images/social/Twitter.svg');
const DiscordIcon = require('../../assets/images/social/Discord.svg');

// const FacebookIcon = require('../../assets/images/landing/social/Facebook.svg');
// const MediumIcon = require('../../assets/images/landing/social/Medium.svg');
// const CoinMarketIcon = require('../../assets/images/landing/social/CoinMarket.svg');

type Props = RouterProps & InjectedIntlProps;

class FooterComponent extends React.Component<Props> {
    public render() {
        if (this.props.history.location.pathname.startsWith('/confirm')) {
            return <React.Fragment />;
        }

        return (
            <React.Fragment>
                <div className="pg-footer__footer">
                    <div className="pg-footer__footer__wrap">                    
                        <div className="pg-footer__footer__wrap__navigation">
                            <div className="pg-footer__footer__wrap__navigation__col">
                                <Link to="/trading/">{this.translate('page.body.landing.footer.exchange')}</Link>
                                <Link to="/wallets">{this.translate('page.body.landing.footer.wallets')}</Link>
                                <Link to="/fees">{this.translate('page.body.landing.footer.fees')}</Link>
                                <Link to="/docs-api">API</Link>                                
                            </div>
                            <div className="pg-footer__footer__wrap__navigation__col">
                                <a rel="noopener noreferrer" target="_blank" href="https://runesx.freshdesk.com/support/home">{this.translate('page.body.landing.footer.support')}</a>
                                <Link to="/privacy">{this.translate('page.body.landing.footer.privacy')}</Link>
                                <Link to="/terms">{this.translate('page.body.landing.footer.terms')}</Link>
                                <a rel="noopener noreferrer" target="_blank" href="https://www.openware.com">{this.translate('page.body.landing.footer.attribution')}</a>
                            </div>
                            <div className="pg-footer__footer__wrap__navigation__col">
                                <a rel="noopener noreferrer" target="_blank" href="https://www.runebase.io">{this.translate('page.body.landing.footer.about')}</a>
                                <a rel="noopener noreferrer" target="_blank" href="https://forms.gle/itdoPqSbhuYRTame9">{this.translate('page.body.landing.footer.listing')}</a>
                                <Link to="/vote">{this.translate('page.body.landing.footer.voting')}</Link>
                                <Link to="/status">{this.translate('page.body.landing.footer.status')}</Link>
                            </div>
                        </div>
                        <div className="pg-footer__footer__wrap__social">
                            <div className="pg-footer__footer__wrap__social__row">                            
                                <a rel="noopener noreferrer" target="_blank" href="https://discord.gg/uTUXr43">
                                    <img src={DiscordIcon} alt="Discord" />
                                </a>                                
                                <a rel="noopener noreferrer" target="_blank" href="https://t.me/joinchat/KBGO3QwuMu-QTJKgPQjHmg">
                                    <img src={TelegramIcon} alt="Telegram" />
                                </a>
                                <a rel="noopener noreferrer" target="_blank" href="https://twitter.com/Runebase_Tweet">
                                    <img src={TwitterIcon} alt="Twitter" />
                                </a>
                            </div>
                            {/* 
                            <div className="pg-footer__footer__wrap__social__row">
                                <img src={FacebookIcon} alt="Facebook" />
                                <img src={MediumIcon} alt="MediumIcon" />
                                <img src={CoinMarketIcon} alt="CoinMarket" />
                            </div> 
                            */}
                        </div>
                    </div>                    
                    {/* 
                        <span className="pg-footer__footer__rights"><a href="https://www.openware.com">openware.com</a></span> 
                    */}
                </div>
            </React.Fragment>
        );
    }
    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

// tslint:disable-next-line:no-any
const Footer = withRouter(injectIntl(FooterComponent as any)) as any;

export {
    Footer,
};
