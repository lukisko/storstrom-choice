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
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
const charPerM = 17;
class MultipleChoice {
    //private usersAnsweredGlobal: MRE.Guid[][];
    constructor(context, assets, centerPosition, prop, centerRotation = { x: 0, y: 0, z: 0, w: 1 }) {
        this.groupName = "PARTICIPANT";
        this.noGroupName = "NOT-PARTICIPANT";
        this.context = context;
        this.assets = assets;
        this.centerPosition = centerPosition;
        this.centerRotation = centerRotation;
        this.usersAnswered = [];
        //this.usersAnsweredGlobal = [[],[],[],[],[],[]];
        this.isClosed = true;
        this.participants = [];
        this.participantMask = new MRE.GroupMask(context, [this.groupName]);
        this.notParticipandMask = new MRE.GroupMask(context, [this.noGroupName]);
        /*this.door = new Door(this.context, this.assets, {
            x: this.centerPosition.x + 8.285-1,
            y: this.centerPosition.y - 1,
            z: this.centerPosition.z - 6.242-1
        });*/
        this.answersFromUsers = [null, null, null, null, null, null];
        //this.creatIt(prop);
        const questions = [
            "Enter your question", "Enter your question", "Enter your question",
            "Enter your question", "Enter your question", "Enter your question"
        ];
        /*[
            "Was the Soviet Union part of the Allied forces?",
            "Did America liberate France during WWII?",
            "Was China part of the Pearl Harbor Attack?",
            "Did Hitler get executed?",
            "Did Hitler’s nephew write a magazine article title \n‘Why I hate my Uncle’?",
            "The term “D-Day” refers to the invasion of Normandy \nthe 6 June 1944?",
        ];*/
        this.correct = [
            1, 2, 2, 2, 1, 1
        ];
        this.questionActors = [];
        this.answerActors = [];
        this.answerFunction = [];
        this.globalProp = prop;
        this.nextPropG = {
            numberOfOptions: 2,
            padding: prop.padding,
            columns: 2,
            height: prop.height,
            width: prop.width,
            rowHeight: prop.rowHeight
        };
        this.createQuestions(questions, this.correct, prop);
    }
    async createQuestions(questions, correct, prop) {
        this.tickPrefab = await this.assets.loadGltf("tick.gltf", "mesh");
        this.XPrefab = await this.assets.loadGltf('X.gltf', "mesh");
        const blackColour = this.assets.createMaterial("black", {
            color: { r: 0, g: 0, b: 0, a: 1 }
        });
        MRE.Actor.CreatePrimitive(this.assets, {
            definition: {
                shape: MRE.PrimitiveShape.Box,
                dimensions: { x: 6.3, y: 3.5, z: 0.05 }
            },
            addCollider: true,
            actor: {
                name: "background",
                transform: { local: { position: {
                            x: this.centerPosition.x + 0.05,
                            y: this.centerPosition.y + 0.9 + 0.25,
                            z: this.centerPosition.z + 0.04
                        } } },
            }
        });
        const yesSign = MRE.Actor.Create(this.context, {
            actor: {
                transform: { local: { position: {
                            x: this.centerPosition.x - 0.2 + 2.1,
                            y: this.centerPosition.y + 1.5 + 1.2,
                            z: this.centerPosition.z
                        }
                    } },
                text: {
                    contents: "YES",
                    height: 0.2
                }
            }
        });
        MRE.Actor.CreatePrimitive(this.assets, {
            definition: {
                shape: MRE.PrimitiveShape.Box,
                dimensions: { x: prop.width + 1 / 2 * prop.padding + 0.06, y: prop.rowHeight - 0.02, z: 0.005 }
            },
            addCollider: true,
            actor: {
                parentId: yesSign.id,
                name: "black behind yes",
                transform: { local: { position: {
                            x: +0.2,
                            y: -0.07,
                            z: 0.01
                        } } },
                appearance: {
                    materialId: blackColour.id,
                }
            }
        });
        const noSign = MRE.Actor.Create(this.context, {
            actor: {
                transform: { local: { position: {
                            x: this.centerPosition.x + 0.45 + 2.1 + 0.1,
                            y: this.centerPosition.y + 1.5 + 1.2,
                            z: this.centerPosition.z
                        }
                    } },
                text: {
                    contents: "NO",
                    height: 0.2
                }
            }
        });
        MRE.Actor.CreatePrimitive(this.assets, {
            definition: {
                shape: MRE.PrimitiveShape.Box,
                dimensions: { x: prop.width + 1 / 2 * prop.padding + 0.06, y: prop.rowHeight - 0.02, z: 0.005 }
            },
            addCollider: true,
            actor: {
                parentId: noSign.id,
                name: "black behind no",
                transform: { local: { position: {
                            x: +0.25 - 0.1,
                            y: -0.07,
                            z: 0.01
                        } } },
                appearance: {
                    materialId: blackColour.id,
                }
            }
        });
        MRE.Actor.CreatePrimitive(this.assets, {
            definition: {
                shape: MRE.PrimitiveShape.Box,
                dimensions: { x: 4.8, y: prop.rowHeight - 0.02, z: 0.02 }
            },
            addCollider: true,
            actor: {
                name: "black tile",
                transform: { local: { position: {
                            x: this.centerPosition.x - 0.65,
                            y: this.centerPosition.y + 1.5 + 1.2 - 0.07,
                            z: this.centerPosition.z + 0.02,
                        } } },
                appearance: {
                    materialId: blackColour.id,
                }
            }
        });
        for (let i = 0; i < questions.length; i++) {
            const tempX = this.centerPosition.x;
            const tempY = this.centerPosition.y - (i) * //(prop.height + prop.padding) - extraLines*prop.height
                (prop.rowHeight) + 1 + 1.2; // maybe use (prop.rowHeight)
            const tempZ = this.centerPosition.z;
            MRE.Actor.CreatePrimitive(this.assets, {
                definition: {
                    shape: MRE.PrimitiveShape.Box,
                    dimensions: { x: 4.8, y: prop.rowHeight - 0.02, z: 0.02 }
                },
                addCollider: true,
                actor: {
                    name: "black background",
                    transform: { local: { position: {
                                x: tempX - 0.65,
                                y: tempY + 1 / 2 * prop.padding - prop.height,
                                z: tempZ + 0.02
                            } } },
                    appearance: {
                        materialId: blackColour.id,
                    }
                }
            });
            const question = MRE.Actor.Create(this.context, {
                actor: {
                    transform: { local: {
                            position: {
                                x: tempX - 3,
                                y: tempY + prop.height,
                                z: tempZ
                            }
                        } },
                    text: {
                        contents: questions[i],
                        height: prop.height,
                        anchor: MRE.TextAnchorLocation.TopLeft
                    },
                    collider: {
                        geometry: {
                            shape: MRE.ColliderType.Box,
                            size: { x: 0.5, y: 0.2, z: 0.2 },
                            center: { x: 0.25, y: -0.15, z: 0 }
                        }
                    }
                }
            });
            this.questionActors.push(question);
            const nextProp = {
                numberOfOptions: 2,
                padding: prop.padding,
                columns: 2,
                height: prop.height,
                width: prop.width,
                rowHeight: prop.rowHeight
                //correctAnswer:correct[i]
            };
            this.creatIt(nextProp, { x: tempX + 2.1, y: tempY, z: tempZ }, i);
            const questionButton = question.setBehavior(MRE.ButtonBehavior);
            questionButton.onClick((user) => {
                this.handleQuestionButton(user, question, i);
            });
        }
    }
    formatText(text, maxWidth, maxLines) {
        //let numberOfLines = 0; implement max number of lines
        //console.log("i am in the function to format text");
        let stringToReturn = "";
        if (text.length < maxWidth * 17) {
            return text;
        }
        let j = 0;
        for (let i = 0; i < maxLines && (stringToReturn.length + maxWidth * 17) < text.length; i++) {
            for (j = Math.ceil(stringToReturn.length + maxWidth * 17); text[j] !== " "; j--) {
                //do nothing
            }
            stringToReturn += text.substring(stringToReturn.length, j) + "\n";
        }
        stringToReturn += text.substring(stringToReturn.length, maxWidth * maxLines * charPerM);
        return stringToReturn;
        //stringToReturn+= text.substring(stringToReturn.length);
        //return stringToReturn;
    }
    creatIt(prop, questionPosition, j) {
        const usersAnsweredLocal = [];
        //const textureTry = this.assets.createTexture("sunglases",{
        //	uri:"2-2-sunglasses-picture.png",
        //});
        const transparent = this.assets.createMaterial("transparent", {
            color: { r: 0.2, g: 0.2, b: 0, a: 0.2 },
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
        const numberOfRows = Math.ceil(prop.numberOfOptions / prop.columns);
        const height = numberOfRows * (prop.padding + prop.height) - prop.padding;
        const blackColour = this.assets.createMaterial("black", {
            color: { r: 0, g: 0, b: 0, a: 1 }
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
                                y: height / 2 - (i % numberOfRows) * (prop.height + prop.padding),
                                z: 0
                            }
                        }
                    },
                    text: {
                        contents: ""
                    },
                    appearance: { materialId: transparent.id }
                }
            });
            MRE.Actor.CreatePrimitive(this.assets, {
                definition: {
                    shape: MRE.PrimitiveShape.Box,
                    dimensions: { x: prop.width + 1 / 2 * prop.padding + 0.06, y: prop.rowHeight - 0.02, z: 0.005 }
                },
                addCollider: true,
                actor: {
                    parentId: option.id,
                    name: "black behind answer",
                    transform: { local: { position: {
                                x: 0,
                                y: -0.15,
                                z: 0.01
                            } } },
                    appearance: {
                        materialId: blackColour.id,
                    }
                }
            });
            this.answerActors.push(option);
            const answerFunction = () => { this.handleAnswerButton(i, j, option); };
            this.answerFunction.push(answerFunction);
            const optionButton = option.setBehavior(MRE.ButtonBehavior);
            //console.log('option made');
            optionButton.onClick((user) => {
                //console.log('option button pressed, ',this.answersFromUsers[j]);
                answerFunction();
            });
        }
    }
    remakeButtons(user1) {
        this.questionActors.map((question, i) => {
            const questionButton = question.setBehavior(MRE.ButtonBehavior);
            questionButton.onClick((user2) => {
                this.handleQuestionButton(user2, question, i);
            });
        });
        for (let i = 0; i < this.answerActors.length; i++) {
            const tempButton = this.answerActors[i].setBehavior(MRE.ButtonBehavior);
            tempButton.onClick(this.answerFunction[i]);
        }
    }
    handleQuestionButton(user, question, i) {
        if (user.properties['altspacevr-roles'] !== "") {
            user.prompt("Enter your question", true)
                .then((value) => {
                if (value.submitted) {
                    const newQuestion = value.text;
                    user.prompt("What is the answer? Yes/No?", true)
                        .then((value2) => {
                        if (value2.submitted) {
                            if (/[Yy]es/u.test(value2.text)) {
                                this.correct[i] = 1;
                            }
                            else if (/[Nn]o/u.test(value2.text)) {
                                this.correct[i] = 2;
                            }
                            else {
                                user.prompt("Sorry I was not able to understand it.");
                                return;
                            }
                            question.enableText({
                                contents: this.formatText(newQuestion, (3.4), 2),
                                height: this.globalProp.height,
                            });
                            //this.usersAnsweredGlobal = [[],[],[],[],[],[]];
                            this.answersFromUsers.map((object) => {
                                if (object) {
                                    object.destroy();
                                }
                            });
                            this.usersAnswered = [];
                            this.answersFromUsers = [null, null, null, null, null, null];
                        }
                    });
                }
            });
        }
    }
    handleAnswerButton(i, j, option) {
        if (this.answersFromUsers[j] !== null) {
            return;
        }
        //console.log(this.correct);
        //console.log(i,this.correct[j]);
        if (i === this.correct[j] - 1) {
            this.answeredCorrectly(j, this.nextPropG, option);
        }
        else {
            this.answeredWrong(j, this.nextPropG, option);
        }
        // check if I should open door
        let numberOfAnswers = 0;
        this.answersFromUsers.map((value) => {
            if (value) {
                numberOfAnswers++;
            }
        });
    }
    answeredCorrectly(questionOrder, prop, option) {
        const symbol = MRE.Actor.CreateFromPrefab(this.context, {
            firstPrefabFrom: this.tickPrefab,
            actor: {
                parentId: option.id,
                //exclusiveToUser: user.id,
                transform: {
                    local: {
                        position: {
                            x: -prop.width / 2 + 0.1 + 0.15,
                            y: -0.15,
                            z: -0.1 + 0.08
                        },
                        rotation: {
                            x: 0, y: 1, z: 0, w: 0
                        },
                        scale: {
                            x: 0.2, y: 0.2, z: 0.2
                        }
                    }
                }
            }
        });
        //this.answersFromUsers.push(symbol);
        this.answersFromUsers[questionOrder] = symbol;
    }
    answeredWrong(questionOrder, prop, option) {
        const symbol = MRE.Actor.CreateFromPrefab(this.context, {
            firstPrefabFrom: this.XPrefab,
            actor: {
                parentId: option.id,
                //exclusiveToUser: user.id,
                transform: {
                    local: {
                        position: {
                            x: -prop.width / 2 + 0.1 + 0.15,
                            y: -0.15,
                            z: -0.1 + 0.08
                        },
                        rotation: { x: 0, y: 1, z: 0, w: 0 },
                        scale: { x: 0.2, y: 0.2, z: 0.2 }
                    }
                }
            }
        });
        //this.answersFromUsers.push(symbol);
        this.answersFromUsers[questionOrder] = symbol;
    }
    startAssignmentButton(position) {
        this.buttonStart = MRE.Actor.CreatePrimitive(this.assets, {
            definition: {
                shape: MRE.PrimitiveShape.Box,
                dimensions: { x: 1, y: 0.4, z: 0.02 }
            },
            addCollider: true,
            actor: {
                name: "start",
                transform: { app: { position: position } },
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
                appearance: {
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
                appearance: {
                    enabled: this.participantMask
                }
            }
        });
        const startButton = this.buttonStart.setBehavior(MRE.ButtonBehavior);
        startButton.onClick((user) => {
            this.startAssignmentAction(user);
        });
    }
    startAssignmentAction(user) {
        user.groups.clear();
        this.participants.push(user.id);
        user.groups.add(this.groupName);
    }
}
exports.default = MultipleChoice;
//# sourceMappingURL=multipleChoice.js.map