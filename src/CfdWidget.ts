import { getStatusSnapshotForDates, sendmail } from "./ado";
import { PBIState, StatusSnapshot } from "./types";
import { strDate, statusDates } from "./utils";
import * as  WidgetHelpers from 'TFS/Dashboards/WidgetHelpers';
import * as WidgetContracts from 'TFS/Dashboards/WidgetContracts';
import * as ChartServices from 'Charts/Services';

interface SeriesData {
    name: string;
    data: number[];
    color?: string;
}

interface ChartSeries {
    series: SeriesData[];
    labels: string[];
}

export class CfdWidget {

    static register(id: string) {
        try {
            WidgetHelpers.IncludeWidgetStyles();
            VSS.register(id, function (contextData?: any) {
                return new CfdWidget();
            });
            sendmail();
        } catch (e) {
            console.error(e);
        }
    }

    public load: () => IPromise<WidgetContracts.WidgetStatus> = () => {
        return this.render();
    }

    public reload: () => IPromise<WidgetContracts.WidgetStatus> = () => {
        return this.render();
    }

    private async render(): Promise<WidgetContracts.WidgetStatus> {
        const chartService = await ChartServices.ChartsService.getService();
        const snapshot = await getStatusSnapshotForDates(statusDates(5, new Date('2022-07-01')));
        const chartData = statusSnapshotToChartData(snapshot);
        const $container = $('#Chart-Container');
        const chartOptions = {
            "hostOptions": {
                "height": 290,
                "width": 300
            },
            "chartType": "stackedArea",
            "series": chartData.series,
            "xAxis": {
                "labelFormatMode": "dateTime_DayInMonth",
                "labelValues": chartData.labels
            }
        }
        chartService.createChart($container, chartOptions);
        return WidgetHelpers.WidgetStatusHelper.Success();
    }
}

CfdWidget.register('BDM.CumulativeFlowDiagram');

function statusSnapshotToChartData(snapshot: StatusSnapshot[], states: PBIState[] = Object.values(PBIState)): ChartSeries {
    return {
        series: states.map(state => ({
            name: state,
            // data: snapshot.map(s => ((s.status[state]) ? (s.status[state].storyPoints) : 0))
            data: snapshot.map(s => ((s.status[state]) ? (s.status[state].count) : 0))
        })),
        labels: snapshot.map(s => strDate(s.statusDate))
    };
}
