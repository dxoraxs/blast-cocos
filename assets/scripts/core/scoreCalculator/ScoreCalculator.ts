import { IScoreFormulaStrategy } from "./IScoreFormulaStrategy";

export class ScoreCalculator {
    private readonly strategy: IScoreFormulaStrategy;

    constructor(strategy: IScoreFormulaStrategy) {
        this.strategy = strategy;
    }

    public calculate(groupSize: number): number {
        return this.strategy.calculateScore(groupSize);
    }
}