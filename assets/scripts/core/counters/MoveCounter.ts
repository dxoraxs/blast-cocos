import { AbstractCounter } from "./AbstractCounter";

export class MoveCounter extends AbstractCounter {
    constructor() {
        super(0);
    }

    public init(moves: number): void {
        this.reset(moves);
    }

    public isOut(): boolean {
        return this.value <= 0;
    }
}
