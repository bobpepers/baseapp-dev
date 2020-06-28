import {
    createStyles,
    Paper,
    Theme,
    withStyles,
    WithStyles,
} from '@material-ui/core';
import * as React from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
} from 'react-redux';
import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';
import { metricsToChartData } from '../../../helpers';
import {
    RootState,
    Metrics,
    metricsFetch,
    selectMetrics,
} from '../../../modules';

interface DispatchProps {
    fetchMetrics: typeof metricsFetch;
}

const styles = (theme: Theme) => createStyles({
    main: {
        display: 'flex',
        justifyContent: 'space-between',
        fontFamily: 'Open Sans',
        fontStyle: 'normal',
        fontWeight: 500,
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        width: '23%',
        minHeight: '100px',
        padding: '20px',
    },
    heading: {
        fontSize: '14px',
        lineHeight: '24px',
        letterSpacing: '0.1px',
        color: '#6E6E6E',
        marginBottom: '5px',
    },
    counter: {
        fontSize: '20px',
        lineHeight: '20px',
        letterSpacing: '0.0015em',
        color: '#309CEA',
    },
    counterRed: {
        fontSize: '20px',
        lineHeight: '20px',
        letterSpacing: '0.0015em',
        color: '#E23328',
    },
    activity: {
        display: 'flex',
        fontFamily: 'Open Sans',
        minHeight: '300px',
        padding: '5px',
        marginTop: '2%',
        flexDirection: 'column',
    },
    activityHeading: {
        fontWeight: 'normal',
        padding: '15px',
        fontSize: '20px',
        lineHeight: '28px',
        letterSpacing: '0.15px',
        color: 'rgba(0, 0, 0, 0.87)',
    },
});

interface StyleProps extends WithStyles<typeof styles> {
    theme: Theme;
}

type Props = DispatchProps & StyleProps & ReduxProps;

interface ReduxProps {
    metrics: Metrics;
}

class Dashboard extends React.Component<Props, object> {
    public componentDidMount(): void {
        this.props.fetchMetrics();
    }

    public render() {
        const {classes, metrics} = this.props;
        console.log(JSON.stringify(metrics));
        console.log(JSON.stringify(metrics.signups));
        const data = metricsToChartData(metrics);

        return (
            <React.Fragment>
                <div className={classes.main}>
                    <Paper className={classes.paper}>
                        <div className={classes.heading}>New Signup</div>
                        <div className={classes.counter}>{data[data.length - 1].signups.toLocaleString()}</div>
                    </Paper>
                    <Paper className={classes.paper}>
                        <div className={classes.heading}>Login last 24h</div>
                        <div className={classes.counter}>{data[data.length - 1].sucessful_logins.toLocaleString()}</div>
                    </Paper>
                    <Paper className={classes.paper}>
                        <div className={classes.heading}>Failed Login</div>
                        <div className={classes.counterRed}>{data[data.length - 1].failed_logins.toLocaleString()}</div>
                    </Paper>
                    <Paper className={classes.paper}>
                        <div className={classes.heading}>Pending Applications</div>
                        <div className={classes.counter}>{metrics.pending_applications.toLocaleString()}</div>
                    </Paper>
                </div>

                <Paper className={classes.activity}>
                    <div className={classes.activityHeading}>Last 7 days user activity</div>

                    <ResponsiveContainer width="99%" height={300}>
                        <LineChart
                            data={data}
                            margin={{
                                top: 15, right: 0, left: 20, bottom: 10,
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="name"/>
                            <YAxis orientation="right"/>
                            <Tooltip/>
                            <Legend align={'left'}/>
                            <Line type="monotone" dataKey="signups" name="NEW SIGNUPS" stroke="#2076D2"/>
                            <Line type="monotone" dataKey="sucessful_logins" name="LOGINS" stroke="#43A047"/>
                            <Line type="monotone" dataKey="failed_logins" name="FAILED LOGINS" stroke="#DD503D"/>
                        </LineChart>
                    </ResponsiveContainer>
                </Paper>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    metrics: selectMetrics(state),
});

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> = dispatch => ({
    fetchMetrics: () => dispatch(metricsFetch()),
});

export const DashboardScreen = withStyles(styles, {withTheme: true})(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
