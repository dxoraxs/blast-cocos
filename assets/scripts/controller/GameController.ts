import { TileModel } from "../model/TileModel";
import GameSettings from "../GameSettings";
import BoardController from "./BoardController";
import UIManager from "./UIManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class GameController extends cc.Component {
    private boardController: BoardController;

    @property(GameSettings)
    private gameSettings: GameSettings = null;

    @property(UIManager)
    private uiManager: UIManager = null;

    private score: number = 0;
    private movesLeft: number = 0;

    onLoad() {
        const models = this.generateBoardModel();
        this.boardController = new BoardController(models, this.gameSettings, 
            this.uiManager.BoardView);

        this.movesLeft = this.gameSettings.maxMoves;
        this.score = 0;

        this.boardController.onTileClick$.subscribe(tileModel => {
            this.handleTileClick(tileModel);
        });
    }

    private generateBoardModel(): TileModel[][] {
        const rows = this.gameSettings.boardHeight;
        const cols = this.gameSettings.boardWidth;
        const spriteCount = this.gameSettings.tileSprites.length;

        const board: TileModel[][] = [];

        for (let y = 0; y < rows; y++) {
            const row: TileModel[] = [];
            for (let x = 0; x < cols; x++) {
                const randomGroupIndex = Math.floor(Math.random() * spriteCount);
                const sprite = this.gameSettings.tileSprites[randomGroupIndex];
                const newTileModel = new TileModel(sprite, randomGroupIndex);
                newTileModel.setTileIndex(x, y);
                row.push(newTileModel);
            }
            board.push(row);
        }

        return board;
    }

    private handleTileClick(tileModel: TileModel): void {
        const group = this.floodFill(tileModel.Index, tileModel.GroupIndex);

        if (group.length < this.gameSettings.minGroupSize) return;

        this.score += this.calculateScore(group.length);
        this.movesLeft--;

        group.forEach(t => t.setEmpty(true));

        // TODO: обновить UI
        // TODO: падение, генерация, победа/проигрыш
    }

    private floodFill(index: cc.Vec2, targetGroup: number): TileModel[] {
        const visited = new Set<string>();
        const board = this.boardController.getTileModels;
        const result: TileModel[] = [];

        const key = (x: number, y: number) => `${x},${y}`;

        const x = index.x;
        const y = index.y;
        const stack = [{ x, y }];

        while (stack.length > 0) {
            const current = stack.pop();
            if (!current) continue;

            const model = board[current.y]?.[current.x];
            if (!model || model.GroupIndex !== targetGroup || model.isEmpty) continue;

            const k = key(current.x, current.y);
            if (visited.has(k)) continue;

            visited.add(k);
            result.push(model);

            stack.push({ x: current.x + 1, y: current.y });
            stack.push({ x: current.x - 1, y: current.y });
            stack.push({ x: current.x, y: current.y + 1 });
            stack.push({ x: current.x, y: current.y - 1 });
        }

        return result;
    }

    private calculateScore(groupSize: number): number {
        return groupSize * groupSize * this.gameSettings.scorePerTile;
    }
}
