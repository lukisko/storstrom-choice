import * as MRE from '@microsoft/mixed-reality-extension-sdk';
//import Door from './openingDoor';
//import openingDoor from "./openingDoor";
import fs	 from "fs";
import request from 'request';

export type MultipleChoiceProp = {
	numberOfOptions: number;
	//correctAnswer: number;
	padding: number;
	columns: number;
	height: number;
	width: number;
	rowHeight: number;
}

type storedQuestions = {
	[worldId: string]: {
		[sessionId: string]: {question: string[];answer: number[]};
	};
}

const charPerM = 17;

export default class MultipleChoice {
	private assets: MRE.AssetContainer;
	private context: MRE.Context;
	private centerPosition: MRE.Vector3Like;
	private centerRotation: MRE.QuaternionLike;
	private localSpace: MRE.Actor;

	private readonly groupName = "PARTICIPANT";
	private readonly noGroupName = "NOT-PARTICIPANT";
	private participantMask: MRE.GroupMask;
	private notParticipandMask: MRE.GroupMask;
	private participants: MRE.Guid[];
	private buttonStart: MRE.Actor;
	//private door: openingDoor;
	private isClosed: boolean;
	private correctAnswer: number;
	private usersAnswered: Array<{user: MRE.Guid; number: number}>;
	private correct: number[];
	private tickPrefab: MRE.Asset[];
	private XPrefab: MRE.Asset[];
	private answersFromUsers: MRE.Actor[];
	private prop: MultipleChoiceProp;
	data: storedQuestions;
	private sessionData: {question: string[]; answer: number[]};

	private worldId: string;
	private participantsWithStar: MRE.Guid[];
	//private usersAnsweredGlobal: MRE.Guid[][];

	constructor(context: MRE.Context, assets: MRE.AssetContainer,
		centerPosition: MRE.Vector3Like,
		prop: MultipleChoiceProp, centerRotation: MRE.QuaternionLike = { x: 0, y: 0, z: 0, w: 1 },) {
		this.context = context;
		this.assets = assets;
		this.centerPosition = centerPosition;
		this.centerRotation = centerRotation;
		this.usersAnswered = [];
		//this.usersAnsweredGlobal = [[],[],[],[],[],[]];
		this.isClosed = true;

		this.participants = [];
		this.participantsWithStar = [];

		this.participantMask = new MRE.GroupMask(context,[this.groupName]);
		this.notParticipandMask = new MRE.GroupMask(context,[this.noGroupName]);
		
		this.answersFromUsers = [null,null,null,null,null,null];
		//this.creatIt(prop);
		this.prop = prop;
		//console.log("-1");
		this.startAssignmentButton({x:0,y:2,z:0});
		//this.createQuestions(questions,this.correct,prop);
		
	}

	private async createQuestions(questions: string[], correct: number[], prop: MultipleChoiceProp){
		//console.log("0");
		this.tickPrefab = await this.assets.loadGltf("tick.gltf","mesh");
		//console.log("0.5");
		this.XPrefab = await this.assets.loadGltf('X.gltf',"mesh");
		//console.log("1");

		const blackColour = this.assets.createMaterial("black",{
			color:{r:0,g:0,b:0,a:1}
		});

		MRE.Actor.CreatePrimitive(this.assets,{//-------------------------------------------------------
			definition: {
				shape: MRE.PrimitiveShape.Box,
				dimensions: {x:6.3,y:3.5,z:0.05}
			},
			addCollider: true,
			actor:{
				name:"background",
				transform:{local:{position:{
					x:this.centerPosition.x+0.05,
					y:this.centerPosition.y+0.9+0.25,
					z:this.centerPosition.z+0.04
				}}},
				/*appearance:{
					materialId:blackColour.id
				}*/
			}
		});

		const yesSign = MRE.Actor.Create(this.context,{
			actor:{
				transform:{local:{position:
					{
						x:this.centerPosition.x-0.2+2.1,
						y:this.centerPosition.y+1.5+1.2,
						z:this.centerPosition.z
					}
				}},
				text:{
					contents:"YES",
					height:0.2
				}
			}
		});
		MRE.Actor.CreatePrimitive(this.assets, {//-----------------------------------
			definition:{
				shape:MRE.PrimitiveShape.Box,
				dimensions:{x:prop.width+1/2*prop.padding+0.06,y:prop.rowHeight-0.02,z:0.005}
			},
			addCollider:true,
			actor:{
				parentId:yesSign.id,
				name:"black behind yes",
				transform:{local:{position:{
					x:+0.2,
					y:-0.07,
					z:0.01
				}}},
				appearance:{
					materialId:blackColour.id,
				}
			}
		});
		const noSign = MRE.Actor.Create(this.context,{
			actor:{
				transform:{local:{position:
					{
						x:this.centerPosition.x+0.45+2.1+0.1,
						y:this.centerPosition.y+1.5+1.2,
						z:this.centerPosition.z
					}
				}},
				text:{
					contents:"NO",
					height:0.2
				}
			}
		});

		//console.log("2");

		MRE.Actor.CreatePrimitive(this.assets, {//-----------------------------------
			definition:{
				shape:MRE.PrimitiveShape.Box,
				dimensions:{x:prop.width+1/2*prop.padding+0.06,y:prop.rowHeight-0.02,z:0.005}
			},
			addCollider:true,
			actor:{
				parentId:noSign.id,
				name:"black behind no",
				transform:{local:{position:{
					x:+0.25-0.1,
					y:-0.07,
					z:0.01
				}}},
				appearance:{
					materialId:blackColour.id,
				}
			}
		});

		MRE.Actor.CreatePrimitive(this.assets,{//----------------------------------------------
			definition:{
				shape:MRE.PrimitiveShape.Box,
				dimensions:{x:4.8,y:prop.rowHeight-0.02,z:0.02}
			},
			addCollider:true,
			actor:{
				name:"black tile",
				transform:{local:{position:{
					x:this.centerPosition.x-0.65,//tempX-0.65,
					y:this.centerPosition.y+1.5+1.2-0.07,//tempY + 1/2*prop.padding - prop.height,
					z:this.centerPosition.z+0.02,//tempZ+0.02
				}}},
				appearance:{
					materialId:blackColour.id,
				}
			}
		});
		
		for (let i = 0; i< questions.length; i++){
			const tempX = this.centerPosition.x;
			const tempY = this.centerPosition.y-(i)*//(prop.height + prop.padding) - extraLines*prop.height
			(prop.rowHeight) + 1+1.2; // maybe use (prop.rowHeight)
			const tempZ = this.centerPosition.z;

			MRE.Actor.CreatePrimitive(this.assets,{//----------------------------------------------
				definition:{
					shape:MRE.PrimitiveShape.Box,
					dimensions:{x:4.8,y:prop.rowHeight-0.02,z:0.02}
				},
				addCollider:true,
				actor:{
					name:"black background",
					transform:{local:{position:{
						x:tempX-0.65,
						y:tempY + 1/2*prop.padding - prop.height,
						z:tempZ+0.02
					}}},
					appearance:{
						materialId:blackColour.id,
					}
				}
			});

			const question = MRE.Actor.Create(this.context,{
				actor:{
					transform:{local:{
						position:{
							x: tempX-3,
							y: tempY+prop.height,
							z: tempZ
						}
					}},
					text:{
						contents:questions[i],
						height:prop.height,
						anchor:MRE.TextAnchorLocation.TopLeft
					},
					collider:{
						geometry:{
							shape:MRE.ColliderType.Box,
							size:{x:0.5,y:0.2,z:0.2},
							center:{x:0.25,y:-0.15,z:0}
						}
					}
				}
			});

			const nextProp: MultipleChoiceProp = {
				numberOfOptions:2,
				padding:prop.padding,
				columns:2,
				height: prop.height,
				width: prop.width,
				rowHeight: prop.rowHeight
				//correctAnswer:correct[i]
			};
			this.creatIt(nextProp, {x: tempX+2.1, y: tempY, z: tempZ},i);

			const questionButton = question.setBehavior(MRE.ButtonBehavior);
			questionButton.onClick((user)=>{
				if (user.properties['altspacevr-roles'] !== ""){
					user.prompt("Enter your question", true)
					.then((value) =>{
						if (value.submitted){
							const newQuestion = value.text;
							user.prompt("What is the answer? Yes/No?",true)
							.then((value2)=>{
								if (value2.submitted){
									if (/[Yy]es/u.test(value2.text)){
										this.correct[i] = 1;
										this.sessionData.answer[i] = 1;
									} else if (/[Nn]o/u.test(value2.text)){
										this.correct[i] = 2;
										this.sessionData.answer[i] = 2;
									} else {
										return;
									}
									question.enableText({
										contents:this.formatText(newQuestion,(3.4),2),
										height:prop.height,
									});
									this.sessionData.question[i] = newQuestion;
									//this.usersAnsweredGlobal = [[],[],[],[],[],[]];
									this.answersFromUsers.map((object)=>{
										if (object){
											object.destroy();
										}
									})
									this.usersAnswered = [];
									this.answersFromUsers = [null,null,null,null,null,null];
								}
							})
						}
					})
				}
			})
			
		}
		
	}

	private formatText(text: string, maxWidth: number, maxLines: number) {
		//let numberOfLines = 0; implement max number of lines
		//console.log("i am in the function to format text");
		let stringToReturn = "";
		if (text.length<maxWidth*17){
			return text;
		}
		let j = 0;
		for (let i = 0;i<maxLines && (stringToReturn.length + maxWidth*17)<text.length;i++){
			for (j = Math.ceil(stringToReturn.length + maxWidth*17); text[j]!==" "; j--){
				//do nothing
			}
			stringToReturn += text.substring(stringToReturn.length,j) + "\n";
		}
		stringToReturn+= text.substring(stringToReturn.length,maxWidth*maxLines*charPerM);
		return stringToReturn;
		//stringToReturn+= text.substring(stringToReturn.length);
		//return stringToReturn;
	}

	private creatIt(prop: MultipleChoiceProp, questionPosition: MRE.Vector3Like,j: number) {
		const transparent = this.assets.createMaterial("transparent", {
			color: { r: 0.2, g: 0.2, b: 0, a: 0.2 },
			//mainTextureId: textureTry.id
		});
		
		const main = MRE.Actor.Create(this.context, {
			actor: {
				transform: {
					app: {
						position: questionPosition,
						rotation: this.centerRotation
					}
				}
			}
		});
		const numberOfRows = Math.ceil(prop.numberOfOptions / prop.columns)
		const height = numberOfRows * (prop.padding + prop.height) - prop.padding;

		const blackColour = this.assets.createMaterial("black",{
			color:{r:0,g:0,b:0,a:1}
		});
		for (let i = 0; i < prop.numberOfOptions; i++) {
			
			const option = MRE.Actor.CreatePrimitive(this.assets, {
				definition: {
					shape: MRE.PrimitiveShape.Box,
					dimensions: { x: prop.width, y: prop.height, z: 0.1 }
				},
				addCollider: true,
				actor: {
					parentId: main.id,
					transform: {
						local: {
							position: {
								x: Math.floor(i / numberOfRows) * (prop.width + prop.padding),
								y: height / 2 - (i % numberOfRows) * (prop.height + prop.padding),// - 0.1,-------
								z: 0
							}
						}
					},
					text:{//TO change----------------------------------------------------
						contents:""
					},
					appearance: { materialId: transparent.id }
				}
			});

			MRE.Actor.CreatePrimitive(this.assets, {//-----------------------------------
				definition:{
					shape:MRE.PrimitiveShape.Box,
					dimensions:{x:prop.width+1/2*prop.padding+0.06,y:prop.rowHeight-0.02,z:0.005}
				},
				addCollider:true,
				actor:{
					parentId:option.id,
					name:"black behind answer",
					transform:{local:{position:{
						x:0,
						y:-0.15,//+0.1,--------------------------
						z:0.01
					}}},
					appearance:{
						materialId:blackColour.id,
					}
				}
			});

			const optionButton = option.setBehavior(MRE.ButtonBehavior);
			//console.log('option made');
			optionButton.onClick((user) => {
				//console.log('option button pressed, ',this.answersFromUsers[j]); 
				if (this.answersFromUsers[j]!==null || !this.participants.includes(user.id)) {
					return;
				}
				//console.log(this.correct);
				//console.log(i,this.correct[j]);
				if (i === this.correct[j] - 1) {
					this.answeredCorrectly(j, prop, option);
				} else {
					this.answeredWrong(j, prop, option);
				}

				// check if I should open door

				let numberOfAnswers = 0;
				this.answersFromUsers.map((value)=>{
					if (value){
						numberOfAnswers++;
					}
				});

				if (numberOfAnswers>5){
					//check if every question is answered
					const correct = this.answersFromUsers.filter((value) =>{ return value.name==="correct"});
					if (correct.length>5){ // count how many are correct
						this.attachStarToThese(this.participants);
					}
				}
				
			});
		}
	}

	public loadData(user: MRE.User){
		//return;
		//console.log(1);
		if (this.correct){
			return;
		}
		
		this.data = require('../public/questionData.json');
		//console.log(this.data);
		
		this.worldId = user.properties['altspacevr-space-id'];
		let questions;
		try {
			const info = this.data[this.worldId][this.context.sessionId];
			questions = info.question;
			this.correct = info.answer;
			//console.log(info);
		} catch (e) {
			questions = [
				"Enter your question","Enter your question","Enter your question",
				"Enter your question","Enter your question","Enter your question"
			];
			this.correct = [
				1,2,2,2,1,1
			];
			if (!this.data[this.worldId]){
				this.data[this.worldId] = {};
			}
			this.data[this.worldId][this.context.sessionId] = {question: questions ,answer:this.correct}
		}

		this.sessionData = {question: questions, answer: this.correct};
		
		this.createQuestions(questions,this.correct,this.prop);
	}

	private answeredCorrectly(questionOrder: number, prop: MultipleChoiceProp, option: MRE.Actor) {
		const symbol = MRE.Actor.CreateFromPrefab(this.context, {
			firstPrefabFrom:this.tickPrefab,
			actor: {
				name:"correct",
				parentId: option.id,
				//exclusiveToUser: user.id,
				transform: {
					local: {
						position: {
							x: -prop.width / 2 + 0.1 + 0.15,
							y: -0.15,//0,
							z: -0.1+0.08
						},
						rotation:{
							x:0,y:1,z:0,w:0
						},
						scale:{
							x:0.2,y:0.2,z:0.2
						}
					}
				}
			}
		});
		//this.answersFromUsers.push(symbol);
		this.answersFromUsers[questionOrder] = symbol;
	}

	private answeredWrong(questionOrder: number, prop: MultipleChoiceProp, option: MRE.Actor) {
		const symbol = MRE.Actor.CreateFromPrefab(this.context, {
			firstPrefabFrom:this.XPrefab,
			actor: {
				name:"incorrect",
				parentId: option.id,
				//exclusiveToUser: user.id,
				transform: {
					local: {
						position: {
							x: -prop.width / 2 + 0.1 +0.15,
							y: -0.15,//0,
							z: -0.1+0.08
						},
						rotation:{x:0,y:1,z:0,w:0},
						scale:{x:0.2,y:0.2,z:0.2}
					}
				}
			}
		});
		//this.answersFromUsers.push(symbol);
		this.answersFromUsers[questionOrder] = symbol;
	}

	public userJoined(user: MRE.User){

		user.groups.clear();
		user.groups.add(this.noGroupName);
		/*if (this.buttonStart){
			const startButton = this.buttonStart.setBehavior(MRE.ButtonBehavior);
			startButton.onClick((user2)=>{
				this.startAssignmentAction(user2);
			});
		}*/
	}

	private startAssignmentButton(position: MRE.Vector3Like){
		this.buttonStart = MRE.Actor.CreatePrimitive(this.assets,{
			definition: {
				shape: MRE.PrimitiveShape.Box,
				dimensions:{ x: 1, y: 0.4, z: 0.02}
			},
			addCollider:true,
			actor:{
				name:"start",
				transform:{app:{position:position}},
			}
		});
		this.buttonStart.collider.layer = MRE.CollisionLayer.Default;

		MRE.Actor.Create(this.context, {
			actor: {
				parentId: this.buttonStart.id,
				transform: {
					local: {
						position: {
							x: 0,
							y: 0,
							z: -0.04,
						}
					}
				},
				text: {
					contents: "Start",
					color: { r: .2, g: 0.2, b: 0.2 },
					height: 0.2,
					anchor: MRE.TextAnchorLocation.MiddleCenter,
					pixelsPerLine: 2
				},
				appearance:{
					enabled: this.notParticipandMask
				}
			}
		});

		MRE.Actor.Create(this.context, {
			actor: {
				parentId: this.buttonStart.id,
				transform: {
					local: {
						position: {
							x: 0,
							y: 0,
							z: -0.04,
						}
					}
				},
				text: {
					contents: "Started",
					color: { r: .2, g: 0.2, b: 0.2 },
					height: 0.2,
					anchor: MRE.TextAnchorLocation.MiddleCenter,
					pixelsPerLine: 2
				},
				appearance:{
					enabled: this.participantMask
				}
			}
		});

		const startButton = this.buttonStart.setBehavior(MRE.ButtonBehavior);
		startButton.onClick((user)=>{
			this.startAssignmentAction(user);
		});
	}

	private startAssignmentAction(user: MRE.User){
		user.groups.clear();
		this.participants.push(user.id);
		user.groups.add(this.groupName);
	}

	private attachStarToThese(users: MRE.Guid[]){
		//console.log("I am going to send something to server");
		if (!this.worldId){
			try {
				this.worldId = this.context.users[0].properties['altspacevr-space-id'];
			} catch {
				return;
			}
		}
		users.map((user: MRE.Guid) => {
			if (this.participantsWithStar.includes(user)){
				return;
			}
			//console.log("send to server", this.worldId);
			const userUser = this.context.user(user);
			//console.log(userUser.context,userUser.internal,userUser.properties);
			request.post(
				'https://storstrom-server.herokuapp.com/add',
				{
					json: {
						sessionId: this.worldId,
						userName: userUser.name,
						userIp : userUser.properties['remoteAddress']
					}
				},
				(err, res, body) => {
					if (err) {
						//console.log(err);
						return;
					}
					
					//console.log(res.body);
				}
			);
			this.participantsWithStar.push(user);
		});
	}
	public save() {
		const tempBuffer = fs.readFileSync("./public/questionData.json", 'utf-8');
		const tempData: storedQuestions = JSON.parse(tempBuffer);
		tempData[this.worldId][this.context.sessionId] = this.sessionData;
		const dataToWrite = JSON.stringify(tempData, null, 2);
		fs.writeFile("./public/questionData.json", dataToWrite, () => { });
		//console.log("write finished");
	}

	
}


