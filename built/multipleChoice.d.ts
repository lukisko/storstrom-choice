import * as MRE from '@microsoft/mixed-reality-extension-sdk';
export declare type MultipleChoiceProp = {
    numberOfOptions: number;
    padding: number;
    columns: number;
    height: number;
    width: number;
    rowHeight: number;
};
declare type storedQuestions = {
    [worldId: string]: {
        [sessionId: string]: {
            question: string[];
            answer: number[];
        };
    };
};
export default class MultipleChoice {
    private assets;
    private context;
    private centerPosition;
    private centerRotation;
    private localSpace;
    private readonly groupName;
    private readonly noGroupName;
    private participantMask;
    private notParticipandMask;
    private participants;
    private buttonStart;
    private isClosed;
    private correctAnswer;
    private usersAnswered;
    private correct;
    private tickPrefab;
    private XPrefab;
    private answersFromUsers;
    private prop;
    data: storedQuestions;
    private sessionData;
    private worldId;
    private participantsWithStar;
    constructor(context: MRE.Context, assets: MRE.AssetContainer, centerPosition: MRE.Vector3Like, prop: MultipleChoiceProp, centerRotation?: MRE.QuaternionLike);
    private createQuestions;
    private formatText;
    private creatIt;
    loadData(user: MRE.User): void;
    private answeredCorrectly;
    private answeredWrong;
    userJoined(user: MRE.User): void;
    private startAssignmentButton;
    private startAssignmentAction;
    private attachStarToThese;
    save(): void;
}
export {};
//# sourceMappingURL=multipleChoice.d.ts.map