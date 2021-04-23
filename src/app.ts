import * as MRE from '@microsoft/mixed-reality-extension-sdk';
//import groupMask from './groupMask';
//import Board from './interactiveBoard';
//import WearHat from "./wearHat";
import MultipleChoice, { MultipleChoiceProp } from './multipleChoice'; //when set to 16 0 -4

export type userTrack = {
	user: MRE.User;
	hat: MRE.Actor;
	stars: MRE.Actor[];
}

export default class LearningWorld {
	private assets: MRE.AssetContainer;
	//private board: Board;
	//private starSystem: groupMask;
	private usersTrack: userTrack[];
	//private wearHat: WearHat;
	//////////////-------------------------------------------------note: make the magnetic field a little into board

	constructor(private context: MRE.Context) {
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
		const multipleChoiceProp: MultipleChoiceProp = {
			numberOfOptions: 5,
			//correctAnswer: 5,
			padding: 0.2,
			columns: 2,
			height: 0.17,
			width: 0.5,
			rowHeight: 0.49
		}
		const choice = new MultipleChoice(this.context, this.assets,
			{ x: 0, y: 1, z: 1 }, multipleChoiceProp);
		this.context.onUserJoined((user) => {
			try {
				choice.remakeButtons(user);
			} catch (err) {
				//do nothing
			}

		});
		//this.board = new Board(this.context, this.assets, { x: 0, y: 0, z: 0 });

	}

	private started() {

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
