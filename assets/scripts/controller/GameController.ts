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
    private clickSubscription?: Subscription;
    private topUIController: TopUIController;
    private endGameController : EndGameController;
    private endStateManager : EndStateManager;

    onLoad() {
        const formula = new DefaultScoreFormula(this.gameSettings);
        this.scoreCalculator = new ScoreCalculator(formula);
        this.moveCounter = new MoveCounter(this.gameSettings.maxMoves);
        this.endGameController = new EndGameController(this.uiManager.EndGameView);
        this.boardController = new BoardController(this.gameSettings, this.uiManager.BoardView);
        this.endStateManager = new EndStateManager(this.scoreCounter, this.moveCounter, this.gameSettings);

        this.topUIController = new TopUIController(
            this.scoreCounter, this.moveCounter,
            this.uiManager.TopView, this.gameSettings.targetScore
        );
        this.bindClicks();
    }

    private bindClicks(): void {
        this.clickSubscription?.unsubscribe();
        this.clickSubscription = this.boardController.onTileClick$.subscribe((tileModel) => {
            this.handleTileClick(tileModel);
        });
    }

    private handleTileClick(tileModel: TileModel): void {
        const group = this.boardController.clusterResolver.findGroup(tileModel.Index, tileModel.GroupIndex);

        if (group.length < this.gameSettings.minGroupSize) {
            return;
        }

        this.collapseGroupLogic(group);  
    }

    private async collapseGroupLogic(group: TileModel[]): Promise<void> {
        this.clickSubscription?.unsubscribe();
        this.moveCounter.decrement();

        await this.boardController.clearTiles(group);
        
        const newScore = this.scoreCalculator.calculate(group.length);
        this.scoreCounter.add(newScore);

        console.log("start check end level");
        var result = this.endStateManager.checkToEndLevel();

        console.log("endStateManager result = " + result);
        switch (result){
            case GameEndResult.Lose:
                await this.endGameController.showLose(this.scoreCounter.value);
                await this.restartLevel();
                break;
            case GameEndResult.Win:
                await this.endGameController.showWin(this.scoreCounter.value);
                await this.restartLevel();
                break;
        }

        this.bindClicks();
    }

    private async restartLevel() : Promise<void>{
        await this.boardController.randomizeTiles();
        this.scoreCounter.reset();
        this.moveCounter.reset();
    }
}