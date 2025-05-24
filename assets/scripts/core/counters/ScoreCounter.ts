import { AbstractCounter } from "./AbstractCounter";

export class ScoreCounter extends AbstractCounter {
    constructor() {
        super(0);
    }

    public add(points: number): void {
        this.increment(points);
    }
}
