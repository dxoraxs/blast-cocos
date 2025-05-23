import BoardView from "../view/BoardView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIManager extends cc.Component {
    @property(BoardView)
    private boardView: BoardView = null;

    get BoardView(){
        return this.boardView;
    }
}