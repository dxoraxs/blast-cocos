import { BoosterModel } from "../model/BoosterModel";
import BoosterItemView from "./BoosterItemView";
import BoostersView from "./BoostersView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BottomView extends cc.Component {

    @property(BoostersView)
    boostersView: BoostersView = null;

    public spawnBoosterView(boosterModel: BoosterModel): BoosterItemView{
        return this.boostersView.spawnBoosterView(boosterModel);
    }
}
