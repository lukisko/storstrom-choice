import * as MRE from '@microsoft/mixed-reality-extension-sdk';
export declare type userTrack = {
    user: MRE.User;
    hat: MRE.Actor;
    stars: MRE.Actor[];
};
export default class LearningWorld {
    private context;
    private assets;
    private usersTrack;
    constructor(context: MRE.Context);
    private started;
}
//# sourceMappingURL=app.d.ts.map