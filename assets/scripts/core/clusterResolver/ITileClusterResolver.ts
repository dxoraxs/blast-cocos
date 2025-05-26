import { TileBoardModel } from "../../model/TileBoardModel";
import { TileModel } from "../../model/TileModel";

export interface ITileClusterResolver {
    findGroup(tileModel: TileModel): TileModel[];
    checkHaveGroup(findCountTile: number):boolean;
}