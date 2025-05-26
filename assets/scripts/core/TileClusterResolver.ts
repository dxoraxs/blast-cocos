import { TileBoardModel } from "../model/TileBoardModel";
import { TileModel } from "../model/TileModel";
import { ITileClusterResolver } from "./ITileClusterResolver";

export class TileClusterResolver implements ITileClusterResolver {
    private readonly tileBoardModel: TileBoardModel;
    
    constructor(tileBoardModel: TileBoardModel) {
        this.tileBoardModel = tileBoardModel;
    }

    checkHaveGroup(findCountTile: number): boolean {
        const tileModels = this.tileBoardModel.getAll;
        const yMaxIndex = tileModels.length;
        const xMaxIndex = tileModels[0].length;

        for (let y = 0; y < yMaxIndex; y++) {
            for (let x = 0; x < xMaxIndex; x++) {
                var group = this.findGroup(cc.v2(x, y), tileModels[y][x].GroupIndex);
                if (group.length >= findCountTile) {
                    return true;
                }
            }
        }

        return false;
    }

    public findGroup(start: cc.Vec2, groupIndex: number): TileModel[] {
        const visited = new Set<string>();
        const result: TileModel[] = [];

        const key = (x: number, y: number) => `${x},${y}`;
        const stack = [{ x: start.x, y: start.y }];

        while (stack.length > 0) {
            const current = stack.pop();
            if (!current) {
                continue;
            }
            
            const tryGetTileResult = this.tileBoardModel.tryGetTile(current.x, current.y);

            if (!tryGetTileResult.success) {
                continue;
            }
            
            const model = tryGetTileResult.tile;
            if (!model || model.GroupIndex != groupIndex || model.isEmpty) {
                continue;
            }

            const k = key(current.x, current.y);
            if (visited.has(k)) {
                continue;
            }

            visited.add(k);
            result.push(model);

            stack.push({ x: current.x + 1, y: current.y });
            stack.push({ x: current.x - 1, y: current.y });
            stack.push({ x: current.x, y: current.y + 1 });
            stack.push({ x: current.x, y: current.y - 1 });
        }

        return result;
    }
}
