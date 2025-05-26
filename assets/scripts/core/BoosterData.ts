import { BoosterType } from "./BoosterType";
const { ccclass, property } = cc._decorator;
@ccclass("BoosterData")
export class BoosterData {
    @property({ type: cc.Enum(BoosterType) })
    public type: BoosterType = BoosterType.Bomb;

    @property(cc.SpriteFrame)
    public sprite: cc.SpriteFrame = null;

    @property()
    public startCount: number = 5;
}