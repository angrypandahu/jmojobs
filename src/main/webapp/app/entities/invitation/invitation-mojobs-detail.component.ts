import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Rx';
import { JhiEventManager } from 'ng-jhipster';

import { InvitationMojobs } from './invitation-mojobs.model';
import { InvitationMojobsService } from './invitation-mojobs.service';

@Component({
    selector: 'jhi-invitation-mojobs-detail',
    templateUrl: './invitation-mojobs-detail.component.html'
})
export class InvitationMojobsDetailComponent implements OnInit, OnDestroy {

    invitation: InvitationMojobs;
    private subscription: Subscription;
    private eventSubscriber: Subscription;

    constructor(
        private eventManager: JhiEventManager,
        private invitationService: InvitationMojobsService,
        private route: ActivatedRoute
    ) {
    }

    ngOnInit() {
        this.subscription = this.route.params.subscribe((params) => {
            this.load(params['id']);
        });
        this.registerChangeInInvitations();
    }

    load(id) {
        this.invitationService.find(id).subscribe((invitation) => {
            this.invitation = invitation;
        });
    }
    previousState() {
        window.history.back();
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.eventManager.destroy(this.eventSubscriber);
    }

    registerChangeInInvitations() {
        this.eventSubscriber = this.eventManager.subscribe(
            'invitationListModification',
            (response) => this.load(this.invitation.id)
        );
    }
}
