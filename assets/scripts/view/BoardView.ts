import GameSettings from "../GameSettings";
import { TileModel } from "../model/TileModel";
import TileView from "../view/TileView";
import { playDestroyAnimationFromNode } from "../animations/TileViewAnimation";

const { ccclass, property } = cc._decorator;

@ccclass
export default class BoardView extends cc.Component {
    @property(cc.Prefab)
    private tilePrefab: cc.Prefab = null;

    private cellSize: number;
    private boardSize: cc.Vec2;
    private tileViewMap: Map<TileModel, TileView> = new Map();

    public buildBoard(models: TileModel[][]): void {
        this.calculateCellSizeFromModels(models);
        this.boardSize = cc.v2(models.length, models[0].length);
        this.node.removeAllChildren();
        this.tileViewMap.clear();

        for (let y = 0; y < models.length; y++) {
            for (let x = 0; x < models[y].length; x++) {
                const model = models[y][x];
                const tileNode = cc.instantiate(this.tilePrefab);
                tileNode.parent = this.node;

                tileNode.setPosition(this.getTilePosition(x, y));

                const tileView = tileNode.getComponent(TileView);

                tileView.setSprite(model.Sprite);
                model.sprite$.subscribe(tileView.setSprite);

                model.isEmpty$.subscribe(isEmpty => {
                    if (isEmpty) {
                        playDestroyAnimationFromNode(tileView.node);
                    }
                });

                this.tileViewMap.set(model, tileView);
            }
        }
    }
    
    public getTileViewByModel(model: TileModel): TileView | null {
        return this.tileViewMap.get(model) || null;
    }

    
    public getTilePosition(x: number, y: number): cc.Vec2 {
        const startX = -(this.cellSize * 0.5 * (this.boardSize.x - 1));
        const startY = -(this.cellSize * 0.5 * (this.boardSize.y - 1));
        return cc.v2(startX + x * this.cellSize, startY + y * this.cellSize);
    }
    private calculateCellSizeFromModels(models: TileModel[][]): void {
        const rows = models.length;
        const cols = models[0]?.length || 0;
        const maxSide = Math.max(rows, cols);

        const boardWidth = this.node.width;
        this.cellSize = boardWidth / maxSide;
    }
}
