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
        if (this.scoreCounter.value >= this.settings.targetScore){
            return GameEndResult.Win;
        }
        if (this.moveCounter.isOut){
            return GameEndResult.Lose;
        }
        return GameEndResult.None;
    }
}
