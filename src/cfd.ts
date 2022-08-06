import { WorkItemTrackingHttpClient, getClient } from "TFS/WorkItemTracking/RestClient";
import { CoreNamedWebSessionTokenIds } from "VSS/Authentication/Services";
import { getStatusSnapshotForDates } from "./ado";
import { statusDates } from "./dates";
import { State, StatusSnapshot, toState } from "./types";
import { strDate } from "./utils";

interface SeriesData {
    name: string;
    data: number[];
    color?: string;
}

interface ChartSeries {
    series: SeriesData[];
    labels: string[];
}

function statusSnapshotToChartData(snapshot: StatusSnapshot[], states: State[] = Object.values(State)): ChartSeries {
    return {
        series: states.map(state => ({
            name: state,
            // data: snapshot.map(s => ((s.status[state]) ? (s.status[state].storyPoints) : 0))
            data: snapshot.map(s => ((s.status[state]) ? (s.status[state].count) : 0))
        })),
        labels: snapshot.map(s => strDate(s.statusDate))
    };
}

VSS.require([
    "TFS/Dashboards/WidgetHelpers",
    "Charts/Services"
],
    function (WidgetHelpers, Services) {
        WidgetHelpers.IncludeWidgetStyles();
        VSS.register("BDM.CumulativeFlowDiagram", function () {
            return {
                load: async function () {
                    const chartService = await Services.ChartsService.getService();
                    const snapshot = await getStatusSnapshotForDates(statusDates(5, new Date('2022-07-01')));
                    const chartData = statusSnapshotToChartData(snapshot);
                    const $container = $('#Chart-Container');
                    const chartOptions = {
                        "hostOptions": {
                            "height": "290",
                            "width": "300"
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
        });
        VSS.notifyLoadSucceeded();
    }
);