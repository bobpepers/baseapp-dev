import { Metrics } from '../../modules';

const dateToMetricsDate = (date: Date): string => {
    return new Date(date).toISOString().split('T')[0];
};

const dateToChartDate = (date: string): string => {
    const d = new Date(date).toISOString().split('T')[0].split('-');

    return `${d[2]}/${d[1]}`;
};

interface ChartData {
    name: string;
    signups: number;
    sucessful_logins: number;
    failed_logins: number;
}

export const metricsToChartData = (metrics: Metrics, endDate: Date = new Date()): ChartData[] => {
    const week: string[] = [];
    for (let i = 0; i < 7; i++) {
        const d = new Date(endDate);
        d.setDate(d.getDate() - i);
        week.unshift(dateToMetricsDate(d));
    }
    const res: ChartData[] = [];
    for (let i = 0; i < 7; i++) {
        res.push({
            name: dateToChartDate(week[i]),
            signups: metrics.signups[week[i]] || 0,
            sucessful_logins: metrics.sucessful_logins[week[i]] || 0,
            failed_logins: metrics.failed_logins[week[i]] || 0,
        });
    }

    return res;
};
