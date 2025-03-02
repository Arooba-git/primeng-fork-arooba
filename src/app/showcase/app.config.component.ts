import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DomHandler } from 'primeng/dom';
import { Subscription, Subject } from 'rxjs';
import { AppConfig } from './domain/appconfig';
import { AppConfigService } from './service/appconfigservice';

import { takeUntil } from "rxjs/operators";

@Component({
    selector: 'app-config',
    template: `
        <div class="layout-config" [ngClass]="{ 'layout-config-active': active }">
            <div class="layout-config-content-wrapper">
                <a tabindex="0" class="layout-config-button" (click)="toggleConfigurator($event)">
                    <i class="pi pi-cog"></i>
                </a>
                <a tabindex="0" class="layout-config-close" (click)="hideConfigurator($event)">
                    <i class="pi pi-times"></i>
                </a>

                <div class="layout-config-content">
                    <div>
                        <h4>Component Scale</h4>
                        <div class="config-scale">
                            <button icon="pi pi-minus" type="button" pButton (click)="decrementScale()" class="p-button-text" [disabled]="scale === scales[0]"></button>
                            <i class="pi pi-circle-fill" *ngFor="let s of scales" [ngClass]="{ 'scale-active': s === scale }"></i>
                            <button icon="pi pi-plus" type="button" pButton (click)="incrementScale()" class="p-button-text" [disabled]="scale === scales[scales.length - 1]"></button>
                        </div>

                        <app-inputStyleSwitch></app-inputStyleSwitch>

                        <h4>Ripple Effect</h4>
                        <p-inputSwitch [(ngModel)]="config.ripple" (onChange)="onRippleChange()"></p-inputSwitch>

                        <h4>Free Themes</h4>
                        <p>Built-in component themes created by the <a href="https://www.primefaces.org/designer/primeng">PrimeNG Theme Designer</a>.</p>

                        <h5>Bootstrap</h5>
                        <div class="grid free-themes">
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'bootstrap4-light-blue', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/bootstrap4-light-blue.svg" alt="Bootstrap Light Blue" />
                                </button>
                                <span>Blue</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'bootstrap4-light-purple', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/bootstrap4-light-purple.svg" alt="Bootstrap Light Purple" />
                                </button>
                                <span>Purple</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'bootstrap4-dark-blue', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/bootstrap4-dark-blue.svg" alt="Bootstrap Dark Blue" />
                                </button>
                                <span>Blue</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'bootstrap4-dark-purple', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/bootstrap4-dark-purple.svg" alt="Bootstrap Dark Purple" />
                                </button>
                                <span>Purple</span>
                            </div>
                        </div>

                        <h5>Material Design</h5>
                        <div class="grid free-themes">
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'md-light-indigo', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/md-light-indigo.svg" alt="Material Light Indigo" />
                                </button>
                                <span>Indigo</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'md-light-deeppurple', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/md-light-deeppurple.svg" alt="Material Light Deep Purple" />
                                </button>
                                <span>Deep Purple</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'md-dark-indigo', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/md-dark-indigo.svg" alt="Material Dark Indigo" />
                                </button>
                                <span>Indigo</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'md-dark-deeppurple', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/md-dark-deeppurple.svg" alt="Material Dark Deep Purple" />
                                </button>
                                <span>Deep Purple</span>
                            </div>
                        </div>

                        <h5>Material Design Compact</h5>
                        <div class="grid free-themes">
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'mdc-light-indigo', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/md-light-indigo.svg" alt="Material Compact Light Indigo" />
                                </button>
                                <span>Indigo</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'mdc-light-deeppurple', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/md-light-deeppurple.svg" alt="Material Compact Deep Purple" />
                                </button>
                                <span>Deep Purple</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'mdc-dark-indigo', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/md-dark-indigo.svg" alt="Material Compact Dark Indigo" />
                                </button>
                                <span>Indigo</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'mdc-dark-deeppurple', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/md-dark-deeppurple.svg" alt="Material Compact Dark Deep Purple" />
                                </button>
                                <span>Deep Purple</span>
                            </div>
                        </div>

                        <h5>Tailwind</h5>
                        <div class="grid free-themes">
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'tailwind-light', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/tailwind-light.png" alt="Tailwind Light" />
                                </button>
                                <span>Tailwind Light</span>
                            </div>
                        </div>

                        <h5>Fluent UI</h5>
                        <div class="grid free-themes">
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'fluent-light', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/fluent-light.png" alt="Fluent Light" />
                                </button>
                                <span>Fluent Light</span>
                            </div>
                        </div>
                        <h5>PrimeOne Design</h5>
                        <div class="grid free-themes">
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'lara-light-indigo', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/lara-light-indigo.png" alt="Lara Light Indigo" />
                                </button>
                                <span>Lara Light Indigo</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'lara-dark-indigo', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/lara-dark-indigo.png" alt="Lara Dark Indigo" />
                                </button>
                                <span>Lara Dark Indigo</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'lara-light-purple', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/lara-light-purple.png" alt="Lara Light Purple" />
                                </button>
                                <span>Lara Light Purple</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'lara-dark-purple', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/lara-dark-purple.png" alt="Lara Dark Purple" />
                                </button>
                                <span>Lara Dark Purple</span>
                            </div>

                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'lara-light-blue', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/lara-light-blue.png" alt="Lara Light Blue" />
                                </button>
                                <span>Lara Light Blue</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'lara-dark-blue', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/lara-dark-blue.png" alt="Lara Dark Blue" />
                                </button>
                                <span>Lara Dark Blue</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'lara-light-teal', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/lara-light-teal.png" alt="Lara Light Teal" />
                                </button>
                                <span>Lara Light Teal</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'lara-dark-teal', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/lara-dark-teal.png" alt="Lara Dark Teal" />
                                </button>
                                <span>Lara Dark Teal</span>
                            </div>
                        </div>

                        <h5>PrimeOne Design - Legacy</h5>
                        <div class="grid free-themes">
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'saga-blue', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/saga-blue.png" alt="Saga Blue" />
                                </button>
                                <span>Saga Blue</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'saga-green', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/saga-green.png" alt="Saga Green" />
                                </button>
                                <span>Saga Green</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'saga-orange', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/saga-orange.png" alt="Saga Orange" />
                                </button>
                                <span>Saga Orange</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'saga-purple', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/saga-purple.png" alt="Saga Purple" />
                                </button>
                                <span>Saga Purple</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'vela-blue', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/vela-blue.png" alt="Vela Blue" />
                                </button>
                                <span>Vela Blue</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'vela-green', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/vela-green.png" alt="Vela Green" />
                                </button>
                                <span>Vela Green</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'vela-orange', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/vela-orange.png" alt="Vela Orange" />
                                </button>
                                <span>Vela Orange</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'vela-purple', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/vela-purple.png" alt="Vela Purple" />
                                </button>
                                <span>Vela Purple</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'arya-blue', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/arya-blue.png" alt="Arya Blue" />
                                </button>
                                <span>Arya Blue</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'arya-green', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/arya-green.png" alt="Arya Green" />
                                </button>
                                <span>Arya Green</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'arya-orange', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/arya-orange.png" alt="Arya Orange" />
                                </button>
                                <span>Arya Orange</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'arya-purple', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/arya-purple.png" alt="Arya Purple" />
                                </button>
                                <span>Arya Purple</span>
                            </div>
                        </div>

                        <h4>Misc</h4>
                        <div class="grid free-themes">
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'soho-light', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/soho-light.png" alt="Soho Light" />
                                </button>
                                <span>Soho Light</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'soho-dark', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/soho-dark.png" alt="Soho Dark" />
                                </button>
                                <span>Soho Dark</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'viva-light', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/viva-light.svg" alt="Viva Light" />
                                </button>
                                <span>Viva Light</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'viva-dark', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/viva-dark.svg" alt="Viva Dark" />
                                </button>
                                <span>Viva Dark</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'mira', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/mira.jpg" alt="Mira" />
                                </button>
                                <span>Mira</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'nano', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/nano.jpg" alt="Nano" />
                                </button>
                                <span>Nano</span>
                            </div>
                        </div>

                        <h4>Legacy</h4>
                        <div class="grid free-themes">
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'nova', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/nova.png" alt="Nova" />
                                </button>
                                <span>Nova</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'nova-alt', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/nova-alt.png" alt="Nova Alt" />
                                </button>
                                <span>Nova Alt</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'nova-accent', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/nova-accent.png" alt="Nova Accent" />
                                </button>
                                <span>Nova Accent</span>
                            </div>
                            <div class="col-3"></div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'luna-blue', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/luna-blue.png" alt="Luna Blue" />
                                </button>
                                <span>Luna Blue</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'luna-green', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/luna-green.png" alt="Luna Green" />
                                </button>
                                <span>Luna Green</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'luna-amber', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/luna-amber.png" alt="Luna Amber" />
                                </button>
                                <span>Luna Amber</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'luna-pink', true)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/luna-pink.png" alt="Luna Pink" />
                                </button>
                                <span>Luna Pink</span>
                            </div>
                            <div class="col-3">
                                <button class="p-link" (click)="changeTheme($event, 'rhea', false)">
                                    <img src="https://primefaces.org/cdn/primeng/images/themes/rhea.png" alt="Rhea" />
                                </button>
                                <span>Rhea</span>
                            </div>
                        </div>

                        <h4>Premium Angular-CLI Templates</h4>
                        <p>Beautifully crafted premium <a href="https://cli.angular.io/">Angular CLI</a> application templates by the PrimeTek design team.</p>
                        <div class="grid premium-themes">
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/sakai-ng">
                                    <img alt="Sakai" src="https://primefaces.org/cdn/primeng/images/layouts/sakai-ng.png" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/apollo-ng">
                                    <img alt="Apollo" src="https://primefaces.org/cdn/primeng/images/layouts/apollo-ng.jpeg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/verona-ng">
                                    <img alt="Verona" src="https://primefaces.org/cdn/primeng/images/layouts/verona-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/atlantis-ng">
                                    <img alt="Atlantis" src="https://primefaces.org/cdn/primeng/images/layouts/atlantis-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/ultima-ng">
                                    <img alt="Ultima" src="https://primefaces.org/cdn/primeng/images/layouts/ultima-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/freya-ng">
                                    <img alt="Freya" src="https://primefaces.org/cdn/primeng/images/layouts/freya-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/poseidon-ng">
                                    <img alt="Poseidon" src="https://primefaces.org/cdn/primeng/images/layouts/poseidon-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/diamond-ng">
                                    <img alt="Diamond" src="https://primefaces.org/cdn/primeng/images/layouts/diamond-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/mirage-ng">
                                    <img alt="Mirage" src="https://primefaces.org/cdn/primeng/images/layouts/mirage-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/prestige-ng">
                                    <img alt="Prestige" src="https://primefaces.org/cdn/primeng/images/layouts/prestige-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/sapphire-ng">
                                    <img alt="Sapphire" src="https://primefaces.org/cdn/primeng/images/layouts/sapphire-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/roma-ng">
                                    <img alt="Roma" src="https://primefaces.org/cdn/primeng/images/layouts/roma-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/babylon-ng">
                                    <img alt="Babylon" src="https://primefaces.org/cdn/primeng/images/layouts/babylon-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/olympia-ng">
                                    <img alt="Olympia" src="https://primefaces.org/cdn/primeng/images/layouts/olympia-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/california-ng">
                                    <img alt="California" src="https://primefaces.org/cdn/primeng/images/layouts/california-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/ecuador-ng">
                                    <img alt="Ecuador" src="https://primefaces.org/cdn/primeng/images/layouts/ecuador-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/harmony-ng">
                                    <img alt="Harmony" src="https://primefaces.org/cdn/primeng/images/layouts/harmony-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/serenity-ng">
                                    <img alt="Serenity" src="https://primefaces.org/cdn/primeng/images/layouts/serenity-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/avalon-ng">
                                    <img alt="Avalon" src="https://primefaces.org/cdn/primeng/images/layouts/avalon-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/manhattan-ng">
                                    <img alt="Manhattan" src="https://primefaces.org/cdn/primeng/images/layouts/manhattan-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/paradise-ng">
                                    <img alt="Paradise" src="https://primefaces.org/cdn/primeng/images/layouts/paradise-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/barcelona-ng">
                                    <img alt="Barcelona" src="https://primefaces.org/cdn/primeng/images/layouts/barcelona-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/morpheus-ng">
                                    <img alt="Morpheus" src="https://primefaces.org/cdn/primeng/images/layouts/morpheus-ng.jpg" />
                                </a>
                            </div>
                            <div class="col-12 md:col-4">
                                <a href="https://www.primefaces.org/layouts/omega-ng">
                                    <img alt="Omega" src="https://primefaces.org/cdn/primeng/images/layouts/omega-ng.jpg" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
})
export class AppConfigComponent implements OnInit, OnDestroy {
    private destroy$: Subject<any> = new Subject<any>();
    active: boolean;

    scale: number = 14;
    scales: number[] = [12, 13, 14, 15, 16];

    outsideClickListener: any;

    config: AppConfig;

    subscription: Subscription;

    constructor(private el: ElementRef, private router: Router, private configService: AppConfigService) {}

    ngOnInit() {
        this.config = this.configService.config;
        this.subscription = this.configService.configUpdate$.subscribe((config) => {
            this.config = config;
            if (this.config.theme === 'nano') this.scale = 12;
            else this.scale = 14;

            this.applyScale();
        });

        this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
            if (event instanceof NavigationEnd) {
                this.active = false;
            }
        });

        if (this.config.theme === 'nano') this.scale = 12;
    }

    toggleConfigurator(event: Event) {
        this.active = !this.active;
        event.preventDefault();

        if (this.active) this.bindOutsideClickListener();
        else this.unbindOutsideClickListener();
    }

    hideConfigurator(event) {
        this.active = false;
        this.unbindOutsideClickListener();
        event.preventDefault();
    }

    changeTheme(event: Event, theme: string, dark: boolean) {
        this.configService.updateConfig({ ...this.config, ...{ theme, dark } });
        event.preventDefault();
    }

    onRippleChange() {
        this.configService.updateConfig(this.config);
        if (this.config.ripple) DomHandler.removeClass(document.body, 'p-ripple-disabled');
        else DomHandler.addClass(document.body, 'p-ripple-disabled');
    }

    bindOutsideClickListener() {
        if (!this.outsideClickListener) {
            this.outsideClickListener = (event) => {
                if (this.active && this.isOutsideClicked(event)) {
                    this.active = false;
                }
            };
            document.addEventListener('click', this.outsideClickListener);
        }
    }

    unbindOutsideClickListener() {
        if (this.outsideClickListener) {
            document.removeEventListener('click', this.outsideClickListener);
            this.outsideClickListener = null;
        }
    }

    isOutsideClicked(event) {
        return !(this.el.nativeElement.isSameNode(event.target) || this.el.nativeElement.contains(event.target));
    }

    decrementScale() {
        this.scale--;
        this.applyScale();
    }

    incrementScale() {
        this.scale++;
        this.applyScale();
    }

    applyScale() {
        document.documentElement.style.fontSize = this.scale + 'px';
    }

    ngOnDestroy() {
        this.destroy$.next(true);
        this.destroy$.complete();
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }
}
