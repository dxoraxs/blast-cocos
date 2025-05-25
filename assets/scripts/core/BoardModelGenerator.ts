import { TileModel } from "../model/TileModel";
import GameSettings from "../GameSettings";

export class BoardModelGenerator {
    constructor(private settings: GameSettings) {}

    public generate(): TileModel[][] {
        const rows = this.settings.boardHeight;
        const cols = this.settings.boardWidth;

        const board: TileModel[][] = [];

        for (let y = 0; y < rows; y++) {
            const row: TileModel[] = [];
            for (let x = 0; x < cols; x++) {
                const tile = new TileModel();
                this.randomInitializeTileMode(tile);
                tile.setTileIndex(x, y);
                row.push(tile);
            }
            board.push(row);
        }

        return board;
    }

    public randomInitializeTileMode(tileModel: TileModel): TileModel{
        const randomGroupIndex = this.randomGroupIndex;
        const sprite = this.getSpriteByIndex(randomGroupIndex);
        tileModel.setSprite(sprite, randomGroupIndex);
        tileModel.setEmpty(false);
        return tileModel;
    }

    private get randomGroupIndex(): number {
        const randomGroupIndex = Math.floor(Math.random() * this.settings.tileSprites.length);
        return randomGroupIndex;
    }

    private getSpriteByIndex(index: number) {
        return this.settings.tileSprites[index];
    }
}
