import { firstValueFrom, Subject } from "rxjs";
import EndGameView from "../view/EndGameView";

export class EndGameController {
    public readonly onButtonClick$ = new Subject<void>();

    private readonly view: EndGameView;
    
    constructor(view: EndGameView) 
    {
        this.view = view;
        this.bindCallbacks();
    }

    public async showWin(score: number): Promise<void> {
        this.view.showWin(score);
        
        await firstValueFrom(this.onButtonClick$);
        
        this.hide();
    }

    public async showLose(score: number): Promise<void> {
        this.view.showLose(score);

        await firstValueFrom(this.onButtonClick$);

        this.hide();
    }

    private hide(): void {
        this.view.hide();
    }

    private bindCallbacks(): void {
        this.view.setContinueCallback(() => this.onButtonClick$.next());
        this.view.setRetryCallback(() => this.onButtonClick$.next());
    }
}