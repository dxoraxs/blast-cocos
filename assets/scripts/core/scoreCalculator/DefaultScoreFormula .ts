import GameSettings from "../../GameSettings";
import { IScoreFormulaStrategy } from "./IScoreFormulaStrategy";

export class DefaultScoreFormula implements IScoreFormulaStrategy {
    private readonly settings: GameSettings;

    constructor(settings: GameSettings) {
        this.settings = settings;
    }

    public calculateScore(groupSize: number): number {
        return groupSize * groupSize * this.settings.scorePerTile;
    }
}
