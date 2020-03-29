import * as React from 'react';
import { connect } from 'react-redux';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import { RouteProps, withRouter } from 'react-router-dom';
import axios from 'axios';
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import { Progress } from 'reactstrap';
import { setDocumentTitle } from '../../helpers';
import {
    RootState,
    selectUserLoggedIn,
} from '../../modules';


interface ReduxProps {
    isLoggedIn: boolean;
}

type Props = ReduxProps & RouteProps & InjectedIntlProps;

class Voting extends React.Component<Props> {
    public state = {
        isLoading: true,
        items: [],
        error: null,
    };

    public componentDidMount() {
      setDocumentTitle('Voting');
      this.getItems();
    }

    public getItems() {
        axios.get('https://voting.runebase.io/').then(response =>
            response.data.map(item => ({
                name: `${item.name}`,
                ticker: `${item.ticker}`,
                votingAddress: `${item.votingAddress}`,
                votes: `${item.votes}`,
                totalVotes: `${item.totalVotes}`,
            })),
        ).then(items => {
            this.setState({
                items,
                isLoading: false,
            });
        }).catch(error => this.setState({ error: 'Voting API Error', isLoading: false }));
    }

    public votingGridItem(item) {
        const normalise = value => (value - 0) * 100 / (item.totalVotes - 0);
        const completed = parseFloat(item.votes) >= parseFloat(item.totalVotes);
        return (
            <Grid item xs={12} sm={12} md={6} lg={4} xl={3} key={item.ticker}>
                <img className="coinImageVoting" src={`https://downloads.runebase.io/${(item.ticker).toLowerCase()}.svg`} alt={`${item.name}`} />
                <Typography variant="h3">
                  {item.name}
                </Typography>
                <Typography variant="h4">
                  {item.ticker}
                </Typography>
                <Typography variant="body2">
                  <a rel="noopener noreferrer" target="_blank" href={`https://explorer2.runebase.io/address/${item.votingAddress}`}>{item.votingAddress}</a>
                </Typography>
                <div className="progress-bar-wrapper">
                    <Progress animated bar color="info" value={normalise(item.votes)} />
                    {!completed ?
                        <Typography variant="body2" className="votePercentage">
                            {normalise(item.votes)}%
                        </Typography>
                    :
                        <Typography variant="body2" className="votePercentage">
                            Completed
                        </Typography>
                    }
                </div>
                {!completed ?
                    <Typography variant="body2">{item.votes} / {item.totalVotes}</Typography>
                    :
                    <Typography variant="body2">Completed</Typography>
                }
            </Grid>
        );
    }

    public render() {
        const { isLoading, items, error } = this.state;
        return (
            <Grid container spacing={3} className="text-center wrapper-container">
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography variant="h4">
                        {this.translate('page.body.voting.description')}
                    </Typography>
                    {/*
                    <Typography variant="body1">
                        <span className='voting-exception-color'>{this.translate('page.body.voting.warning')}:</span> {this.translate('page.body.voting.warning.description')}.
                    </Typography>
                    */}
                </Grid>
                {error ? <Typography variant="h4" className="voting-loading-error">{error}</Typography> : null}
                {!isLoading ? items.map(item => this.votingGridItem(item)) : <CircularProgress disableShrink className="voting-loading" />}
            </Grid>
        );
    }

    private translate = (key: string) => this.props.intl.formatMessage({id: key});
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    isLoggedIn: selectUserLoggedIn(state),
});

// tslint:disable no-any
export const VotingScreen = withRouter(injectIntl(connect(mapStateToProps, null)(Voting) as any));
