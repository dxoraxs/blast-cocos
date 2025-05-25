import BoardView from "../view/BoardView";
import EndGameView from "../view/EndGameView";
import TopView from "../view/TopView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {
    @property(BoardView)
    private boardView: BoardView = null;

    @property(TopView)
    private topView: TopView = null;

    @property(EndGameView)
    private endGameView: EndGameView = null;

    get TopView() {
        return this.topView;
    }

    get EndGameView() {
        return this.endGameView;
    }

    get BoardView() {
        return this.boardView;
    }
}