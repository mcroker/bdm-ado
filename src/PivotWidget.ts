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

export class PivotWidget {

    static register(id: string) {
        try {
            WidgetHelpers.IncludeWidgetStyles();
            VSS.register(id, function (contextData?: any) {
                return new PivotWidget();
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
        var $container = $('#Chart-Container');
        var chartOptions = {
            "hostOptions": {
                "height": 290,
                "width": 300
            },
            "chartType": "table",
            "xAxis": {
                "labelValues": ["Design", "In Progress", "Resolved", "Total"]
            },
            "yAxis": {
                "labelValues": ["P1", "P2", "P3", "Total"]
            },
            "series": [
                {
                    "name": "Design",
                    "data": [
                        [0, 0, 1],
                        [0, 1, 2],
                        [0, 2, 3]
                    ]
                },
                {
                    "name": "In Progress",
                    "data": [
                        [1, 0, 4],
                        [1, 1, 5],
                        [1, 2, 6]
                    ]
                },
                {
                    "name": "Resolved",
                    "data": [
                        [2, 0, 7],
                        [2, 1, 8],
                        [2, 2, 9]
                    ]
                },
                {
                    "name": "Total",
                    "data": [
                        [3, 0, 12],
                        [3, 1, 15],
                        [3, 2, 18],
                        [0, 3, 6],
                        [1, 3, 15],
                        [2, 3, 24],
                        [3, 3, 10]
                    ],
                    "color": "rgba(255,255,255,0)"
                }
            ]
        }

        chartService.createChart($container, chartOptions);
        return WidgetHelpers.WidgetStatusHelper.Success();

    }

}


PivotWidget.register('BDM.CumulativeFlowDiagram');


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
