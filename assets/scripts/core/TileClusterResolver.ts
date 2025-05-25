import { TileBoardModel } from "../model/TileBoardModel";
import { TileModel } from "../model/TileModel";
import { ITileClusterResolver } from "./ITileClusterResolver";

export class TileClusterResolver implements ITileClusterResolver {
    private readonly tileBoardModel: TileBoardModel;
    
    constructor(tileBoardModel: TileBoardModel) {
        this.tileBoardModel = tileBoardModel;
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
            console.log("try get is successful");
            if (!tryGetTileResult.success) {
                console.log("not find tile with index = " + current);
                continue;
            }
            const model = tryGetTileResult.tile;
            if (!model) {
                console.log("find model is null");
                continue;
            }
            if (model.GroupIndex != groupIndex) {
                console.log("find model have another group index");
                continue;
            }
            if (model.isEmpty) {
                console.log("find model is empty");
                continue;
            }

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
}
