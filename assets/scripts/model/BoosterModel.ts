import { BehaviorSubject } from 'rxjs';

export class BoosterModel {
    private _sprite$: BehaviorSubject<cc.SpriteFrame>;
    private _count$: BehaviorSubject<number>;
    private _isActive$ = new BehaviorSubject<boolean>(false);

    constructor(sprite: cc.SpriteFrame, count: number) {
        this._sprite$ = new BehaviorSubject<cc.SpriteFrame>(sprite);
        this._count$ = new BehaviorSubject<number>(count);
    }

    get sprite$() {
        return this._sprite$.asObservable();
    }

    get count$() {
        return this._count$.asObservable();
    }

    get isActive$() {
        return this._isActive$.asObservable();
    }

    get Sprite(): cc.SpriteFrame {
        return this._sprite$.value;
    }

    get Count(): number {
        return this._count$.value;
    }

    get IsActive(): boolean {
        return this._isActive$.value;
    }

    setSprite(newSprite: cc.SpriteFrame): void {
        this._sprite$.next(newSprite);
    }

    setCount(count: number): void {
        this._count$.next(count);
    }

    setActive(value: boolean): void {
        this._isActive$.next(value);
    }

    dispose() {
        this._sprite$.complete();
        this._count$.complete();
        this._isActive$.complete();
    }
}
