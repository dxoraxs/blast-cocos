import { TileModel } from "../model/TileModel";
import GameSettings from "../GameSettings";
import BoardController from "./BoardController";
import UIManager from "./UIManager";
import { BoardModelGenerator } from "../core/BoardModelGenerator";
import { TileClusterResolver } from "../core/TileClusterResolver";
import { ScoreCounter } from "../core/counters/ScoreCounter";
import { MoveCounter } from "../core/counters/MoveCounter";
import { DefaultScoreFormula } from "../core/scoreCalculator/DefaultScoreFormula ";
import { ScoreCalculator } from "../core/scoreCalculator/ScoreCalculator";
import { ITileClusterResolver } from "../core/ITileClusterResolver";
import { TileBoardModel } from "../model/TileBoardModel";
import { Subscription } from "rxjs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    @property(GameSettings)
    private gameSettings: GameSettings = null;

    @property(UIManager)
    private uiManager: UIManager = null;

    private boardController: BoardController;
    private scoreCounter = new ScoreCounter();
    private moveCounter = new MoveCounter();
    private scoreCalculator: ScoreCalculator;
    private clickSubscription?: Subscription;

    onLoad() {
        this.boardController = new BoardController(this.gameSettings, this.uiManager.BoardView);

        const formula = new DefaultScoreFormula(this.gameSettings);
        this.scoreCalculator = new ScoreCalculator(formula);
        this.scoreCounter.reset();
        this.moveCounter.init(this.gameSettings.maxMoves);

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

        this.bindClicks();
    }
}