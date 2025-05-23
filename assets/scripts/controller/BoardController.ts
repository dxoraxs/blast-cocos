import { TileModel } from "../model/TileModel";
import BoardView from "../view/BoardView";
import GameSettings from "../GameSettings";
import { Subject } from "rxjs";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardController {
    public readonly onTileClick$: Subject<TileModel> = new Subject<TileModel>();
    private readonly boardView: BoardView;
    private readonly gameSettings: GameSettings;

    private readonly tileModels: TileModel[][] = [];

    constructor(models: TileModel[][], gameSettings: GameSettings, boardView: BoardView) {
        this.tileModels = models;
        this.gameSettings = gameSettings;
        this.boardView = boardView;

        this.boardView.buildBoard(models, this.gameSettings);

        this.bindClicks();
    }

    private bindClicks(): void {
        for (let y = 0; y < this.tileModels.length; y++) {
            for (let x = 0; x < this.tileModels[y].length; x++) {
                const model = this.tileModels[y][x];
                const view = this.boardView.getTileView(x, y);
                if (!view) continue;

                view.setClickCallback(() => {
                    this.onTileClick$.next(model);
                });
            }
        }
    }

    get getTileModels(): TileModel[][] {
        return this.tileModels;
    }

    public getTileModel(x: number, y: number): TileModel | null {
        return this.tileModels[y]?.[x] || null;
    }
}
