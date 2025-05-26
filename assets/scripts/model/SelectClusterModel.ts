import { BehaviorSubject } from 'rxjs';
import { ClusterResolverType } from '../core/clusterResolver/ClusterResolverType';

export class SelectClusterModel {
    private _clusterResolver$: BehaviorSubject<ClusterResolverType>;

    constructor() {
        this._clusterResolver$ = new BehaviorSubject<ClusterResolverType>(ClusterResolverType.Default);
    }

    get clusterResolver$() {
        return this._clusterResolver$.asObservable();
    }

    get Type(): ClusterResolverType {
        return this._clusterResolver$.value;
    }

    setType(newType: ClusterResolverType): void {
        this._clusterResolver$.next(newType);
    }

    dispose() {
        this._clusterResolver$.complete();
    }
}
