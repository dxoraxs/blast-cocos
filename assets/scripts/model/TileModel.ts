import { BehaviorSubject } from 'rxjs';

export class TileModel {
    private index: cc.Vec2;
    private groupIndex: number;

    private _sprite$: BehaviorSubject<cc.SpriteFrame>;
    private _isEmpty$: BehaviorSubject<boolean>;

    constructor(initialSprite: cc.SpriteFrame, spriteIndex: number) {
        this._sprite$ = new BehaviorSubject<cc.SpriteFrame>(initialSprite);
        this.groupIndex = spriteIndex;
        this._isEmpty$ = new BehaviorSubject<boolean>(false);
    }

    public setTileIndex(x: number, y: number)
    {
        this.index = cc.v2(x, y);
    }

    get Index(){
        return this.index;
    }

    get GroupIndex(){
        return this.groupIndex;
    }

    get sprite$() {
        return this._sprite$.asObservable();
    }

    get isEmpty$() {
        return this._isEmpty$.asObservable();
    }

    get Sprite(): cc.SpriteFrame {
        return this._sprite$.value;
    }

    get isEmpty(): boolean {
        return this._isEmpty$.value;
    }

    setSprite(newSprite: cc.SpriteFrame, spriteIndex: number): void {
        this.groupIndex = spriteIndex;
        this._sprite$.next(newSprite);
    }

    setEmpty(state: boolean): void {
        this._isEmpty$.next(state);
    }

    dispose() {
        this._sprite$.complete();
        this._isEmpty$.complete();
    }
}
