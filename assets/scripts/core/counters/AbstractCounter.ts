import { BehaviorSubject, Observable } from "rxjs";

export abstract class AbstractCounter {
    protected value$: BehaviorSubject<number>;
    private readonly defaultValue : number;

    constructor(initial: number = 0) {
        this.value$ = new BehaviorSubject<number>(initial);
        this.defaultValue = initial;
    }

    public get value(): number {
        return this.value$.value;
    }

    public get observable(): Observable<number> {
        return this.value$.asObservable();
    }

    public reset(value: number = this.defaultValue): void {
        this.value$.next(value);
    }

    public increment(delta: number = 1): void {
        this.value$.next(this.value$.value + delta);
    }

    public decrement(delta: number = 1): void {
        this.value$.next(Math.max(0, this.value$.value - delta));
    }
}
