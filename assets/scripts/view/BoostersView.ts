import { BoosterModel } from "../model/BoosterModel";
import BoosterItemView from "./BoosterItemView";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BoostersView extends cc.Component {
    @property(cc.Prefab)
    private boosterViewPrefab: cc.Prefab = null;

    public spawnBoosterView(boosterModel: BoosterModel): BoosterItemView{
        const boosterNode = cc.instantiate(this.boosterViewPrefab);
        const boosterItemView = boosterNode.getComponent(BoosterItemView);
        
        boosterNode.parent = this.node;
        
        boosterModel.sprite$.subscribe(sprite => 
            boosterItemView.setSprite(sprite));

        boosterModel.count$.subscribe(count =>
            boosterItemView.setCounter(count));

        boosterModel.isActive$.subscribe(value => 
            boosterItemView.setOutline(value));

        return boosterItemView;
    }
}
