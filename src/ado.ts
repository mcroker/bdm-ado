import { getClient as getWiTClient } from "TFS/WorkItemTracking/RestClient";
import { WorkItemErrorPolicy, WorkItemExpand } from 'TFS/WorkItemTracking/Contracts';
import { WorkItem, StatesSummary, StateSummary, toState, PBIState, StatusSnapshot } from "./types";

import { strDate, chunkArray } from "./utils";

import { authTokenManager } from "VSS/Authentication/Services";

type PBI = WorkItem<PBIState>;

export async function sendmail() {
    console.log('bob');
    const witClient = getWiTClient();
    const organization = 'mcroker';
    const project = 'DevOps Demo';
    const sessionToken = await VSS.getAccessToken();
    console.log('st',JSON.stringify(sessionToken));
    const authToken = authTokenManager.getAuthorizationHeader(sessionToken);
    $.ajax({
        type: 'POST',
        url: `https://dev.azure.com/${organization}/${project}/_apis/wit/sendmail?api-version=7.1-preview.1`,
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            message: {
                body: 'Hello World',
                subject: 'My email',
                to: {
                    tfIds: ['657d8df9-bcfa-4fc9-bcbc-18531981e3b5']
                }
            },
            projectId: project
        }),
        beforeSend: function (xhr) {
            xhr.setRequestHeader('Authorization', authToken);
        },
        success: (e) => {
            console.log(e);
        },
        error: (e) => {
            console.error(e);
        }
    });
}

/**
 * Create sumary metrics from an array of WorkItem
 * 
 * Aggreates the storyPoint and WorkItem counts for each state.
 * 
 * @param statusDate The status date for the set (passed back in the object)
 * @param workitems  An array of workitems to be sumarized
 * @returns          A status snapshot for the set
 */
export function sumarizeWorkItemSet<T extends WorkItem<any>>(statusDate: Date, workitems: T[]): StatusSnapshot {
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

/**
 * Retrieves all workitems for each date in the set and creates a status snapshot.
 * 
 * @param dates The dates for which workitems are to be retreived
 * @returns     An array of status snapshots for the dates
 */
export async function getStatusSnapshotForDates(dates: Date[]): Promise<StatusSnapshot[]> {
    return await Promise.all(
        dates.map(async dt => sumarizeWorkItemSet(dt, await getWorkItems(dt)))
    );
}

/**
 * Retrieves and expands all workitems for each date passed in the dates param
 * 
 * @param dates The dates to retrieve
 * @returns     An array of WorkItem for each date (WorkItem[date][])
 */
export function getWorkItemsForDates(dates: Date[]): Promise<PBI[][]> {
    return Promise.all(dates.map(dt => getWorkItems(dt)));
}

/**
 * retrieve all work-items (optionally for a given date)
 * 
 * @param asOf (optional) date asOf which information is to be retrieved
 * @returns    Array of WorkItems
 */
export async function getWorkItems(asOf?: Date): Promise<PBI[]> {
    try {
        const witClient = getWiTClient();
        // Query the project to retreive the Id field for all workitems
        const ASOF = (asOf) ? ` ASOF '${strDate(asOf)}'` : '';
        // const queryResult = await witClient.queryByWiql({ query: `select [System.Id] From WorkItems where [System.workItemType] = 'Hybrid Story' ${ASOF}` });
        const queryResult = await witClient.queryByWiql({ query: `select [System.Id] From WorkItems where [System.workItemType] = 'Product Backlog Item' ${ASOF}` });
        const workItemIds = queryResult.workItems.map(item => item.id);

        // Map this into an array of number
        const batchedWorkItems = chunkArray(workItemIds, 200);

        const workItems: PBI[] = [];
        await Promise.all(batchedWorkItems.map(async ids => {
            workItems.push(...await getWorkItemsBatch(ids, asOf));
        }));
        return workItems;
    } catch (e) {
        console.error(e);
    }
}

/**
 * Retrieve a batch of (200?) WorkItems, calls ADO and maps the response
 * 
 * @param ids  An array of (max 200) WorkItems to retrieve
 * @param asOf (optional) date asOf which information is to be retrieved
 * @returns    An array of expanded WorkItems
 */
async function getWorkItemsBatch(ids: number[], asOf?: Date): Promise<PBI[]> {
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

