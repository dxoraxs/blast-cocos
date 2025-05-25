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
        this.boardSize = cc.v2(models[0].length, models.length);
        this.node.removeAllChildren();
        this.tileViewMap.clear();

        for (let y = 0; y < models.length; y++) {
            for (let x = 0; x < models[y].length; x++) {
                const model = models[y][x];
                const tileNode = cc.instantiate(this.tilePrefab);
                const tileView = tileNode.getComponent(TileView);

                tileNode.parent = this.node;
                tileNode.setPosition(this.getTilePosition(x, y));

                tileView.setSprite(model.Sprite);
                model.sprite$.subscribe(sprite => tileView.setSprite(sprite));

                model.isEmpty$.subscribe(isEmpty => {
                    if (isEmpty) {
                        playDestroyAnimationFromNode(tileNode);
                    }
                    else{
                        tileNode.setScale(1);
                        tileNode.opacity = 255;
                    }
                });

                this.tileViewMap.set(model, tileView);
            }
        }
    }

    public getTileViewByModel(model: TileModel): TileView {
        return this.tileViewMap.get(model);
    }
    
    public getTilePosition(x: number, y: number): cc.Vec3 {
        const offsetX = (this.boardSize.x - 1) * 0.5 * this.cellSize;
        const offsetY = (this.boardSize.y - 1) * 0.5 * this.cellSize;

        return cc.v3(x * this.cellSize - offsetX, y * this.cellSize - offsetY, 0);
    }


    private calculateCellSizeFromModels(models: TileModel[][]): void {
        const rows = models.length;
        const cols = models[0]?.length || 0;
        const maxSide = Math.max(rows, cols);

        const boardWidth = this.node.width;
        this.cellSize = boardWidth / maxSide;
    }
}
