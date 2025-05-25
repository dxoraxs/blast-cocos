const { ccclass, property } = cc._decorator;

@ccclass
export default class MovesView extends cc.Component {
    @property(cc.Label)
    private counterLabel: cc.Label = null;

    public setMoves(value: number): void {
        this.counterLabel.string = value.toString();
    }
}
