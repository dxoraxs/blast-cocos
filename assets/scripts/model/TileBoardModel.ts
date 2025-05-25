import { TileModel } from "../model/TileModel";
import { BoardModelGenerator } from "../core/BoardModelGenerator";
import { TileClusterResolver } from "../core/TileClusterResolver";

export class TileBoardModel {
    private boardModelGenerator: BoardModelGenerator;
    private readonly board: TileModel[][];

    constructor(boardModelGenerator: BoardModelGenerator) {
        this.boardModelGenerator = boardModelGenerator;
        this.board = this.boardModelGenerator.generate();
    }

    public get rows(): number {
        return this.board.length;
    }

    public get cols(): number {
        return this.board[0]?.length || 0;
    }

    public tryGetTile(x: number, y: number): { success: true; tile: TileModel } | { success: false } {
        if (y < 0 || x < 0 || y >= this.board.length || x >= this.board[0].length) {
            return { success: false };
        }

        const row = this.board[y];
        const tile = row[x];
        
        return { success: true, tile };
    }


    public setTile(x: number, y: number, tile: TileModel): void {
        this.board[y][x] = tile;
        if (tile != null){
            tile.setTileIndex(x, y);
        }
    }

    public get getAll(): TileModel[][] {
        return this.board;
    }

    public collapseAndRefillTiles(removedTiles: TileModel[]): 
    Map<TileModel, number> {
        const columnsToProcess = new Map<number, TileModel[]>();
        const tileMapShiftMap = new Map<TileModel, number>();

        for (const tile of removedTiles) {
            if (tile.isEmpty) {
                this.setTile(tile.Index.x, tile.Index.y, null);
                const x = tile.Index.x;
                if (!columnsToProcess.has(x)) {
                    columnsToProcess.set(x, []);
                }
                columnsToProcess.get(x).push(tile);
            }
        }

        columnsToProcess.forEach((tilesInColumn, xIndex) => {
            const shiftIndex = tilesInColumn.length;

            for (let y = 0, emptyOffset = 0; y < this.board[0].length; y++)
            {
                const tryGetTileResult = this.tryGetTile( xIndex, y);
                if (!tryGetTileResult.success)
                {
                    emptyOffset++;
                    continue;
                }
                var tileModel = tryGetTileResult.tile;
                if (!tileModel || tileModel.isEmpty)
                {
                    emptyOffset++;
                    continue;
                }
                if (emptyOffset == 0)
                {
                    continue;
                }
                this.setTile(xIndex, y, null);
                const newYIndex = y - emptyOffset;
                this.setTile(xIndex, newYIndex, tileModel);
                tileMapShiftMap.set(tileModel, emptyOffset);
            }

            for (let index = 0; index < tilesInColumn.length; index++)
            {
                const tileModel = tilesInColumn[index];
                const newYIndex = this.board[0].length - shiftIndex + index;

                this.setTile(xIndex, newYIndex, tileModel);
                this.boardModelGenerator.randomInitializeTileMode(tileModel);

                tileMapShiftMap.set(tileModel, shiftIndex);
            }
        });

        return tileMapShiftMap;
    }

    public forEach(callback: (tile: TileModel, x: number, y: number) => void): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                callback(this.board[y][x], x, y);
            }
        }
    }
}
