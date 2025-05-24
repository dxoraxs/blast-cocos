export interface IScoreFormulaStrategy {
    calculateScore(groupSize: number): number;
}