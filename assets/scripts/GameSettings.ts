const { ccclass, property } = cc._decorator;
@ccclass
export default class GameSettings extends cc.Component {
    
    @property
    public width: number = 8;

    @property
    public height: number = 8;

    @property([cc.SpriteFrame])
    public tileSprites: cc.SpriteFrame[] = [];

    @property
    public targetScore: number = 1000;

    @property
    public maxMoves: number = 20;
}