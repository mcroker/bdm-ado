
export enum BDMState {
    new = 'new',
    elborated = 'elborated',
    fdApproved = 'fdApproved',
    inTD = 'inTD',
    tdComplete = 'tdComplete',
    inDev = 'inDev',
    inCodeReview = 'inCodeReview',
    readyForTest = 'readyForTest',
    inTest = 'inTest',
    closed = 'closed',
    removed = 'removed',
    blocked = 'blocked'
}

export enum State {
    new = 'new',
    approved = 'approved',
    committed = 'comitted',
    done = 'done',
    removed = 'removed'
}

export function toState(x: string): State {
    switch (x) {
        case 'New': return State.new;
        case 'Approved': return State.approved;
        case 'Committed': return State.committed;
        case 'Done': return State.done;
        case 'Removed': return State.removed;
        default: console.error('Not found :', x); return undefined;
    }
}

export function toBDMState(x: string): BDMState {
    switch (x) {
        case 'New': return BDMState.new;
        case 'Elaborated': return BDMState.elborated;
        case 'Functional Design Approved': return BDMState.fdApproved;
        case 'In Technical Design': return BDMState.inTD;
        case 'Technical Design Completed': return BDMState.tdComplete;
        case 'In Development': return BDMState.inDev;
        case 'In Code Review': return BDMState.inCodeReview;
        case 'Ready for Test': return BDMState.readyForTest;
        case 'In Test': return BDMState.inTest;
        case 'Closed': return BDMState.closed;
        case 'Removed': return BDMState.removed;
        case 'Blocked': return BDMState.blocked;
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

export interface WorkItem {
    id: number;
    rev: number;
    state: State;
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
    businessBoardColumn: string; // "WEF_76EA049BBA4140FEA4D87B5A9F33458C_Kanban.Column": "01-Work in Progress",
    businessColumnDone: boolean; //  "WEF_76EA049BBA4140FEA4D87B5A9F33458C_Kanban.Column.Done": false,
    businessLane: string; // "WEF_76EA049BBA4140FEA4D87B5A9F33458C_Kanban.Lane": "Pod 5 – Interfaces (Lead: )",
    devBoardColumn: string; // "WEF_B16E2796978A433587ED3C652FE9C636_Kanban.Column": "In Technical Design",
    devColumnDone: boolean; // "WEF_B16E2796978A433587ED3C652FE9C636_Kanban.Column.Done": false,

}
