import { BoosterData } from "./core/BoosterData";
import { BoosterType } from "./core/BoosterType";

const { ccclass, property } = cc._decorator;
@ccclass
export default class GameSettings extends cc.Component {
    
    @property
    public boardWidth: number = 8;

    @property
    public boardHeight: number = 8;

    @property([cc.SpriteFrame])
    public tileSprites: cc.SpriteFrame[] = [];

    @property
    public targetScore: number = 1000;

    @property
    public maxMoves: number = 20;
    
    @property
    public minGroupSize: number = 2;
    
    @property
    public countRefreshBoard: number = 2;
    
    @property
    public scorePerTile: number = 10;
    
    @property([BoosterData])
    public boosterDates: BoosterData[] = [];
    
    @property
    public bombRadius: number = 3;
}