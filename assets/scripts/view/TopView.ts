import MovesView from "./MovesView";
import ScoreView from "./ScoreView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TopView extends cc.Component {
    @property(MovesView)
    public movesView: MovesView = null;

    @property(ScoreView)
    public scoreView: ScoreView = null;

    public updateMoves(value: number): void {
        this.movesView.setMoves(value);
    }

    public updateScore(current: number, target: number): void {
        this.scoreView.setScore(current, target);
    }
}
