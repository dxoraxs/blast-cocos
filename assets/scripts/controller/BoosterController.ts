import { Subject } from "rxjs";
import { BoosterData } from "../core/BoosterData";
import { BoosterType } from "../core/BoosterType";
import GameSettings from "../GameSettings";
import { BoosterModel } from "../model/BoosterModel";
import BottomView from "../view/BottomView";
import { SelectClusterModel } from "../model/SelectClusterModel";
import { ClusterResolverType } from "../core/clusterResolver/ClusterResolverType";

const {ccclass, property} = cc._decorator;
@ccclass
export default class BoosterController {
    public readonly onBoosterItemClick$: Subject<BoosterType> = new Subject<BoosterType>();
    private readonly boosters = new Map<BoosterType, BoosterModel>();
    private readonly gameSettings: GameSettings;
    private readonly bottomView : BottomView;
    private readonly selectClusterModel : SelectClusterModel

    constructor(gameSettings : GameSettings, bottomView : BottomView, selectClusterModel: SelectClusterModel)
    {
        this.gameSettings = gameSettings;
        this.bottomView = bottomView;
        this.selectClusterModel = selectClusterModel;

        this.addBooster(BoosterType.Bomb);
        
        this.selectClusterModel.clusterResolver$.subscribe(type => this.onChangeSelectBooster(type));
    }

    public useBooster(type: ClusterResolverType): void {
        const boosterType = (Number(type) - 1) as BoosterType;
        const boosterModel = this.boosters.get(boosterType);
        if (!boosterModel) return;

        const newCount = boosterModel.Count - 1;
        boosterModel.setCount(Math.max(0, newCount));
    }

    private onChangeSelectBooster(type: ClusterResolverType) : void
    {
        var numberBoosterType = Number(type);
        if (numberBoosterType == 0)
        {
            this.boosters.forEach((view, _) => {
                view.setActive(false);
            });
            return;
        }
        var boosterType = (numberBoosterType - 1) as BoosterType;
        const boosterModel = this.boosters.get(boosterType);
        if (!boosterModel) {
            return;
        }
        boosterModel.setActive(true);
    }

    private addBooster(boosterType: BoosterType) : void {
        if (this.boosters.has(boosterType)){
            return;
        }
        var boosterData = this.findBoosterData(boosterType);
        var boosterModel = new BoosterModel(boosterData.sprite, boosterData.startCount);
        var boosterItemView = this.bottomView.spawnBoosterView(boosterModel);

        boosterItemView.setClickCallback(() => {
            if (boosterModel.Count > 0) {
                this.onBoosterItemClick$.next(boosterType);
            }
        });

        this.boosters.set(boosterType, boosterModel);
    }

    private findBoosterData(boosterType: BoosterType) : BoosterData {
        const boosterDates = this.gameSettings.boosterDates;
        for (let index = 0; index < boosterDates.length; index++)
        {
            if (boosterDates[index].type == boosterType){
                return boosterDates[index];
            }
        }
        throw new Error("Not find booster with key " + boosterType);
    }
}
