import { WorkItem } from "./types";

export enum HybridStoryState {
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

export function toHybridStoryState(x: string): HybridStoryState {
    switch (x) {
        case 'New': return HybridStoryState.new;
        case 'Elaborated': return HybridStoryState.elborated;
        case 'Functional Design Approved': return HybridStoryState.fdApproved;
        case 'In Technical Design': return HybridStoryState.inTD;
        case 'Technical Design Completed': return HybridStoryState.tdComplete;
        case 'In Development': return HybridStoryState.inDev;
        case 'In Code Review': return HybridStoryState.inCodeReview;
        case 'Ready for Test': return HybridStoryState.readyForTest;
        case 'In Test': return HybridStoryState.inTest;
        case 'Closed': return HybridStoryState.closed;
        case 'Removed': return HybridStoryState.removed;
        case 'Blocked': return HybridStoryState.blocked;
        default: console.error('Not found :', x); return undefined;
    }
}

export interface HybridStory extends WorkItem<HybridStoryState> {
    workItemType: 'Hybrid Story';
    businessBoardColumn: string; // "WEF_76EA049BBA4140FEA4D87B5A9F33458C_Kanban.Column": "01-Work in Progress",
    businessColumnDone: boolean; //  "WEF_76EA049BBA4140FEA4D87B5A9F33458C_Kanban.Column.Done": false,
    businessLane: string; // "WEF_76EA049BBA4140FEA4D87B5A9F33458C_Kanban.Lane": "Pod 5 – Interfaces (Lead: )",
    devBoardColumn: string; // "WEF_B16E2796978A433587ED3C652FE9C636_Kanban.Column": "In Technical Design",
    devColumnDone: boolean; // "WEF_B16E2796978A433587ED3C652FE9C636_Kanban.Column.Done": false,
}