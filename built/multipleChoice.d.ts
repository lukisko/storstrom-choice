import * as MRE from '@microsoft/mixed-reality-extension-sdk';
export declare type MultipleChoiceProp = {
    numberOfOptions: number;
    padding: number;
    columns: number;
    height: number;
    width: number;
    rowHeight: number;
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
    private buttonStart;
    private participants;
    private isClosed;
    private correctAnswer;
    private usersAnswered;
    private correct;
    private tickPrefab;
    private XPrefab;
    private answersFromUsers;
    private questionActors;
    private answerActors;
    private answerFunction;
    private globalProp;
    private nextPropG;
    constructor(context: MRE.Context, assets: MRE.AssetContainer, centerPosition: MRE.Vector3Like, prop: MultipleChoiceProp, centerRotation?: MRE.QuaternionLike);
    private createQuestions;
    private formatText;
    private creatIt;
    remakeButtons(user1: MRE.User): void;
    private handleQuestionButton;
    private handleAnswerButton;
    private answeredCorrectly;
    private answeredWrong;
    private startAssignmentButton;
    private startAssignmentAction;
}
//# sourceMappingURL=multipleChoice.d.ts.map