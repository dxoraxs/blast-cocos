import GameSettings from "../GameSettings";
import { TileModel } from "../model/TileModel";
import TileView from "../view/TileView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardView extends cc.Component {
    @property(cc.Prefab)
    private tilePrefab: TileView = null;

    private cellSize: number;
    private gameSettings: GameSettings;
    private tileViews: TileView[][] = [];

    public buildBoard(models: TileModel[][], gameSetting: GameSettings): void {
        this.calculateCellSizeFromModels(models);
        this.gameSettings = gameSetting;
        this.node.removeAllChildren();
        this.tileViews = [];

        for (let y = 0; y < models.length; y++) {
            const row: TileView[] = [];

            for (let x = 0; x < models[y].length; x++) {
                const model = models[y][x];
                const tileNode = cc.instantiate(this.tilePrefab);
                tileNode.node.parent = this.node;

                tileNode.node.setPosition(this.getTilePosition(x, y));

                const tileView = tileNode.getComponent(TileView);
                tileView.setSprite(this.getSpriteFromSettings(model.Sprite));
                
                model.sprite$.subscribe(spriteIndex => {
                    tileView.setSprite(this.getSpriteFromSettings(spriteIndex));
                });

                model.isEmpty$.subscribe(isEmpty => {
                    if (isEmpty) {
                        tileView.playDestroyAnimation();
                    }
                });

                row.push(tileView);
            }

            this.tileViews.push(row);
        }
    }

    private calculateCellSizeFromModels(models: TileModel[][]): void {
        const rows = models.length;
        const cols = models[0]?.length || 0;
        const maxSide = Math.max(rows, cols);

        const boardWidth = this.node.width;
        this.cellSize = boardWidth / maxSide;
    }

    private getSpriteFromSettings(index: number): cc.SpriteFrame {
        return this.gameSettings.tileSprites[index];
    }

    private getTilePosition(x: number, y: number): cc.Vec2 {
        const startX = -(this.cellSize * 0.5 * this.tileViews.length);
        const startY = -(this.cellSize * 0.5 * this.tileViews.length);
        return cc.v2(startX + x * this.cellSize, startY + y * this.cellSize);
    }
}
