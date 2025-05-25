const { ccclass, property } = cc._decorator;

@ccclass
export default class EndGameView extends cc.Component {
    @property(cc.Node) private winGroup: cc.Node = null;
    @property(cc.Node) private loseGroup: cc.Node = null;
    @property(cc.Label) private finalScoreLabel: cc.Label = null;

    @property(cc.Button) private continueButton: cc.Button = null;
    @property(cc.Button) private retryButton: cc.Button = null;

    public showWin(score: number): void {
        this.node.active = true;
        this.winGroup.active = true;
        this.loseGroup.active = false;
        this.finalScoreLabel.string = `${score}`;
    }

    public showLose(score: number): void {
        this.node.active = true;
        this.winGroup.active = false;
        this.loseGroup.active = true;
        this.finalScoreLabel.string = `${score}`;
    }

    public hide(): void {
        this.node.active = false;
    }

    public setContinueCallback(callback: () => void): void {
        this.continueButton.node.on("click", callback);
    }

    public setRetryCallback(callback: () => void): void {
        this.retryButton.node.on("click", callback);
    }
}
