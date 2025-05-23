import { BehaviorSubject } from 'rxjs';

export class TileModel {
    readonly x: number;
    readonly y: number;

    private _sprite$: BehaviorSubject<number>;
    private _isEmpty$: BehaviorSubject<boolean>;

    constructor(x: number, y: number, initialColor: number) {
        this.x = x;
        this.y = y;
        this._sprite$ = new BehaviorSubject<number>(initialColor);
        this._isEmpty$ = new BehaviorSubject<boolean>(false);
    }

    get sprite$() {
        return this._sprite$.asObservable();
    }

    get isEmpty$() {
        return this._isEmpty$.asObservable();
    }

    get Sprite(): number {
        return this._sprite$.value;
    }

    get isEmpty(): boolean {
        return this._isEmpty$.value;
    }

    setSpriteIndex(newSprite: number): void {
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
