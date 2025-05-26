const { ccclass, property } = cc._decorator;

@ccclass
export default class ScoreView extends cc.Component {
    @property(cc.Label)
    private titleLabel: cc.Label = null;

    @property(cc.Label)
    private counterLabel: cc.Label = null;

    private currentScore: number = 0;
    private tween?: cc.Tween;

    public setScore(current: number, target: number): void {
        this.titleLabel.string = "ОЧКИ:";

        if (this.tween) {
            this.tween.stop();
        }

        const start = this.currentScore;
        const duration = 0.5;

        const scoreObject = { value: start };

        this.tween = cc.tween(scoreObject)
            .to(duration, { value: current }, {
                easing: 'quadOut',
                onUpdate: (updateValue) => {
                    const displayed = Math.round(updateValue.value);
                    this.counterLabel.string = `${displayed}/${target}`;
                }
            })
            .call(() => {
                this.currentScore = current;
                this.counterLabel.string = `${current}/${target}`;
            })
            .start();
    }
}
