import { TileModel } from "../model/TileModel";
import { BoardModelGenerator } from "../core/BoardModelGenerator";

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

    public getTile(x: number, y: number): TileModel | null {
        return this.board[y]?.[x] ?? null;
    }

    public setTile(x: number, y: number, tile: TileModel): void {
        if (this.board[y] && this.board[y][x]) {
            this.board[y][x] = tile;
        }
    }

    public get getAll(): TileModel[][] {
        return this.board;
    }

    public collapseAndRefillTiles(removedTiles: TileModel[]): TileModel[] {
        const columnsToProcess = new Set<number>();
        const affectedTiles: TileModel[] = [];

        for (const tile of removedTiles) {
            if (tile.isEmpty) {
                columnsToProcess.add(tile.Index.x);
            }
        }

        columnsToProcess.forEach(x => {
            const tilesInColumn: TileModel[] = [];

            for (let y = 0; y < this.rows; y++) {
                const tile = this.getTile(x, y);
                if (tile && !tile.isEmpty) {
                    tilesInColumn.push(tile);
                }
            }

            let writeY = 0;
            for (const tile of tilesInColumn) {
                if (tile.Index.y !== writeY) {
                    const oldTile = this.getTile(x, writeY);
                    this.setTile(tile.Index.x, tile.Index.y, oldTile);
                    oldTile.setTileIndex(tile.Index.x, tile.Index.y);

                    this.setTile(x, writeY, tile);
                    tile.setTileIndex(x, writeY);
                    affectedTiles.push(tile);
                }
                writeY++;
            }

            for (let y = 0; y < this.rows; y++) {
                const groupIndex = this.boardModelGenerator.randomGroupIndex;

                const tile = this.getTile(x, y);
                if (tile && tile.isEmpty) {
                    const sprite = this.boardModelGenerator.getSpriteByIndex(groupIndex);
                    tile.setSprite(sprite, groupIndex);
                    tile.setTileIndex(x, y);
                    tile.setEmpty(false);
                    affectedTiles.push(tile);
                }
            }
        });
        
        return affectedTiles;
    }

    public forEach(callback: (tile: TileModel, x: number, y: number) => void): void {
        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {
                callback(this.board[y][x], x, y);
            }
        }
    }

    public getNeighbors(x: number, y: number): TileModel[] {
        const deltas = [
            { dx: -1, dy: 0 },
            { dx: 1, dy: 0 },
            { dx: 0, dy: -1 },
            { dx: 0, dy: 1 },
        ];

        return deltas
            .map(d => this.getTile(x + d.dx, y + d.dy))
            .filter((t): t is TileModel => t !== null);
    }
}
