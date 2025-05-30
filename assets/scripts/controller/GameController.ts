import { TileModel } from "../model/TileModel";
import GameSettings from "../GameSettings";
import BoardController from "./BoardController";
import UIManager from "./UIManager";
import { DefaultScoreFormula } from "../core/scoreCalculator/DefaultScoreFormula ";
import { ScoreCalculator } from "../core/scoreCalculator/ScoreCalculator";
import { Subscription } from "rxjs";
import { ScoreCounter } from "../core/counters/ScoreCounter";
import { MoveCounter } from "../core/counters/MoveCounter";
import { TopUIController } from "./TopUIController";
import { EndGameController } from "./EndGameController";
import { EndStateManager } from "../core/EndStateManager";
import { GameEndResult } from "../core/GameEndResult";
import { delay } from "../core/Delay";
import { SelectClusterModel } from "../model/SelectClusterModel";
import BoosterController from "./BoosterController";
import { ClusterResolverType } from "../core/clusterResolver/ClusterResolverType";
import { BoosterType } from "../core/BoosterType";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    @property(GameSettings)
    private gameSettings: GameSettings = null;

    @property(UIManager)
    private uiManager: UIManager = null;

    private boardController: BoardController;
    private scoreCounter = new ScoreCounter();
    private moveCounter : MoveCounter;
    private scoreCalculator: ScoreCalculator;
    private tileClickSubscription?: Subscription;
    private boosterClickSubscription?: Subscription;
    private topUIController: TopUIController;
    private endGameController : EndGameController;
    private endStateManager : EndStateManager;
    private selectClusterModel = new SelectClusterModel();
    private boosterController : BoosterController;
    private counterRefreshBoard = 0;

    onLoad() {
        const formula = new DefaultScoreFormula(this.gameSettings);
        this.scoreCalculator = new ScoreCalculator(formula);
        this.moveCounter = new MoveCounter(this.gameSettings.maxMoves);
        this.endGameController = new EndGameController(this.uiManager.EndGameView);
        this.boardController = new BoardController(this.gameSettings, this.uiManager.BoardView);
        this.endStateManager = new EndStateManager(this.scoreCounter, this.moveCounter, this.gameSettings);
        this.boosterController = new BoosterController(this.gameSettings, this.uiManager.BottomView, this.selectClusterModel);

        this.topUIController = new TopUIController(
            this.scoreCounter, this.moveCounter,
            this.uiManager.TopView, this.gameSettings.targetScore
        );
        this.bindClicks();
    }

    private bindClicks(): void {
        this.unsubscribeClicks();
        this.tileClickSubscription = this.boardController.onTileClick$.subscribe((tileModel) => {
            this.handleTileClick(tileModel);
        });

        this.boosterClickSubscription = this.boosterController.onBoosterItemClick$.subscribe(boosterType =>{
            this.handleBoosterClick(boosterType);
        });
    }

    private handleTileClick(tileModel: TileModel): void {
        this.findTileGroup(tileModel);
    }

    private findTileGroup(tileModel: TileModel): void{
        const group = this.boardController.findGroup(tileModel, this.selectClusterModel.Type);

        if (group.length < this.gameSettings.minGroupSize) {
            return;
        }

        this.collapseGroupLogic(group);
    }

    private handleBoosterClick(boosterType: BoosterType) {
        if (Number(this.selectClusterModel.Type) - 1 == Number(boosterType)) {
            this.selectClusterModel.setType(ClusterResolverType.Default);
        }
        else {
            const numberClusterType = Number(boosterType) + 1;
            const newClusterType = (numberClusterType) as ClusterResolverType;
            this.selectClusterModel.setType(newClusterType);
        }
    }

    private unsubscribeClicks(): void{
        this.boosterClickSubscription?.unsubscribe();
        this.tileClickSubscription?.unsubscribe();
    }

    private async collapseGroupLogic(group: TileModel[]): Promise<void> {
        this.unsubscribeClicks();
        
        if (this.selectClusterModel.Type !== ClusterResolverType.Default) {
            this.boosterController.useBooster(this.selectClusterModel.Type);
        }
        
        this.selectClusterModel.setType(ClusterResolverType.Default);

        this.moveCounter.decrement();

        await this.boardController.clearTiles(group);

        const newScore = this.scoreCalculator.calculate(group.length);
        this.scoreCounter.add(newScore);

        await this.checkEndLevel();
        const isRefreshAbortively = await this.tryRefreshBoard();

        if (isRefreshAbortively) {
            await this.endGameController.showLose(this.scoreCounter.value);
            await this.restartLevel();
        }
    
        this.bindClicks();
    }

    private async tryRefreshBoard() : Promise<boolean> {
        var needToRefresh = !this.boardController.checkHaveGroup(this.gameSettings.minGroupSize);
        var haveTryRefresh = this.counterRefreshBoard < this.gameSettings.countRefreshBoard;
        while (needToRefresh && haveTryRefresh) {
            this.counterRefreshBoard++;
            await this.refreshBoard();

            await delay(300);

            needToRefresh = !this.boardController.checkHaveGroup(this.gameSettings.minGroupSize);
            haveTryRefresh = this.counterRefreshBoard < this.gameSettings.countRefreshBoard;
        }
        return needToRefresh && !haveTryRefresh;
    }

    private async checkEndLevel() : Promise<void>{
        var result = this.endStateManager.checkToEndLevel();

        switch (result){
            case GameEndResult.Lose:
                await this.endGameController.showLose(this.scoreCounter.value);
                break;
            case GameEndResult.Win:
                await this.endGameController.showWin(this.scoreCounter.value);
                break;
        }

        if (result == GameEndResult.Lose || result == GameEndResult.Win) {
            await this.restartLevel();
        }
    }

    private async restartLevel() : Promise<void>{
        await this.refreshBoard();
        this.scoreCounter.reset();
        this.moveCounter.reset();
        this.counterRefreshBoard = 0;
    }

    private async refreshBoard() : Promise<void>{
        await this.boardController.randomizeTiles();
    }
}