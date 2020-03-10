import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteProps, withRouter } from 'react-router-dom';
import SwaggerUI from 'swagger-ui';
import "swagger-ui/dist/swagger-ui.css";

import {
    RootState,
    selectUserLoggedIn,
} from '../../modules';

interface ReduxProps {
    isLoggedIn: boolean;
}

type Props = ReduxProps & RouteProps & InjectedIntlProps;

class Api extends React.Component<Props> {
    public componentDidMount() {
        SwaggerUI({
        dom_id: '#swagger-container',
        url: "https://downloads.runebase.io/swagger.json",
        })
    }

    public render() {
        return (
            <div className="pg-landing-screen">  
                <div id='swagger-container' />             
            </div>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
});

// tslint:disable no-any
export const ApiScreen = withRouter(injectIntl(connect(mapStateToProps, null)(Api) as any));
