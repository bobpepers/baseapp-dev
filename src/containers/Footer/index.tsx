import React, { Component, Fragment } from 'react';
import { RouterProps } from 'react-router';
import { withRouter, Link } from 'react-router-dom';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { Grid } from '@material-ui/core';
import CookieConsent from 'react-cookie-consent';

const TelegramIcon = require('../../assets/images/social/Telegram.svg');
const TwitterIcon = require('../../assets/images/social/Twitter.svg');
const DiscordIcon = require('../../assets/images/social/Discord.svg');

// const FacebookIcon = require('../../assets/images/landing/social/Facebook.svg');
// const MediumIcon = require('../../assets/images/landing/social/Medium.svg');
// const CoinMarketIcon = require('../../assets/images/landing/social/CoinMarket.svg');

type Props = RouterProps & InjectedIntlProps;

class FooterComponent extends Component<Props> {
    public render() {
        if (this.props.history.location.pathname.startsWith('/confirm')) {
            return <Fragment />;
        }

        return (
            <Fragment>
                <Grid container className="footer wrapper-container">
                    <Grid item xs={12} sm={4} md={3} lg={3} xl={3} className="footer-col mt-16 mb-16">
                        <Link to="/trading/">{this.translate('page.body.landing.footer.exchange')}</Link>
                        <Link to="/wallets">{this.translate('page.body.landing.footer.wallets')}</Link>
                        <Link to="/fees">{this.translate('page.body.landing.footer.fees')}</Link>
                        <Link to="/docs-api">API</Link>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3} lg={3} xl={3} className="footer-col mt-16 mb-16">
                        <a rel="noopener noreferrer" target="_blank" href="https://runesx.freshdesk.com/support/home">{this.translate('page.body.landing.footer.support')}</a>
                        <Link to="/privacy">{this.translate('page.body.landing.footer.privacy')}</Link>
                        <Link to="/terms">{this.translate('page.body.landing.footer.terms')}</Link>
                        <a rel="noopener noreferrer" target="_blank" href="https://www.openware.com">{this.translate('page.body.landing.footer.attribution')}</a>
                    </Grid>
                    <Grid item xs={12} sm={4} md={3} lg={3} xl={3} className="footer-col mt-16 mb-16">
                        <a rel="noopener noreferrer" target="_blank" href="https://www.runebase.io">{this.translate('page.body.landing.footer.about')}</a>
                        <a rel="noopener noreferrer" target="_blank" href="https://forms.gle/itdoPqSbhuYRTame9">{this.translate('page.body.landing.footer.listing')}</a>
                        <Link to="/vote">{this.translate('page.body.landing.footer.voting')}</Link>
                        <Link to="/status">{this.translate('page.body.landing.footer.status')}</Link>
                    </Grid>
                    <Grid item xs={12} sm={12} md={3} lg={3} xl={3} className="footer-col-social mt-16 mb-16">
                        <div className="footer-col-social-row">
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
                            <div className="footer-col-social-row">
                                <img src={FacebookIcon} alt="Facebook" />
                                <img src={MediumIcon} alt="MediumIcon" />
                                <img src={CoinMarketIcon} alt="CoinMarket" />
                            </div>
                        */}
                    </Grid>
                </Grid>
                <CookieConsent>
                    {this.translate('page.body.footer.cookies')}
                </CookieConsent>
            </Fragment>
        );
    }
    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

// tslint:disable-next-line:no-any
const Footer = withRouter(injectIntl(FooterComponent as any)) as any;

export {
    Footer,
};
