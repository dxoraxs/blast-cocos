import { BoardModelGenerator } from "../BoardModelGenerator";
import { ITileRandomizer } from "./ITileRandomizer";
import { TileModel } from "../../model/TileModel";
import { delay } from "../Delay";

export class TileRandomizer implements ITileRandomizer {
    private boardModel: TileModel[][];
    private boardModelGenerator: BoardModelGenerator;

    constructor(boardModel: TileModel[][], generator: BoardModelGenerator) {
        this.boardModel = boardModel;
        this.boardModelGenerator = generator;
    }

    public async randomizeTiles(): Promise<void> {
        for (let y = 0; y < this.boardModel.length; y++) {
            for (let x = 0; x < this.boardModel[y].length; x++) {
                const tileModel = this.boardModel[y][x];
                this.hideBlock(tileModel);
            }
            await delay(100);
        }
    }

    private async hideBlock(tileModel: TileModel): Promise<void> {
        tileModel.setEmpty(true);
        await delay(350);
        this.boardModelGenerator.randomInitializeTileMode(tileModel);
    }
}
