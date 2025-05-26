import BoardView from "../view/BoardView";
import BottomView from "../view/BottomView";
import EndGameView from "../view/EndGameView";
import TopView from "../view/TopView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {
    @property(BoardView)
    private boardView: BoardView = null;

    @property(BottomView)
    private bottomView: BottomView = null;

    @property(TopView)
    private topView: TopView = null;

    @property(EndGameView)
    private endGameView: EndGameView = null;

    get TopView() {
        return this.topView;
    }

    get BottomView() {
        return this.bottomView;
    }

    get EndGameView() {
        return this.endGameView;
    }

    get BoardView() {
        return this.boardView;
    }
}