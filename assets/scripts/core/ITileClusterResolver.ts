import { TileBoardModel } from "../model/TileBoardModel";
import { TileModel } from "../model/TileModel";

export interface ITileClusterResolver {
    findGroup(start: cc.Vec2, groupIndex: number): TileModel[];
    checkHaveGroup(findCountTile: number):boolean;
}