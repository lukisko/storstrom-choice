"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
//import groupMask from './groupMask';
//import Board from './interactiveBoard';
//import WearHat from "./wearHat";
const multipleChoice_1 = __importDefault(require("./multipleChoice")); //when set to 16 0 -4
class LearningWorld {
    //private wearHat: WearHat;
    //////////////-------------------------------------------------note: make the magnetic field a little into board
    constructor(context) {
        this.context = context;
        this.usersTrack = [];
        this.assets = new MRE.AssetContainer(this.context);
        //this.starSystem = new groupMask(this.context, this.assets, this.usersTrack);
        /*this.wearHat = new WearHat(this.context, this.assets,
            { x: 0, y: 0, z: -3 }, { x: 0, y: 0, z: 0, w: 1 }, this.usersTrack);*/
        this.context.onStarted(() => {
            this.started();
            //this.starSystem.start();
        });
        /*
        this.context.onUserLeft((user) => {
            this.starSystem.userLeft(user);
        });*/
        const multipleChoiceProp = {
            numberOfOptions: 5,
            //correctAnswer: 5,
            padding: 0.2,
            columns: 2,
            height: 0.17,
            width: 0.5,
            rowHeight: 0.49
        };
        const choice = new multipleChoice_1.default(this.context, this.assets, { x: 0, y: 1, z: 1 }, multipleChoiceProp);
        this.context.onUserJoined((user) => {
            try {
                choice.remakeButtons(user);
            }
            catch (err) {
                //do nothing
            }
        });
        //this.board = new Board(this.context, this.assets, { x: 0, y: 0, z: 0 });
    }
    started() {
        //console.log("everithing has started--------------");
        /*const textureFromWeb = await this.assets.createTexture("web texture",{
            uri:"https://upload.wikimedia.org/wikipedia/commons/3/31/Wiki_logo_Nupedia.jpg"
        });
        let somethign = MRE.Actor.CreatePrimitive(this.assets,{
            definition:{
                shape:MRE.PrimitiveShape.Box,
            },
            addCollider: true,
            actor:{
                transform:{local:{position:{x:0,y:2.5,z:0}}},
            }
        });*/
        //this.board.createIt2();
        //this.starSystem.start();
        //console.log("hat is going to be created!");
        /*let test = MRE.Actor.CreateFromGltf(this.assets,{
            uri:'napoleonHat.gltf',
            colliderType:"mesh",
            actor:{
                transform:{app:{position:{x:0,y:5,z:0}}}
            }
        });*/
        //console.log(test.id);
        /*MRE.Actor.CreateFromLibrary(this.context, {
            resourceId: "1695891900889825873",
            actor: {
                transform: { local: { position: { x: 0, y: 2, z: 0 } } }
            }
        });*/
    }
}
exports.default = LearningWorld;
//# sourceMappingURL=app.js.map