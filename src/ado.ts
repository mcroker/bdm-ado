import { getClient as getWiTClient } from "TFS/WorkItemTracking/RestClient";
import { WorkItemErrorPolicy, WorkItemExpand } from 'TFS/WorkItemTracking/Contracts';
import { WorkItem, StatesSummary, StateSummary, toState, StatusSnapshot } from "./types";

import { strDate, batchArray } from "./utils";

export function sumarizeWorkItemSet(statusDate: Date, workitems: WorkItem[]): StatusSnapshot {
    const status = workitems.reduce((results, item) => {
        const result: StateSummary = results[item.state] || { count: 0, storyPoints: 0 };
        result.count = result.count += 1;
        result.storyPoints = result.storyPoints += isNaN(item.storyPoints) ? 0 : item.storyPoints;
        results[item.state] = result;
        return results;
    }, {} as StatesSummary);
    return {
        statusDate,
        status
    }
}

export async function getStatusSnapshotForDates(dates: Date[]): Promise<StatusSnapshot[]> {
    return await Promise.all(
        dates.map(async dt => sumarizeWorkItemSet(dt, await getWorkItems(dt)))
    );
}

export function getWorkItemsForDates(dates: Date[]): Promise<WorkItem[][]> {
    return Promise.all(dates.map(dt => getWorkItems(dt)));
}

export async function getWorkItems(asOf?: Date): Promise<WorkItem[]> {
    try {
        const witClient = getWiTClient();
        // Query the project to retreive the Id field for all workitems
        const ASOF = (asOf) ? ` ASOF '${strDate(asOf)}'` : '';
        // const queryResult = await witClient.queryByWiql({ query: `select [System.Id] From WorkItems where [System.workItemType] = 'Hybrid Story' ${ASOF}` });
        const queryResult = await witClient.queryByWiql({ query: `select [System.Id] From WorkItems where [System.workItemType] = 'Product Backlog Item' ${ASOF}` });
        const workItemIds = queryResult.workItems.map(item => item.id);

        // Map this into an array of number
        const batchedWorkItems = batchArray(workItemIds, 200);

        const workItems: WorkItem[] = [];
        await Promise.all(batchedWorkItems.map(async ids => {
            workItems.push(...await getWorkItemsBatch(ids, asOf));
        }));
        return workItems;
    } catch (e) {
        console.error(e);
    }
}

async function getWorkItemsBatch(ids: number[], asOf?: Date): Promise<WorkItem[]> {
    const witClient = getWiTClient();
    try {

        const items = await witClient.getWorkItems(
            ids,
            undefined,
            asOf,
            WorkItemExpand.All,
            WorkItemErrorPolicy.Omit
        );
        return items.filter(item => item).map(item => ({
            id: item.id,
            rev: item.rev,
            state: toState(item.fields['System.State']),
            title: item.fields['System.Title'],
            url: item.url,
            storyPoints: item.fields['Microsoft.VSTS.Scheduling.StoryPoints'],
            boardColumn: item.fields['System.BoardColumn'],
            boardColumnDone: item.fields['System.BoardColumnDone'],
            StateChangeDate: item.fields['Microsoft.VSTS.Common.StateChangeDate'],
            areaPath: item.fields['System.AreaPath'],
            teamProject: item.fields['System.TeamProject'],
            nodeName: item.fields['System.NodeName'],
            areaLevel1: item.fields['System.AreaLevel1'],
            areaLevel2: item.fields['System.AreaLevel2'],
            areaLevel3: item.fields['System.AreaLevel3'],
            authorizedDate: item.fields['System.AuthorizedDate'],
            revisedDate: item.fields['System.RevisedDate'],
            iterationpath: item.fields['System.IterationPath'],
            iterationLevel1: item.fields['System.IterationLevel1'],
            workItemType: item.fields['System.WorkItemType'],
            reason: item.fields['System.Reason'],
            createdDate: item.fields['System.CreatedDate'],
            changedDate: item.fields['System.ChangedDate'],
            businessBoardColumn: item.fields['WEF_76EA049BBA4140FEA4D87B5A9F33458C_Kanban.Column'],
            businessColumnDone: item.fields['WEF_76EA049BBA4140FEA4D87B5A9F33458C_Kanban.Column.Done'],
            businessLane: item.fields['WEF_76EA049BBA4140FEA4D87B5A9F33458C_Kanban.Lane'],
            devBoardColumn: item.fields['WEF_B16E2796978A433587ED3C652FE9C636_Kanban.Column'],
            devColumnDone: item.fields['WEF_B16E2796978A433587ED3C652FE9C636_Kanban.Column.Done']
        }))
    } catch (e) {
        console.error(e);
    }
}

