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
    private isClosed;
    private correctAnswer;
    private usersAnswered;
    private correct;
    private tickPrefab;
    private XPrefab;
    private answersFromUsers;
    constructor(context: MRE.Context, assets: MRE.AssetContainer, centerPosition: MRE.Vector3Like, prop: MultipleChoiceProp, centerRotation?: MRE.QuaternionLike);
    private createQuestions;
    private formatText;
    private creatIt;
    private answeredCorrectly;
    private answeredWrong;
}
//# sourceMappingURL=multipleChoice.d.ts.map