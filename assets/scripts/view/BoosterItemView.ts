const {ccclass, property} = cc._decorator;
@ccclass
export default class BoosterItemView extends cc.Component {
    @property(cc.Label) private counterLabel: cc.Label = null;
    @property(cc.Sprite) private sprite: cc.Sprite = null;
    @property(cc.Node) private outline: cc.Node = null;

    private _clickCallback: () => void;

    onLoad() {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onClicked, this);
    }

    public setCounter(count: number) {
        this.node.opacity = count > 0 ? 255 : 125;
        this.counterLabel.string = count.toString();
    }

    public setSprite(sprite: cc.SpriteFrame) {
        this.sprite.spriteFrame = sprite;
    }

    public setOutline(value: boolean) {
        this.outline.active = value;
    }

    private onClicked() {
        if (this._clickCallback) {
            this._clickCallback();
        }
    }

    public setClickCallback(callback: () => void): void {
        this._clickCallback = callback;
    }
}