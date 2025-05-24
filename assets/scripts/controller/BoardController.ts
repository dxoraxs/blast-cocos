import { TileModel } from "../model/TileModel";
import BoardView from "../view/BoardView";
import GameSettings from "../GameSettings";
import { Subject } from "rxjs";
import { TileBoardModel } from "../model/TileBoardModel";
import { BoardModelGenerator } from "../core/BoardModelGenerator";
import { ITileClusterResolver } from "../core/ITileClusterResolver";
import { TileClusterResolver } from "../core/TileClusterResolver";
import { playMovingAnimationFromNode } from "../animations/TileViewAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardController {
    public readonly onTileClick$: Subject<TileModel> = new Subject<TileModel>();

    private readonly boardView: BoardView;
    private readonly tileBoardModel: TileBoardModel;
    private readonly gameSettings: GameSettings;
    private readonly tileClusterResolver: ITileClusterResolver;

    constructor(gameSettings: GameSettings, boardView: BoardView) {
        this.gameSettings = gameSettings;
        this.boardView = boardView;

        const generator = new BoardModelGenerator(this.gameSettings);
        this.tileBoardModel = new TileBoardModel(generator);

        this.boardView.buildBoard(this.tileBoardModel.getAll);
        this.bindClicks(this.tileBoardModel.getAll);
        this.tileClusterResolver = new TileClusterResolver(this.tileBoardModel);
    }

    public get clusterResolver(): ITileClusterResolver
    {
        return this.tileClusterResolver;
    }

    public clearTiles(clearTiles: TileModel[]): void{
        clearTiles.forEach(t => t.setEmpty(true));
        const moveTiles = this.tileBoardModel.collapseAndRefillTiles(clearTiles);
        console.log("moveTiles = " + moveTiles.length);
        moveTiles.forEach(tileModel => {
            var tileView = this.boardView.getTileViewByModel(tileModel);
            var newPosition = this.boardView.getTilePosition(tileModel.Index.x, tileModel.Index.y);
            playMovingAnimationFromNode(tileView.node, newPosition);
        });
    }

    private bindClicks(models: TileModel[][]): void {
        for (let y = 0; y < models.length; y++) {
            for (let x = 0; x < models[y].length; x++) {
                const model = models[y][x];
                const view = this.boardView.getTileViewByModel(model);
                if (!view) {
                    continue;
                }

                view.setClickCallback(() => {
                    this.onTileClick$.next(model);
                });
            }
        }
    }
}
