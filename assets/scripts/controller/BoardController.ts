import { TileModel } from "../model/TileModel";
import BoardView from "../view/BoardView";
import GameSettings from "../GameSettings";
import { Subject } from "rxjs";
import { TileBoardModel } from "../model/TileBoardModel";
import { BoardModelGenerator } from "../core/BoardModelGenerator";
import { ITileClusterResolver } from "../core/clusterResolver/ITileClusterResolver";
import { DefaultTileClusterResolver } from "../core/clusterResolver/DefaultTileClusterResolver";
import { playMovingAnimationFromNode } from "../animations/TileViewAnimation";
import { delay } from "../core/Delay";
import { TileRandomizer } from "../core/tileBoardAnimator/TileRandomizer";
import { ClusterResolverType } from "../core/clusterResolver/ClusterResolverType";
import { BombTileClusterResolver } from "../core/clusterResolver/BombTileClusterResolver";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardController {
    public readonly onTileClick$: Subject<TileModel> = new Subject<TileModel>();

    private readonly boardView: BoardView;
    private readonly tileBoardModel: TileBoardModel;
    private readonly gameSettings: GameSettings;
    private readonly boardModelGenerator: BoardModelGenerator;
    private readonly clusterResolvers = new Map<ClusterResolverType, ITileClusterResolver>;
    
    constructor(gameSettings: GameSettings, boardView: BoardView) {

        this.gameSettings = gameSettings;
        this.boardView = boardView;

        this.boardModelGenerator = new BoardModelGenerator(this.gameSettings);
        this.tileBoardModel = new TileBoardModel(this.boardModelGenerator);

        this.boardView.buildBoard(this.tileBoardModel.getAll);
        this.bindClicks(this.tileBoardModel.getAll);

        this.clusterResolvers.set(ClusterResolverType.Default, new DefaultTileClusterResolver(this.tileBoardModel));
        this.clusterResolvers.set(ClusterResolverType.Bomb, new BombTileClusterResolver(this.tileBoardModel, gameSettings.bombRadius));
    }

    public findGroup(tileModel: TileModel, resolverType: ClusterResolverType): TileModel[]{
        return this.clusterResolvers.get(resolverType).findGroup(tileModel);
    }

    public checkHaveGroup(findCountTile: number):boolean {
        return this.clusterResolvers.get(ClusterResolverType.Default).checkHaveGroup(findCountTile);
    }

    public async clearTiles(clearTiles: TileModel[]): Promise<void> {
        clearTiles.forEach(t => t.setEmpty(true));

        await delay(250);

        const collapseResult = this.tileBoardModel.collapseAndRefillTiles(clearTiles);
        
        collapseResult.forEach((shiftVerticalIndex, tileModel) => {
            var tileView = this.boardView.getTileViewByModel(tileModel);

            var targetPosition = this.boardView.getTilePosition(tileModel.Index.x, tileModel.Index.y);
            var startPosition = this.boardView.getTilePosition(tileModel.Index.x, tileModel.Index.y + shiftVerticalIndex);

            playMovingAnimationFromNode(tileView.node, startPosition, targetPosition);
        });

        await delay(300);
    }

    public async randomizeTiles(): Promise<void> {
        const tileRandomizer = new TileRandomizer(this.tileBoardModel.getAll, this.boardModelGenerator);
        await tileRandomizer.randomizeTiles();
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
