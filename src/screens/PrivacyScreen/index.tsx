import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteProps, withRouter } from 'react-router-dom';
import {
    RootState,
    selectUserLoggedIn,
} from '../../modules';

interface ReduxProps {
    isLoggedIn: boolean;
}

type Props = ReduxProps & RouteProps & InjectedIntlProps;

class Privacy extends React.Component<Props> {
    public renderPrivacyBlock() {
        return (
            <div className="pg-landing-screen__privacy-info">
                <div className="pg-privacy-screen__wrap">
                    <h1>{this.translate('page.body.privacy.header')}</h1>
                    <h6>{this.translate('page.body.privacy.last.edit')}</h6>
                    <p>{this.translate('page.body.privacy.body.1')}</p>
                    <p>{this.translate('page.body.privacy.body.2')}</p>
                    <p>{this.translate('page.body.privacy.body.3')}</p>

                    <h2>{this.translate('page.body.privacy.scope.header')}</h2>
                    <ul>
                        <li>{this.translate('page.body.privacy.scope.list.1')}</li>
                        <li>{this.translate('page.body.privacy.scope.list.2')}</li>
                        <li>{this.translate('page.body.privacy.scope.list.3')}</li>
                    </ul>

                    <h2>{this.translate('page.body.privacy.definitions.header')}</h2>
                    <p>{this.translate('page.body.privacy.definitions.body.1')}</p>
                    <ul>
                        <li>{this.translate('page.body.privacy.definitions.list.1')}</li>
                        <li>{this.translate('page.body.privacy.definitions.list.2')}</li>
                        <li>{this.translate('page.body.privacy.definitions.list.3')}</li>
                    </ul>

                    <h2>{this.translate('page.body.privacy.protection.header')}</h2>
                    <ul>
                        <li>{this.translate('page.body.privacy.protection.list.1')}</li>
                        <li>{this.translate('page.body.privacy.protection.list.2')}</li>
                    </ul>

                    <h2>{this.translate('page.body.privacy.usage.header')}</h2>
                    <p>{this.translate('page.body.privacy.usage.body.1')}</p>
                    <p>{this.translate('page.body.privacy.usage.body.2')}</p>
                    <ul>
                        <li>{this.translate('page.body.privacy.usage.list.1')}</li>
                        <li>{this.translate('page.body.privacy.usage.list.2')}</li>
                        <li>{this.translate('page.body.privacy.usage.list.3')}</li>
                        <li>{this.translate('page.body.privacy.usage.list.4')}</li>
                        <li>{this.translate('page.body.privacy.usage.list.5')}</li>
                        <li>{this.translate('page.body.privacy.usage.list.6')}</li>
                    </ul>

                    <h2>{this.translate('page.body.privacy.disclosure.header')}</h2>
                    <p>{this.translate('page.body.privacy.disclosure.body.1')}</p>
                    <ul>
                        <li>{this.translate('page.body.privacy.disclosure.list.1')}</li>
                        <li>{this.translate('page.body.privacy.disclosure.list.2')}</li>
                        <li>{this.translate('page.body.privacy.disclosure.list.3')}</li>
                        <li>{this.translate('page.body.privacy.disclosure.list.4')}</li>
                        <li>{this.translate('page.body.privacy.disclosure.list.5')}</li>
                        <li>{this.translate('page.body.privacy.disclosure.list.6')}</li>
                    </ul>
                    <p>{this.translate('page.body.privacy.disclosure.body.2')}</p>

                    <h2>{this.translate('page.body.privacy.storage.header')}</h2>
                    <p>{this.translate('page.body.privacy.storage.body.1')}</p>

                    <h2>{this.translate('page.body.privacy.cookies.header')}</h2>
                    <p>{this.translate('page.body.privacy.cookies.body.1')}</p>
                    <p>{this.translate('page.body.privacy.cookies.body.2')}</p>

                    <h2>{this.translate('page.body.privacy.fraud.header')}</h2>
                    <p>{this.translate('page.body.privacy.fraud.body.1')}</p>
                    <p>{this.translate('page.body.privacy.fraud.body.2')}</p>

                    <h2>{this.translate('page.body.privacy.contact.header')}</h2>
                    <p>{this.translate('page.body.privacy.contact.body.1')}</p>
                </div>
            </div>
        );
    }

    public render() {
        return (
            <div className="pg-landing-screen">
                {this.renderPrivacyBlock()}
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
});

// tslint:disable no-any
export const PrivacyScreen = withRouter(injectIntl(connect(mapStateToProps, null)(Privacy) as any));
