import { ScoreCounter } from "../core/counters/ScoreCounter";
import { MoveCounter } from "../core/counters/MoveCounter";
import GameSettings from "../GameSettings";
import { GameEndResult } from "./GameEndResult";

export class EndStateManager {
    private scoreCounter: ScoreCounter;
    private moveCounter: MoveCounter;
    private settings: GameSettings;

    constructor(scoreCounter: ScoreCounter, moveCounter: MoveCounter,
        settings: GameSettings) {
        this.scoreCounter = scoreCounter;
        this.moveCounter = moveCounter;
        this.settings = settings;
    }

    public checkToEndLevel() : GameEndResult{
        console.log("check score");
        if (this.scoreCounter.value >= this.settings.targetScore){
            console.log("score norm");
            return GameEndResult.Win;
        }
        console.log("check move");
        if (this.moveCounter.isOut){
            console.log("move norm");
            return GameEndResult.Lose;
        }
        console.log("result none");
        return GameEndResult.None;
    }
}
