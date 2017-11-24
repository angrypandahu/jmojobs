import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager, JhiParseLinks, JhiAlertService, JhiDataUtils } from 'ng-jhipster';

import { BasicInformationMojobs } from './basic-information-mojobs.model';
import { BasicInformationMojobsService } from './basic-information-mojobs.service';
import { ITEMS_PER_PAGE, Principal, ResponseWrapper } from '../../shared';

@Component({
    selector: 'jhi-basic-information-mojobs',
    templateUrl: './basic-information-mojobs.component.html'
})
export class BasicInformationMojobsComponent implements OnInit, OnDestroy {
basicInformations: BasicInformationMojobs[];
    currentAccount: any;
    eventSubscriber: Subscription;
    currentSearch: string;

    constructor(
        private basicInformationService: BasicInformationMojobsService,
        private jhiAlertService: JhiAlertService,
        private dataUtils: JhiDataUtils,
        private eventManager: JhiEventManager,
        private activatedRoute: ActivatedRoute,
        private principal: Principal
    ) {
        this.currentSearch = activatedRoute.snapshot.params['search'] ? activatedRoute.snapshot.params['search'] : '';
    }

    loadAll() {
        if (this.currentSearch) {
            this.basicInformationService.search({
                query: this.currentSearch,
                }).subscribe(
                    (res: ResponseWrapper) => this.basicInformations = res.json,
                    (res: ResponseWrapper) => this.onError(res.json)
                );
            return;
       }
        this.basicInformationService.query().subscribe(
            (res: ResponseWrapper) => {
                this.basicInformations = res.json;
                this.currentSearch = '';
            },
            (res: ResponseWrapper) => this.onError(res.json)
        );
    }

    search(query) {
        if (!query) {
            return this.clear();
        }
        this.currentSearch = query;
        this.loadAll();
    }

    clear() {
        this.currentSearch = '';
        this.loadAll();
    }
    ngOnInit() {
        this.loadAll();
        this.principal.identity().then((account) => {
            this.currentAccount = account;
        });
        this.registerChangeInBasicInformations();
    }

    ngOnDestroy() {
        this.eventManager.destroy(this.eventSubscriber);
    }

    trackId(index: number, item: BasicInformationMojobs) {
        return item.id;
    }

    byteSize(field) {
        return this.dataUtils.byteSize(field);
    }

    openFile(contentType, field) {
        return this.dataUtils.openFile(contentType, field);
    }
    registerChangeInBasicInformations() {
        this.eventSubscriber = this.eventManager.subscribe('basicInformationListModification', (response) => this.loadAll());
    }

    private onError(error) {
        this.jhiAlertService.error(error.message, null, null);
    }
}
