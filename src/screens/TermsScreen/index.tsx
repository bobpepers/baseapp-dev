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

class Terms extends React.Component<Props> {
    public renderTermsBlock() {
        return (
            <div className="pg-landing-screen__privacy-info">
                <div className="pg-privacy-screen__wrap">
                    <h1>{this.translate('page.body.terms.header')}</h1>         
                    <p>{this.translate('page.body.terms.body.1')}</p>
                    <p>{this.translate('page.body.terms.body.2')}</p>
                    <p>{this.translate('page.body.terms.body.3')}</p>
                    <p>{this.translate('page.body.terms.body.4')}</p> 
                    <h2>{this.translate('page.body.terms.accounts.header')}</h2>
                    <p>{this.translate('page.body.terms.accounts.body.1')}</p>
                    <p>{this.translate('page.body.terms.accounts.body.2')}</p>  
                    <p>{this.translate('page.body.terms.accounts.body.3')}</p>  
                    <p>{this.translate('page.body.terms.accounts.body.4')}</p>
                    <h2>{this.translate('page.body.terms.orders.header')}</h2>
                    <p>{this.translate('page.body.terms.orders.body.1')}</p>
                    <p>{this.translate('page.body.terms.orders.body.2')}</p> 
                    <p>{this.translate('page.body.terms.orders.body.3')}</p> 
                    <h2>{this.translate('page.body.terms.cancellations.header')}</h2>  
                    <p>{this.translate('page.body.terms.cancellations.body.1')}</p>
                    <p>{this.translate('page.body.terms.cancellations.body.2')}</p>
                    <p>{this.translate('page.body.terms.cancellations.body.3')}</p>
                    <p>{this.translate('page.body.terms.cancellations.body.4')}</p>   
                    <h2>{this.translate('page.body.terms.fees.header')}</h2>  
                    <p>{this.translate('page.body.terms.fees.body.1')}</p> 
                    <p>{this.translate('page.body.terms.fees.body.2')}</p>
                    <p>{this.translate('page.body.terms.fees.body.3')}</p> 
                    <h2>{this.translate('page.body.terms.links.header')}</h2>  
                    <p>{this.translate('page.body.terms.links.body.1')}</p> 
                    <p>{this.translate('page.body.terms.links.body.2')}</p>
                    <p>{this.translate('page.body.terms.links.body.3')}</p>  
                    <h2>{this.translate('page.body.terms.termination.header')}</h2>  
                    <p>{this.translate('page.body.terms.termination.body.1')}</p> 
                    <p>{this.translate('page.body.terms.termination.body.2')}</p>
                    <p>{this.translate('page.body.terms.termination.body.3')}</p> 
                    <p>{this.translate('page.body.terms.termination.body.4')}</p>
                    <h2>{this.translate('page.body.terms.contact.header')}</h2>  
                    <p>{this.translate('page.body.terms.contact.body.1')}</p>     
                </div>
            </div>
        );
    }

    public render() {
        return (
            <div className="pg-landing-screen">
                {this.renderTermsBlock()}
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
});

// tslint:disable no-any
export const TermsScreen = withRouter(injectIntl(connect(mapStateToProps, null)(Terms) as any));
