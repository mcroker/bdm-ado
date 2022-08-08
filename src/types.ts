export enum PBIState {
    new = 'new',
    approved = 'approved',
    committed = 'comitted',
    done = 'done',
    removed = 'removed'
}

export function toState(x: string): PBIState {
    switch (x) {
        case 'New': return PBIState.new;
        case 'Approved': return PBIState.approved;
        case 'Committed': return PBIState.committed;
        case 'Done': return PBIState.done;
        case 'Removed': return PBIState.removed;
        default: console.error('Not found :', x); return undefined;
    }
}

export interface StateSummary {
    count: number,
    storyPoints: number
}

export interface StatusSnapshot {
    statusDate: Date,
    status: StatesSummary
}

export type StatesSummary = { [key: string]: StateSummary };

export interface WorkItem<STATE> {
    id: number;
    rev: number;
    state: STATE;
    title: string;
    url: string;
    storyPoints: number; // Microsoft.VSTS.Scheduling.StoryPoints
    boardColumn: string; // "System.BoardColumn": "New",
    boardColumnDone: boolean; // "System.BoardColumnDone": false,
    StateChangeDate: string; // "Microsoft.VSTS.Common.StateChangeDate": "2021-11-18T14:34:06.54Z",
    areaPath: string; // "System.AreaPath": "BDC\\OAS (roll up)\\Business",
    teamProject: string // "System.TeamProject": "BDC",
    nodeName: string; // "System.NodeName": "Business",
    areaLevel1: string; // "System.AreaLevel1": "BDC",
    areaLevel2: string; // "System.AreaLevel2": "OAS (roll up)",
    areaLevel3: string; // "System.AreaLevel3": "Business",
    authorizedDate: string; // "System.AuthorizedDate": "2022-07-15T16:10:36.237Z",
    revisedDate: string; // "System.RevisedDate": "9999-01-01T00:00:00Z",
    iterationpath: string; // "System.IterationPath": "BDC",
    iterationLevel1: string; // "System.IterationLevel1": "BDC",
    workItemType: string; // "System.WorkItemType": "Hybrid Story",
    reason: string; // "System.Reason": "New",
    createdDate: string; // "System.CreatedDate": "2021-11-18T14:34:06.54Z",
    changedDate: string; // "System.ChangedDate": "2022-07-15T16:10:36.237Z",
}
