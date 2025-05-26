import { TileBoardModel } from "../../model/TileBoardModel";
import { TileModel } from "../../model/TileModel";
import { ITileClusterResolver } from "./ITileClusterResolver";

export class BombTileClusterResolver implements ITileClusterResolver {
    private readonly tileBoardModel: TileBoardModel;
    private readonly radiusExplosion: number;

    constructor(tileBoardModel: TileBoardModel, radiusExplosion: number) {
        this.tileBoardModel = tileBoardModel;
        this.radiusExplosion = radiusExplosion;
    }

    checkHaveGroup(findCountTile: number): boolean {
        const tileModels = this.tileBoardModel.getAll;
        const yMaxIndex = tileModels.length;
        const xMaxIndex = tileModels[0].length;

        for (let y = 0; y < yMaxIndex; y++) {
            for (let x = 0; x < xMaxIndex; x++) {
                var group = this.findGroup(tileModels[y][x]);
                if (group.length >= findCountTile) {
                    return true;
                }
            }
        }

        return false;
    }

    public findGroup(tileModel: TileModel): TileModel[] {
        const result: TileModel[] = [];

        const centerX = tileModel.Index.x;
        const centerY = tileModel.Index.y;
        const sqrRadius = this.radiusExplosion * this.radiusExplosion;

        for (let dy = -this.radiusExplosion; dy <= this.radiusExplosion; dy++) {
            for (let dx = -this.radiusExplosion; dx <= this.radiusExplosion; dx++) {
                const distanceSquared = dx * dx + dy * dy;
                if (distanceSquared > sqrRadius) {
                    continue;
                }

                const x = centerX + dx;
                const y = centerY + dy;

                const tryGetTileResult = this.tileBoardModel.tryGetTile(x, y);
                if (!tryGetTileResult.success) {
                    continue;
                }

                const model = tryGetTileResult.tile;
                if (!model || model.isEmpty) {
                    continue;
                }

                result.push(model);
            }
        }

        return result;
    }
}
