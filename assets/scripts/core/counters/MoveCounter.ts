import { AbstractCounter } from "./AbstractCounter";

export class MoveCounter extends AbstractCounter {
    constructor(initial : number) {
        super(initial);
    }

    public init(moves: number): void {
        this.reset(moves);
    }

    public get isOut(): boolean {
        return this.value <= 0;
    }
}
