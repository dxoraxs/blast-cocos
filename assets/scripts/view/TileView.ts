const { ccclass, property } = cc._decorator;
@ccclass
export default class TileView extends cc.Component {
    @property(cc.Sprite) sprite: cc.Sprite = null;

    public setSprite(sprite: cc.SpriteFrame) {
        this.sprite.spriteFrame = sprite;
    }

    public playDestroyAnimation(): Promise<void> {
        return new Promise(resolve => {
            cc.tween(this.node)
                .to(0.2, { scale: 0.2, opacity: 0 }) // сжатие + исчезновение
                .call(() => {
                    this.node.destroy(); // удаляем объект из сцены
                    resolve();
                })
                .start();
        });
    }
}
