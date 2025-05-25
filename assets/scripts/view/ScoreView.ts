const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreView extends cc.Component {
    @property(cc.Label)
    private titleLabel: cc.Label = null;

    @property(cc.Label)
    private counterLabel: cc.Label = null;

    public setScore(current: number, target: number): void {
        this.titleLabel.string = "ОЧКИ:";
        this.counterLabel.string = `${current}/${target}`;
    }
}
