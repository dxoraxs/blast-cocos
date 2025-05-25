import { ScoreCounter } from "../core/counters/ScoreCounter";
import { MoveCounter } from "../core/counters/MoveCounter";
import TopView from "../view/TopView";
import { Subscription } from "rxjs";

export class TopUIController {
    private readonly scoreCounter: ScoreCounter;
    private readonly moveCounter: MoveCounter;
    private readonly topView: TopView;
    private readonly targetScore: number;

    private subscriptions: Subscription[] = [];

    constructor(
        scoreCounter: ScoreCounter,
        moveCounter: MoveCounter,
        topView: TopView,
        targetScore: number
    ) {
        this.scoreCounter = scoreCounter;
        this.moveCounter = moveCounter;
        this.topView = topView;
        this.targetScore = targetScore;

        this.bind();
    }

    private bind(): void {
        const moveSub = this.moveCounter.observable.subscribe(value => {
            this.topView.updateMoves(value);
        });

        const scoreSub = this.scoreCounter.observable.subscribe(current => {
            this.topView.updateScore(current, this.targetScore);
        });

        this.subscriptions.push(moveSub, scoreSub);
    }

    public dispose(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
        this.subscriptions = [];
    }
}
