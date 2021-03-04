import { L10n, closest, EventHandler, isNullOrUndefined, formatUnit, append, AnimationModel, isBlazor } from '@syncfusion/ej2-base';
import { addClass, removeClass, createElement, remove, extend, updateBlazorTemplate, resetBlazorTemplate } from '@syncfusion/ej2-base';
import { getElement } from '@syncfusion/ej2-base';
import { Dialog, Popup, isCollide, ButtonPropsModel } from '@syncfusion/ej2-popups';
import { Button } from '@syncfusion/ej2-buttons';
import { Input, FormValidator } from '@syncfusion/ej2-inputs';
import { Schedule } from '../base/schedule';
import { ResourcesModel } from '../models/models';
import { RecurrenceEditor } from '../../recurrence-editor/index';
import {
    CellClickEventArgs, EventClickArgs, EventFieldsMapping, PopupOpenEventArgs, EventRenderedArgs, EJ2Instance, TdData, PopupCloseEventArgs
} from '../base/interface';
import { PopupType, TemplateType } from '../base/type';
import { FieldValidator } from './form-validator';
import * as event from '../base/constant';
import * as cls from '../base/css-constant';
import * as util from '../base/util';

const EVENT_FIELD: string = 'e-field';

/**
 * Quick Popups interactions
 */
export class QuickPopups {
    private l10n: L10n;
    private parent: Schedule;
    private isMultipleEventSelect: boolean = false;
    public quickDialog: Dialog;
    public quickPopup: Popup;
    public morePopup: Popup;
    private fieldValidator: FieldValidator;
    private isCrudAction: boolean = false;
    public lastEvent: Object;

    /**
     * Constructor for QuickPopups
     */
    constructor(parent: Schedule) {
        this.parent = parent;
        this.l10n = this.parent.localeObj;
        this.fieldValidator = new FieldValidator();
        this.render();
        this.addEventListener();
    }

    private render(): void {
        this.renderQuickPopup();
        this.renderMorePopup();
        this.renderQuickDialog();
    }

    private renderQuickPopup(): void {
        let quickPopupWrapper: HTMLElement = createElement('div', { className: cls.POPUP_WRAPPER_CLASS + ' e-popup-close' });
        if (this.parent.isAdaptive) {
            document.body.appendChild(quickPopupWrapper);
            addClass([quickPopupWrapper], cls.DEVICE_CLASS);
        } else {
            this.parent.element.appendChild(quickPopupWrapper);
        }
        this.quickPopup = new Popup(quickPopupWrapper, {
            targetType: (this.parent.isAdaptive ? 'container' : 'relative'),
            enableRtl: this.parent.enableRtl,
            open: this.quickPopupOpen.bind(this),
            close: this.quickPopupClose.bind(this),
            hideAnimation: (this.parent.isAdaptive ? { name: 'ZoomOut' } : { name: 'FadeOut', duration: 150 }),
            showAnimation: (this.parent.isAdaptive ? { name: 'ZoomIn' } : { name: 'FadeIn', duration: 150 }),
            collision: (this.parent.isAdaptive ? { X: 'fit', Y: 'fit' } :
                (this.parent.enableRtl ? { X: 'flip', Y: 'fit' } : { X: 'none', Y: 'fit' })),
            position: (this.parent.isAdaptive || this.parent.enableRtl ? { X: 'left', Y: 'top' } : { X: 'right', Y: 'top' }),
            viewPortElement: (this.parent.isAdaptive ? document.body : this.parent.element),
            zIndex: (this.parent.isAdaptive ? 1004 : 3)
        });
        this.quickPopup.isStringTemplate = true;
    }

    private renderMorePopup(): void {
        let moreEventPopup: string = `<div class="${cls.MORE_EVENT_POPUP_CLASS}"><div class="${cls.MORE_EVENT_HEADER_CLASS}">` +
            `<div class="${cls.MORE_EVENT_CLOSE_CLASS}" title="${this.l10n.getConstant('close')}" tabindex="0"></div>` +
            `<div class="${cls.MORE_EVENT_DATE_HEADER_CLASS}"><div class="${cls.MORE_EVENT_HEADER_DAY_CLASS}"></div>` +
            `<div class="${cls.MORE_EVENT_HEADER_DATE_CLASS} ${cls.NAVIGATE_CLASS}" tabindex="0"></div></div></div></div>`;
        let moreEventWrapper: HTMLElement = createElement('div', {
            className: cls.MORE_POPUP_WRAPPER_CLASS + ' e-popup-close',
            innerHTML: moreEventPopup
        });
        if (this.parent.isAdaptive) {
            document.body.appendChild(moreEventWrapper);
            addClass([moreEventWrapper], cls.DEVICE_CLASS);
        } else {
            this.parent.element.appendChild(moreEventWrapper);
        }
        this.morePopup = new Popup(moreEventWrapper, {
            targetType: (this.parent.isAdaptive ? 'container' : 'relative'),
            enableRtl: this.parent.enableRtl,
            hideAnimation: { name: 'ZoomOut', duration: 300 },
            showAnimation: { name: 'ZoomIn', duration: 300 },
            open: this.morePopupOpen.bind(this),
            close: this.morePopupClose.bind(this),
            collision: (this.parent.isAdaptive ? { X: 'fit', Y: 'fit' } :
                (this.parent.enableRtl ? { X: 'flip', Y: 'fit' } : { X: 'flip', Y: 'flip' })),
            viewPortElement: (this.parent.isAdaptive ? document.body : this.parent.element),
            zIndex: (this.parent.isAdaptive ? 1002 : 2)
        });
        this.morePopup.isStringTemplate = true;
        let closeButton: HTMLButtonElement = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_CLOSE_CLASS) as HTMLButtonElement;
        this.renderButton('e-round', cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeButton, this.closeClick);
        EventHandler.add(this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS), 'click', this.navigationClick, this);
    }

    private renderQuickDialog(): void {
        let buttonModel: ButtonPropsModel[] = [
            { buttonModel: { cssClass: 'e-quick-alertok e-flat', isPrimary: true }, click: this.dialogButtonClick.bind(this) },
            { buttonModel: { cssClass: 'e-quick-alertcancel e-flat', isPrimary: false }, click: this.dialogButtonClick.bind(this) },
            {
                buttonModel: { cssClass: 'e-quick-dialog-cancel e-disable e-flat', isPrimary: false },
                click: this.dialogButtonClick.bind(this)
            }];
        if (this.parent.eventSettings.editFollowingEvents) {
            let followingSeriesButton: ButtonPropsModel = {
                buttonModel: { cssClass: 'e-quick-alertfollowing e-flat', isPrimary: false }, click: this.dialogButtonClick.bind(this)
            };
            buttonModel.splice(1, 0, followingSeriesButton);
        }
        this.quickDialog = new Dialog({
            animationSettings: { effect: 'Zoom' },
            buttons: buttonModel,
            cssClass: cls.QUICK_DIALOG_CLASS,
            closeOnEscape: true,
            enableRtl: this.parent.enableRtl,
            beforeClose: this.beforeQuickDialogClose.bind(this),
            isModal: true,
            position: { X: 'center', Y: 'center' },
            showCloseIcon: true,
            target: document.body,
            visible: false,
            width: 'auto'
        });
        let dialogElement: HTMLElement = createElement('div', { id: this.parent.element.id + 'QuickDialog' });
        this.parent.element.appendChild(dialogElement);
        this.quickDialog.appendTo(dialogElement);
        this.quickDialog.isStringTemplate = true;
        let okButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        if (okButton) {
            okButton.setAttribute('aria-label', this.l10n.getConstant('occurrence'));
            okButton.setAttribute('aria-label', okButton.innerHTML);
        }
        let cancelButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        if (cancelButton) {
            cancelButton.setAttribute('aria-label', this.l10n.getConstant('series'));
            cancelButton.setAttribute('aria-label', cancelButton.innerHTML);
        }
        if (this.quickDialog.element.querySelector('.e-dlg-closeicon-btn')) {
            this.quickDialog.element.querySelector('.e-dlg-closeicon-btn').setAttribute('title', this.l10n.getConstant('close'));
        }
    }

    private renderButton(className: string, iconName: string, isDisabled: boolean, element: HTMLButtonElement, clickEvent: Function): void {
        let buttonObj: Button = new Button({
            cssClass: className,
            disabled: isDisabled,
            enableRtl: this.parent.enableRtl,
            iconCss: iconName
        });
        buttonObj.appendTo(element);
        buttonObj.isStringTemplate = true;
        EventHandler.add(element, 'click', clickEvent, this);
    }

    private quickDialogClass(action: string): void {
        let classList: string[] = [
            cls.QUICK_DIALOG_OCCURRENCE_CLASS, cls.QUICK_DIALOG_SERIES_CLASS, cls.QUICK_DIALOG_DELETE_CLASS,
            cls.QUICK_DIALOG_CANCEL_CLASS, cls.QUICK_DIALOG_ALERT_BTN_CLASS, cls.DISABLE_CLASS
        ];
        let okButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        let cancelButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        let followingEventButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_FOLLOWING);
        removeClass([okButton, cancelButton], classList);
        addClass([this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_CANCEL_CLASS)], cls.DISABLE_CLASS);
        if (this.parent.eventSettings.editFollowingEvents) {
            addClass([followingEventButton], cls.DISABLE_CLASS);
            removeClass([this.quickDialog.element], cls.FOLLOWING_EVENTS_DIALOG);
        }
        switch (action) {
            case 'Recurrence':
                addClass([okButton], cls.QUICK_DIALOG_OCCURRENCE_CLASS);
                addClass([cancelButton], cls.QUICK_DIALOG_SERIES_CLASS);
                if (this.parent.eventSettings.editFollowingEvents) {
                    removeClass([followingEventButton], cls.DISABLE_CLASS);
                    addClass([this.quickDialog.element], cls.FOLLOWING_EVENTS_DIALOG);
                    addClass([followingEventButton], cls.QUICK_DIALOG_FOLLOWING_EVENTS_CLASS);
                }
                break;
            case 'Delete':
                addClass([okButton], cls.QUICK_DIALOG_DELETE_CLASS);
                addClass([cancelButton], cls.QUICK_DIALOG_CANCEL_CLASS);
                break;
            case 'Alert':
                addClass([okButton], [cls.QUICK_DIALOG_ALERT_OK, cls.QUICK_DIALOG_ALERT_BTN_CLASS]);
                addClass([cancelButton], [cls.QUICK_DIALOG_ALERT_CANCEL, cls.DISABLE_CLASS]);
                break;
        }
    }

    private applyFormValidation(): void {
        let form: HTMLFormElement = this.quickPopup.element.querySelector('.' + cls.FORM_CLASS) as HTMLFormElement;
        let rules: { [key: string]: Object } = {};
        rules[this.parent.eventSettings.fields.subject.name] = this.parent.eventSettings.fields.subject.validation;
        this.fieldValidator.renderFormValidator(form, rules, this.quickPopup.element);
    }

    public openRecurrenceAlert(): void {
        let editDeleteOnly: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        if (editDeleteOnly) {
            editDeleteOnly.innerHTML = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteEvent' : 'editEvent');
            editDeleteOnly.setAttribute('aria-label', editDeleteOnly.innerHTML);
        }
        let editFollowingEventsOnly: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_FOLLOWING);
        if (editFollowingEventsOnly) {
            editFollowingEventsOnly.innerHTML = this.l10n.getConstant('editFollowingEvent');
            editFollowingEventsOnly.setAttribute('aria-label', editFollowingEventsOnly.innerHTML);
        }
        let editDeleteSeries: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        if (editDeleteSeries) {
            editDeleteSeries.innerHTML = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteSeries' : 'editSeries');
            editDeleteSeries.setAttribute('aria-label', editDeleteSeries.innerHTML);
        }
        this.quickDialog.content = this.l10n.getConstant('editContent');
        this.quickDialog.header = this.l10n.getConstant(this.parent.currentAction === 'Delete' ? 'deleteTitle' : 'editTitle');
        this.quickDialogClass('Recurrence');
        let activeEvent: { [key: string]: Object } = (<{ [key: string]: Object }>this.parent.activeEventData.event);
        if (this.parent.eventSettings.editFollowingEvents && this.parent.currentAction === 'EditOccurrence'
            && !isNullOrUndefined(activeEvent[this.parent.eventFields.recurrenceID]) && activeEvent[this.parent.eventFields.recurrenceID]
            !== activeEvent[this.parent.eventFields.id]) {
            let followingEventButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_FOLLOWING);
            addClass([followingEventButton], cls.DISABLE_CLASS);
        }
        this.showQuickDialog('RecurrenceAlert');
    }

    public openRecurrenceValidationAlert(type: string): void {
        this.quickDialogClass('Alert');
        let okButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        okButton.innerHTML = this.l10n.getConstant('ok');
        okButton.setAttribute('aria-label', okButton.innerHTML);
        let cancelButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        cancelButton.innerHTML = this.l10n.getConstant('cancel');
        cancelButton.setAttribute('aria-label', cancelButton.innerHTML);
        this.quickDialog.header = this.l10n.getConstant('alert');
        switch (type) {
            case 'wrongPattern':
                addClass([cancelButton], cls.DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('wrongPattern');
                break;
            case 'createError':
                addClass([cancelButton], cls.DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('createError');
                break;
            case 'sameDayAlert':
                addClass([cancelButton], cls.DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('sameDayAlert');
                break;
            case 'seriesChangeAlert':
                let dialogCancel: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_CANCEL_CLASS);
                removeClass([cancelButton, dialogCancel], cls.DISABLE_CLASS);
                this.quickDialog.content = this.l10n.getConstant('seriesChangeAlert');
                okButton.innerHTML = this.l10n.getConstant('yes');
                cancelButton.innerHTML = this.l10n.getConstant('no');
                dialogCancel.innerHTML = this.l10n.getConstant('cancel');
                break;
        }
        if ((!this.parent.enableRecurrenceValidation && type === 'wrongPattern') || this.parent.enableRecurrenceValidation) {
            this.showQuickDialog('RecurrenceValidationAlert');
        }
    }

    public openDeleteAlert(): void {
        if (this.parent.activeViewOptions.readonly) {
            return;
        }
        let okButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        if (okButton) {
            okButton.innerHTML = this.l10n.getConstant('delete');
            okButton.setAttribute('aria-label', okButton.innerHTML);
        }
        let cancelButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        if (cancelButton) {
            cancelButton.innerHTML = this.l10n.getConstant('cancel');
            cancelButton.setAttribute('aria-label', cancelButton.innerHTML);
        }
        this.quickDialog.content = ((<{ [key: string]: Object }[]>this.parent.activeEventData.event).length > 1) ?
            this.l10n.getConstant('deleteMultipleContent') : this.l10n.getConstant('deleteContent');
        this.quickDialog.header = ((<{ [key: string]: Object }[]>this.parent.activeEventData.event).length > 1) ?
            this.l10n.getConstant('deleteMultipleEvent') : this.l10n.getConstant('deleteEvent');
        this.quickDialogClass('Delete');
        this.showQuickDialog('DeleteAlert');
    }

    public openValidationError(type: string, eventData?: Object | Object[]): void {
        this.quickDialog.header = this.l10n.getConstant('alert');
        this.quickDialog.content = this.l10n.getConstant(type);
        let okButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_OK);
        if (okButton) {
            okButton.innerHTML = this.l10n.getConstant('ok');
            okButton.setAttribute('aria-label', okButton.innerHTML);
        }
        let cancelButton: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        if (cancelButton) {
            cancelButton.innerHTML = this.l10n.getConstant('cancel');
            okButton.setAttribute('aria-label', cancelButton.innerHTML);
        }
        this.quickDialogClass('Alert');
        this.showQuickDialog('ValidationAlert', eventData);
    }

    private showQuickDialog(popupType: PopupType, eventData?: Object | Object[]): void {
        this.quickDialog.dataBind();
        let eventProp: PopupOpenEventArgs = {
            type: popupType, cancel: false, data: extend({}, (eventData || this.parent.activeEventData.event), null, true),
            element: this.quickDialog.element
        };
        this.parent.trigger(event.popupOpen, eventProp, (popupArgs: PopupOpenEventArgs) => {
            if (!popupArgs.cancel) {
                this.quickDialog.show();
            }
        });
    }

    private createMoreEventList(eventCollection: { [key: string]: Object }[], groupOrder: string[], groupIndex: string): HTMLElement {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let moreEventContentEle: HTMLElement = createElement('div', { className: cls.MORE_EVENT_CONTENT_CLASS });
        let moreEventWrapperEle: HTMLElement = createElement('div', { className: cls.MORE_EVENT_WRAPPER_CLASS });
        if (eventCollection.length === 0) {
            moreEventWrapperEle = createElement('div', {
                className: cls.MORE_EVENT_CONTENT_CLASS,
                innerHTML: this.l10n.getConstant('emptyContainer')
            });
        } else {
            for (let eventData of eventCollection) {
                let eventText: string = (eventData[fields.subject] || this.parent.eventSettings.fields.subject.default) as string;
                let appointmentElement: HTMLElement = createElement('div', {
                    className: cls.APPOINTMENT_CLASS,
                    attrs: {
                        'data-id': '' + eventData[fields.id],
                        'data-guid': eventData.Guid as string, 'role': 'button', 'tabindex': '0',
                        'aria-readonly': this.parent.eventBase.getReadonlyAttribute(eventData),
                        'aria-selected': 'false', 'aria-grabbed': 'true', 'aria-label': this.parent.getAnnocementString(eventData)
                    }
                });
                let templateElement: HTMLElement[];
                if (!isNullOrUndefined(this.parent.activeViewOptions.eventTemplate)) {
                    let tempId: string = this.parent.element.id + '_' + this.parent.activeViewOptions.eventTemplateName + 'eventTemplate';
                    let templateArgs: Object = util.addLocalOffsetToEvent(eventData, this.parent.eventFields);
                    templateElement = this.parent.getAppointmentTemplate()(templateArgs, this.parent, 'eventTemplate', tempId, false);
                    append(templateElement, appointmentElement);
                } else {
                    appointmentElement.appendChild(createElement('div', { className: cls.SUBJECT_CLASS, innerHTML: eventText }));
                }
                if (!isNullOrUndefined(groupIndex)) {
                    appointmentElement.setAttribute('data-group-index', groupIndex);
                }
                if (!isNullOrUndefined(eventData[fields.recurrenceRule])) {
                    let iconClass: string = (eventData[fields.id] === eventData[fields.recurrenceID]) ?
                        cls.EVENT_RECURRENCE_ICON_CLASS : cls.EVENT_RECURRENCE_EDIT_ICON_CLASS;
                    appointmentElement.appendChild(createElement('div', { className: cls.ICON + ' ' + iconClass }));
                }
                let args: EventRenderedArgs = {
                    data: extend({}, eventData, null, true) as { [key: string]: Object },
                    element: appointmentElement, cancel: false
                };
                this.parent.trigger(event.eventRendered, args, (eventArgs: EventRenderedArgs) => {
                    if (!eventArgs.cancel) {
                        moreEventWrapperEle.appendChild(appointmentElement);
                        let isPreventCrud: Boolean = this.parent.isAdaptive || this.parent.currentView === 'Year';
                        this.parent.eventBase.wireAppointmentEvents(appointmentElement, eventData, isPreventCrud);
                        this.parent.eventBase.applyResourceColor(appointmentElement, eventData, 'backgroundColor', groupOrder);
                    }
                });
            }
        }
        moreEventContentEle.appendChild(moreEventWrapperEle);
        return moreEventContentEle;
    }

    public tapHoldEventPopup(e: Event): void {
        let target: Element = closest(<HTMLElement>e.target, '.' + cls.APPOINTMENT_CLASS);
        this.isMultipleEventSelect = false;
        this.parent.selectedElements = [];
        this.isMultipleEventSelect = true;
        this.parent.eventBase.getSelectedEventElements(target);
        this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
        let guid: string = target.getAttribute('data-guid');
        let eventObj: { [key: string]: Object } = this.parent.eventBase.getEventByGuid(guid) as { [key: string]: Object };
        if (isNullOrUndefined(eventObj)) {
            return;
        }
        let eventTitle: string = (eventObj[this.parent.eventFields.subject] || this.l10n.getConstant('noTitle')) as string;
        let eventTemplate: string = `<div class="${cls.MULTIPLE_EVENT_POPUP_CLASS}"><div class="${cls.POPUP_HEADER_CLASS}">` +
            `<button class="${cls.CLOSE_CLASS}" title="${this.l10n.getConstant('close')}"></button>` +
            `<div class="${cls.SUBJECT_CLASS}">${eventTitle}</div>` +
            `<button class="${cls.EDIT_CLASS}" title="${this.l10n.getConstant('edit')}"></button>` +
            `<button class="${cls.DELETE_CLASS}" title="${this.l10n.getConstant('delete')}"></button></div></div>`;
        this.quickPopup.element.innerHTML = eventTemplate;
        let closeIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.CLOSE_CLASS) as HTMLButtonElement;
        this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeIcon, this.closeClick);
        let readonly: boolean = this.parent.activeViewOptions.readonly || eventObj[this.parent.eventFields.isReadonly] as boolean;
        let editIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.EDIT_CLASS) as HTMLButtonElement;
        this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.EDIT_ICON_CLASS, readonly, editIcon, this.editClick);
        let deleteIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.DELETE_CLASS) as HTMLButtonElement;
        this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.DELETE_ICON_CLASS, readonly, deleteIcon, this.deleteClick);
        this.beforeQuickPopupOpen(target);
    }

    private isCellBlocked(args: CellClickEventArgs): boolean {
        let tempObj: { [key: string]: Object } = {};
        tempObj[this.parent.eventFields.startTime] = this.parent.activeCellsData.startTime;
        tempObj[this.parent.eventFields.endTime] = this.parent.activeCellsData.endTime;
        tempObj[this.parent.eventFields.isAllDay] = this.parent.activeCellsData.isAllDay;
        if (this.parent.activeViewOptions.group.resources.length > 0) {
            let targetCell: HTMLElement = args.element instanceof Array ? args.element[0] : args.element;
            let groupIndex: number = parseInt(targetCell.getAttribute('data-group-index'), 10);
            this.parent.resourceBase.setResourceValues(tempObj, isNaN(groupIndex) ? null : groupIndex);
        }
        return this.parent.eventBase.isBlockRange(tempObj);
    }

    // tslint:disable-next-line:max-func-body-length
    private cellClick(args: CellClickEventArgs): void {
        let date: Date = new Date(args.startTime.getTime());
        if (!this.parent.showQuickInfo || !this.parent.eventSettings.allowAdding ||
            this.parent.currentView === 'MonthAgenda' || this.isCellBlocked(args) ||
            !this.parent.isMinMaxDate(new Date(date.setHours(0, 0, 0, 0)))) {
            this.quickPopupHide();
            return;
        }
        let targetEle: Element = args.event.target as Element;
        if (this.parent.isAdaptive) {
            this.quickPopupHide();
            let newEventClone: HTMLElement = this.parent.element.querySelector('.' + cls.NEW_EVENT_CLASS) as HTMLElement;
            if (isNullOrUndefined(newEventClone)) {
                newEventClone = createElement('div', {
                    className: cls.NEW_EVENT_CLASS,
                    innerHTML: `<div class="e-title">+ ${this.l10n.getConstant('newEvent')}</div>`
                });
            }
            let targetCell: Element = closest(targetEle, '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS);
            if (targetCell) {
                targetCell.appendChild(newEventClone);
            }
            return;
        }
        let target: Element = closest(targetEle, '.' + cls.WORK_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS + ',.' +
            cls.HEADER_CELLS_CLASS);
        if (isNullOrUndefined(target) || targetEle.classList.contains(cls.MORE_INDICATOR_CLASS)) {
            return;
        }
        let isSameTarget: Boolean = this.quickPopup.relateTo === target;
        if (isSameTarget && this.quickPopup.element.classList.contains(cls.POPUP_OPEN)) {
            let subjectElement: HTMLInputElement = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
            if (subjectElement) {
                subjectElement.focus();
            }
            return;
        }
        this.resetQuickPopupTemplates();
        let temp: { [key: string]: Object } = {};
        temp[this.parent.eventFields.startTime] = this.parent.activeCellsData.startTime;
        temp[this.parent.eventFields.endTime] = this.parent.activeCellsData.endTime;
        temp[this.parent.eventFields.isAllDay] = this.parent.activeCellsData.isAllDay;
        let quickCellPopup: HTMLElement = createElement('div', { className: cls.CELL_POPUP_CLASS });
        quickCellPopup.appendChild(this.getPopupHeader('Cell', temp));
        quickCellPopup.appendChild(this.getPopupContent('Cell', args, temp));
        quickCellPopup.appendChild(this.getPopupFooter('Cell', temp));
        let subjectElement: HTMLInputElement = quickCellPopup.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
        if (subjectElement) {
            Input.createInput({ element: subjectElement, properties: { placeholder: this.l10n.getConstant('addTitle') } });
        }
        if (!isNullOrUndefined(this.parent.eventSettings.fields.subject.default)) {
            subjectElement.value = this.parent.eventSettings.fields.subject.default;
        }
        let closeIcon: HTMLButtonElement = quickCellPopup.querySelector('.' + cls.CLOSE_CLASS) as HTMLButtonElement;
        if (closeIcon) {
            this.renderButton('e-flat e-round e-small', cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeIcon, this.popupClose);
        }
        let moreButton: HTMLButtonElement = quickCellPopup.querySelector('.' + cls.QUICK_POPUP_EVENT_DETAILS_CLASS) as HTMLButtonElement;
        if (moreButton) {
            this.renderButton('e-flat', '', false, moreButton, this.detailsClick);
        }
        let saveButton: HTMLButtonElement = quickCellPopup.querySelector('.' + cls.EVENT_CREATE_CLASS) as HTMLButtonElement;
        if (saveButton) {
            this.renderButton('e-flat e-primary', '', this.parent.activeViewOptions.readonly, saveButton, this.saveClick);
        }
        this.quickPopup.content = quickCellPopup;
        this.quickPopup.dataBind();
        this.applyFormValidation();
        if (this.morePopup) { this.morePopup.hide(); }
        this.quickPopup.relateTo = target as HTMLElement;
        this.beforeQuickPopupOpen(target);
    }

    private isSameEventClick(events: EventClickArgs): boolean {
        let isSameTarget: Boolean = this.quickPopup.relateTo === closest(<HTMLElement>events.element, '.' + cls.APPOINTMENT_CLASS);
        if (isSameTarget && this.quickPopup.element.classList.contains(cls.POPUP_OPEN)) {
            let editIcon: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.EDIT_CLASS) as HTMLButtonElement;
            if (editIcon) {
                editIcon.focus();
            }
            if (!this.parent.isAdaptive) {
                let editButton: HTMLButtonElement = this.quickPopup.element.querySelector('.' + cls.EDIT_EVENT_CLASS) as HTMLButtonElement;
                if (editButton) {
                    editButton.focus();
                }
            }
            return true;
        }
        return false;
    }

    private isQuickTemplate(type: TemplateType): boolean {
        return this.parent.quickInfoTemplates.templateType === 'Both' || this.parent.quickInfoTemplates.templateType === type;
    }

    private eventClick(events: EventClickArgs): void {
        if (this.parent.eventTooltip) {
            this.parent.eventTooltip.close();
        }
        if (!this.parent.showQuickInfo) { return; }
        if (this.parent.isAdaptive && this.isMultipleEventSelect) {
            this.updateTapHoldEventPopup(closest(<HTMLElement>events.element, '.' + cls.APPOINTMENT_CLASS));
        } else {
            let isSameTarget: Boolean = this.isSameEventClick(events);
            if (isSameTarget) {
                return;
            }
            this.resetQuickPopupTemplates();
            let eventData: { [key: string]: Object; } = <{ [key: string]: Object }>events.event;
            let quickEventPopup: HTMLElement = createElement('div', { className: cls.EVENT_POPUP_CLASS });
            quickEventPopup.appendChild(this.getPopupHeader('Event', eventData));
            quickEventPopup.appendChild(this.getPopupContent('Event', events, eventData));
            quickEventPopup.appendChild(this.getPopupFooter('Event', eventData));
            let readonly: boolean = this.parent.activeViewOptions.readonly || eventData[this.parent.eventFields.isReadonly] as boolean;
            let editAction: boolean = !this.parent.eventSettings.allowEditing || readonly;
            let deleteAction: boolean = !this.parent.eventSettings.allowDeleting || readonly;
            let editIcon: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.EDIT_CLASS) as HTMLButtonElement;
            let buttonClass: string = 'e-flat e-round e-small';
            if (editIcon) {
                this.renderButton(buttonClass, cls.ICON + ' ' + cls.EDIT_ICON_CLASS, editAction, editIcon, this.editClick);
            }
            let deleteIcon: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.DELETE_CLASS) as HTMLButtonElement;
            if (deleteIcon) {
                this.renderButton(buttonClass, cls.ICON + ' ' + cls.DELETE_ICON_CLASS, deleteAction, deleteIcon, this.deleteClick);
            }
            let closeIcon: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.CLOSE_CLASS) as HTMLButtonElement;
            if (closeIcon) {
                this.renderButton(buttonClass, cls.ICON + ' ' + cls.CLOSE_ICON_CLASS, false, closeIcon, this.popupClose);
            }
            let editButton: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.EDIT_EVENT_CLASS) as HTMLButtonElement;
            if (editButton) {
                this.renderButton('e-flat e-primary', '', editAction, editButton, this.editClick);
            }
            let deleteButton: HTMLButtonElement = quickEventPopup.querySelector('.' + cls.DELETE_EVENT_CLASS) as HTMLButtonElement;
            if (deleteButton) {
                this.renderButton('e-flat', '', deleteAction, deleteButton, this.deleteClick);
            }
            this.quickPopup.content = quickEventPopup;
            this.quickPopup.dataBind();
            if (this.morePopup && !closest(<Element>events.element, '.' + cls.MORE_EVENT_WRAPPER_CLASS)) { this.morePopup.hide(); }
            this.quickPopup.relateTo = this.parent.isAdaptive ? document.body :
                closest(<HTMLElement>events.element, '.' + cls.APPOINTMENT_CLASS) as HTMLElement;
            this.beforeQuickPopupOpen(events.element as Element);
        }
    }

    private getPopupHeader(headerType: TemplateType, headerData: { [key: string]: Object }): HTMLElement {
        let headerTemplate: HTMLElement = createElement('div', { className: cls.POPUP_HEADER_CLASS });
        if (this.isQuickTemplate(headerType) && this.parent.quickInfoTemplates.header) {
            let headerArgs: Object = extend(
                {},
                headerData,
                !isBlazor() ? { elementType: headerType.toLowerCase() } :
                    {
                        elementType: headerType.toLowerCase(),
                        startTimeValue: util.addLocalOffset(headerData[this.parent.eventFields.startTime] as Date),
                        endTimeValue: util.addLocalOffset(headerData[this.parent.eventFields.endTime] as Date)
                    },
                true
            );
            let templateId: string = this.parent.element.id;
            let headerTemp: HTMLElement[] = [].slice.call(
                this.parent.getQuickInfoTemplatesHeader()(headerArgs, this.parent, 'header', templateId + '_headerTemplate', false));
            append([].slice.call(headerTemp), headerTemplate);
        } else {
            let header: string;
            switch (headerType) {
                case 'Cell':
                    header = `<div class="${cls.POPUP_HEADER_ICON_WRAPPER}"><button class="${cls.CLOSE_CLASS}" title=` +
                        `"${this.l10n.getConstant('close')}"></button></div>`;
                    break;
                case 'Event':
                    let args: { [key: string]: Object } = this.getFormattedString(headerData);
                    header = `<div class="${cls.POPUP_HEADER_ICON_WRAPPER}">` +
                        `<button class="${cls.EDIT_CLASS + ' ' + cls.ICON}" title="${this.l10n.getConstant('edit')}"></button>` +
                        `<button class="${cls.DELETE_CLASS + ' ' + cls.ICON}" title="${this.l10n.getConstant('delete')}"></button>` +
                        `<button class="${cls.CLOSE_CLASS}" title="${this.l10n.getConstant('close')}"></button></div>` +
                        `<div class="${cls.SUBJECT_WRAP}"><div class="${cls.SUBJECT_CLASS} ${cls.TEXT_ELLIPSIS}" ` +
                        `title="${args.eventSubject}">${args.eventSubject}</div></div >`;
                    break;
            }
            let templateWrapper: HTMLElement = createElement('div', { innerHTML: header });
            append([].slice.call(templateWrapper.childNodes), headerTemplate);
        }
        return headerTemplate;
    }

    private getPopupContent(type: TemplateType, args: CellClickEventArgs | EventClickArgs, data: { [key: string]: Object }): HTMLElement {
        let contentTemplate: HTMLElement = createElement('div', { className: cls.POPUP_CONTENT_CLASS });
        if (this.isQuickTemplate(type) && this.parent.quickInfoTemplates.content) {
            let contentArgs: Object = extend(
                {},
                data,
                !isBlazor() ? { elementType: type.toLowerCase() } :
                    {
                        elementType: type.toLowerCase(),
                        startTimeValue: util.addLocalOffset(data[this.parent.eventFields.startTime] as Date),
                        endTimeValue: util.addLocalOffset(data[this.parent.eventFields.endTime] as Date)
                    },
                true);
            let templateId: string = this.parent.element.id;
            let contentTemp: HTMLElement[] = [].slice.call(
                this.parent.getQuickInfoTemplatesContent()(contentArgs, this.parent, 'content', templateId + '_contentTemplate', false));
            append([].slice.call(contentTemp), contentTemplate);
        } else {
            let content: string;
            let resourceText: string = this.getResourceText(args, type.toLowerCase());
            switch (type) {
                case 'Cell':
                    let cellDetails: { [key: string]: Object } = this.getFormattedString(data);
                    content = `<table class="${cls.POPUP_TABLE_CLASS}"><tbody><tr><td><form class="${cls.FORM_CLASS}" onsubmit=` +
                        `"return false;"><input class="${cls.SUBJECT_CLASS} ${EVENT_FIELD}" type="text" name=` +
                        `"${this.parent.eventFields.subject}" /></form></td></tr><tr><td><div class="${cls.DATE_TIME_CLASS}">` +
                        `<div class="${cls.DATE_TIME_ICON_CLASS} ${cls.ICON}"></div><div class="${cls.DATE_TIME_DETAILS_CLASS} ` +
                        `${cls.TEXT_ELLIPSIS}">${cellDetails.details}</div></div>` +
                        `${this.parent.activeViewOptions.group.resources.length > 0 ? `<div class="${cls.RESOURCE_CLASS}">` +
                            `<div class="${cls.RESOURCE_ICON_CLASS} ${cls.ICON} "></div><div class="${cls.RESOURCE_DETAILS_CLASS} ` +
                            `${cls.TEXT_ELLIPSIS}">${resourceText}</div></div>` : ''}</td></tr></tbody></table>`;
                    break;
                case 'Event':
                    let args: { [key: string]: Object } = this.getFormattedString(data);
                    content = '<div class="' + cls.DATE_TIME_CLASS + '"><div class="' + cls.DATE_TIME_ICON_CLASS + ' ' + cls.ICON +
                        '"></div><div class="' + cls.DATE_TIME_WRAPPER_CLASS + ' ' + cls.TEXT_ELLIPSIS + '"><div class="' +
                        cls.DATE_TIME_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS + '">' + args.details + '</div>';
                    if (data[this.parent.eventFields.recurrenceRule]) {
                        content += '<div class="' + cls.RECURRENCE_SUMMARY_CLASS + ' ' + cls.TEXT_ELLIPSIS + '">' +
                            this.getRecurrenceSummary(data) + '</div>';
                    }
                    content += '</div></div>';
                    if (data[this.parent.eventFields.location]) {
                        content += '<div class="' + cls.LOCATION_CLASS + '"><div class="' + cls.LOCATION_ICON_CLASS + ' ' +
                            cls.ICON + '"></div><div class="' + cls.LOCATION_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS + '">' +
                            data[this.parent.eventFields.location] + '</div></div>';
                    }
                    if (data[this.parent.eventFields.startTimezone] || data[this.parent.eventFields.endTimezone]) {
                        content += '<div class="' + cls.TIME_ZONE_CLASS + '"><div class="' + cls.TIME_ZONE_ICON_CLASS + ' ' + cls.ICON +
                            '"></div><div class="' + cls.TIME_ZONE_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS + '">' +
                            this.getTimezone(data) + '</div></div>';
                    }
                    if (data[this.parent.eventFields.description]) {
                        content += '<div class="' + cls.DESCRIPTION_CLASS + '"><div class="' + cls.DESCRIPTION_ICON_CLASS + ' ' + cls.ICON +
                            '"></div><div class="' + cls.DESCRIPTION_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS + '">' +
                            data[this.parent.eventFields.description] + '</div></div>';
                    }
                    if (this.parent.resourceCollection.length > 0) {
                        content += '<div class="' + cls.RESOURCE_CLASS + '"><div class="' + cls.RESOURCE_ICON_CLASS + ' ' + cls.ICON +
                            '"></div><div class="' + cls.RESOURCE_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS + '">' +
                            resourceText + '</div></div>';
                    }
                    break;
            }
            let templateWrapper: HTMLElement = createElement('div', { innerHTML: content });
            append([].slice.call(templateWrapper.childNodes), contentTemplate);
        }
        return contentTemplate;
    }

    private getPopupFooter(footerType: TemplateType, footerData: { [key: string]: Object }): HTMLElement {
        let footerTemplate: HTMLElement = createElement('div', { className: cls.POPUP_FOOTER_CLASS });
        if (this.isQuickTemplate(footerType) && this.parent.quickInfoTemplates.footer) {
            let footerArgs: Object = extend(
                {},
                footerData,
                !isBlazor() ? { elementType: footerType.toLowerCase() } :
                    {
                        elementType: footerType.toLowerCase(),
                        startTimeValue: util.addLocalOffset(footerData[this.parent.eventFields.startTime] as Date),
                        endTimeValue: util.addLocalOffset(footerData[this.parent.eventFields.endTime] as Date)
                    },
                true
            );
            let templateId: string = this.parent.element.id;
            let footerTemp: HTMLElement[] = [].slice.call(
                this.parent.getQuickInfoTemplatesFooter()(footerArgs, this.parent, 'footer', templateId + '_footerTemplate', false));
            append([].slice.call(footerTemp), footerTemplate);
        } else {
            let footer: string;
            switch (footerType) {
                case 'Cell':
                    footer = `<button class="${cls.QUICK_POPUP_EVENT_DETAILS_CLASS + ' ' + cls.TEXT_ELLIPSIS}" title=` +
                        `"${this.l10n.getConstant('moreDetails')}">${this.l10n.getConstant('moreDetails')}</button>` +
                        `<button class="${cls.EVENT_CREATE_CLASS} ${cls.TEXT_ELLIPSIS}" title="${this.l10n.getConstant('save')}">` +
                        `${this.l10n.getConstant('save')}</button>`;
                    break;
                case 'Event':
                    footer = `${this.parent.isAdaptive ? '' : `<button class="${cls.EDIT_EVENT_CLASS} ` +
                        `${cls.TEXT_ELLIPSIS}" title="${this.l10n.getConstant('edit')}">${this.l10n.getConstant('edit')}</button>` +
                        `<button class="${cls.DELETE_EVENT_CLASS} ${cls.TEXT_ELLIPSIS}" title="${this.l10n.getConstant('delete')}">` +
                        `${this.l10n.getConstant('delete')}</button>`}`;
                    break;
            }
            let templateWrapper: HTMLElement = createElement('div', { innerHTML: footer });
            append([].slice.call(templateWrapper.childNodes), footerTemplate);
        }
        return footerTemplate;
    }

    public getResourceText(args: CellClickEventArgs | EventClickArgs, type: string): string {
        if (this.parent.resourceCollection.length === 0) {
            return null;
        }
        let resourceValue: string = '';
        if (this.parent.activeViewOptions.group.resources.length === 0) {
            let resourceCollection: ResourcesModel = this.parent.resourceBase.resourceCollection.slice(-1)[0];
            let resourceData: { [key: string]: number }[] = resourceCollection.dataSource as { [key: string]: number }[];
            let resourceIndex: number = 0;
            if (type === 'event') {
                let eventData: { [key: string]: Object } = args.event as { [key: string]: Object };
                for (let data of resourceData) {
                    let resourceId: number | number[] = eventData[resourceCollection.field] as number | number[];
                    if (resourceId instanceof Array) {
                        if (resourceId.indexOf(data[resourceCollection.idField]) > -1) {
                            let id: number = resourceId[resourceId.indexOf(data[resourceCollection.idField])];
                            let resource: { [key: string]: number } = resourceData.filter((e: { [key: string]: number }) =>
                                e[resourceCollection.idField] === id)[0];
                            resourceValue += (resourceValue === '') ? resource[resourceCollection.textField] :
                                ', ' + resource[resourceCollection.textField];
                        }
                    } else if (data[resourceCollection.idField] === resourceId) {
                        resourceValue = data[resourceCollection.textField].toString();
                    }
                }
            } else {
                resourceValue = resourceData[0][resourceCollection.textField].toString();
            }
        } else {
            if (type === 'event') {
                let eventData: { [key: string]: Object } = args.event as { [key: string]: Object };
                let resourceData: Object | string | number;
                let lastResource: ResourcesModel;
                for (let i: number = this.parent.resourceBase.resourceCollection.length - 1; i >= 0; i--) {
                    resourceData = eventData[this.parent.resourceBase.resourceCollection[i].field];
                    if (!isNullOrUndefined(resourceData)) {
                        lastResource = this.parent.resourceBase.resourceCollection[i];
                        break;
                    }
                }
                if (!Array.isArray(resourceData)) {
                    resourceData = [resourceData];
                }
                let resNames: string[] = [];
                let lastResourceData: { [key: string]: Object }[] = lastResource.dataSource as { [key: string]: Object }[];
                (resourceData as Object[]).map((value: string | number) => {
                    let text: string;
                    let i: number = util.findIndexInData(lastResourceData, lastResource.idField, value as string);
                    if (i > -1) {
                        text = lastResourceData[i][lastResource.textField] as string;
                    }
                    if (text) { resNames.push(text); }
                });
                resourceValue = resNames.join(', ');
            } else {
                let argsData: CellClickEventArgs = args as CellClickEventArgs;
                let groupIndex: number = !isNullOrUndefined(argsData.groupIndex) ? argsData.groupIndex : 0;
                let resourceDetails: TdData = this.parent.resourceBase.lastResourceLevel[groupIndex];
                resourceValue = resourceDetails.resourceData[resourceDetails.resource.textField] as string;
            }
        }
        return resourceValue;
    }

    private getFormattedString(eventData: { [key: string]: Object }): { [key: string]: Object } {
        let fields: EventFieldsMapping = this.parent.eventFields;
        let eventSubject: string = (eventData[fields.subject] || this.l10n.getConstant('noTitle')) as string;
        let startDate: Date = eventData[fields.startTime] as Date;
        let endDate: Date = eventData[fields.endTime] as Date;
        let format: string = 'MMMM d, y';
        let startDateDetails: string = this.getDateFormat(startDate, 'long', format);
        let endDateDetails: string = (eventData[fields.isAllDay] && endDate.getHours() === 0 && endDate.getMinutes() === 0) ?
            this.getDateFormat(util.addDays(new Date(endDate.getTime()), -1), 'long', format) :
            this.getDateFormat(endDate, 'long', format);
        let startTimeDetail: string = this.parent.getTimeString(startDate);
        let endTimeDetail: string = this.parent.getTimeString(endDate);
        let details: string = '';
        let spanLength: number = endDate.getDate() !== startDate.getDate() &&
            (endDate.getTime() - startDate.getTime()) / (60 * 60 * 1000) < 24 ? 1 : 0;
        if (eventData[fields.isAllDay]) {
            details = startDateDetails + ' (' + this.l10n.getConstant('allDay') + ')';
            if (((endDate.getTime() - startDate.getTime()) / util.MS_PER_DAY) > 1) {
                details += '&nbsp;-&nbsp;' + endDateDetails + ' (' + this.l10n.getConstant('allDay') + ')';
            }
        } else if ((((endDate.getTime() - startDate.getTime()) / util.MS_PER_DAY) >= 1) || spanLength > 0) {
            details = startDateDetails + ' (' + startTimeDetail + ')' + '&nbsp;-&nbsp;' + endDateDetails + ' (' + endTimeDetail + ')';
        } else {
            details = startDateDetails + ' (' + (startTimeDetail + '&nbsp;-&nbsp;' + endTimeDetail) + ')';
        }
        return { eventSubject: eventSubject, details: details };
    }

    public moreEventClick(data: EventClickArgs, endDate: Date, groupIndex?: string): void {
        this.quickPopupHide(true);
        let moreEventContentEle: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_CONTENT_CLASS);
        if (moreEventContentEle) {
            remove(moreEventContentEle);
        }
        let selectedDate: string = ((data.date).getTime()).toString();
        let target: Element = closest(<Element>data.element, '.' + cls.MORE_INDICATOR_CLASS + ',.' + cls.WORK_CELLS_CLASS);
        let day: string = this.parent.globalize.formatDate(data.date, { format: 'E', calendar: this.parent.getCalendarMode() });
        this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DAY_CLASS).innerHTML = util.capitalizeFirstWord(day, 'single');
        let dateElement: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS);
        dateElement.innerHTML = this.getDateFormat(data.date, 'd', 'd');
        dateElement.setAttribute('data-date', selectedDate);
        dateElement.setAttribute('data-end-date', endDate.getTime().toString());
        let groupOrder: string[];
        if (!isNullOrUndefined(groupIndex)) {
            dateElement.setAttribute('data-group-index', groupIndex);
            groupOrder = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)].groupOrder;
        }
        let moreEventElements: HTMLElement = this.createMoreEventList(data.event as { [key: string]: Object }[], groupOrder, groupIndex);
        this.morePopup.element.querySelector('.' + cls.MORE_EVENT_POPUP_CLASS).appendChild(moreEventElements);
        removeClass(this.morePopup.element.querySelector('.' + cls.MORE_EVENT_DATE_HEADER_CLASS).childNodes, cls.CURRENTDATE_CLASS);
        if (util.resetTime(data.date).getTime() === util.resetTime(this.parent.getCurrentTime()).getTime()) {
            addClass(this.morePopup.element.querySelector('.' + cls.MORE_EVENT_DATE_HEADER_CLASS).childNodes, cls.CURRENTDATE_CLASS);
        }
        if (!this.parent.isAdaptive) {
            if (this.parent.currentView.indexOf('Timeline') !== -1) {
                let gIndex: string = target.getAttribute('data-group-index');
                let startDate: Date = new Date(parseInt(target.getAttribute('data-start-date'), 10));
                startDate.setHours(startDate.getHours(), startDate.getMinutes(), 0);
                let tdDate: string = this.parent.getMsFromDate(startDate).toString();
                if (isNullOrUndefined(gIndex)) {
                    this.morePopup.relateTo = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                        ' tbody tr td[data-date="' + tdDate + '"]') as HTMLElement;
                } else {
                    this.morePopup.relateTo = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS +
                        ' tbody tr td[data-group-index="' + gIndex + '"][data-date="' + tdDate + '"]') as HTMLElement;
                    if (isNullOrUndefined(this.morePopup.relateTo)) {
                        let workCells: HTMLElement[] = [].slice.call(this.parent.element.querySelectorAll('.' + cls.CONTENT_WRAP_CLASS +
                            ' tbody tr td[data-group-index="' + gIndex + '"]'));
                        for (let i: number = 0; i < workCells.length; i++) {
                            let date: string = workCells[i].getAttribute('data-date');
                            if (date < tdDate) {
                                this.morePopup.relateTo = workCells[i] as HTMLElement;
                            }
                        }
                    }
                }
            } else {
                this.morePopup.relateTo = closest(<Element>target, '.' + cls.WORK_CELLS_CLASS) as HTMLElement;
            }
        }
        this.parent.renderTemplates();
        let eventProp: PopupOpenEventArgs = { type: 'EventContainer', cancel: false, element: this.morePopup.element };
        if (!isBlazor()) {
            eventProp.data = data;
        }
        this.parent.trigger(event.popupOpen, eventProp, (popupArgs: PopupOpenEventArgs) => {
            if (!popupArgs.cancel) {
                this.morePopup.show();
            }
        });
    }

    private saveClick(): void {
        this.isCrudAction = true;
        this.quickPopupHide();
    }

    private detailsClick(): void {
        let subjectEle: HTMLInputElement = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLInputElement;
        if (subjectEle && subjectEle.value !== '') {
            let args: CellClickEventArgs = <CellClickEventArgs>extend(this.parent.activeCellsData, { subject: subjectEle.value });
        }
        this.isCrudAction = false;
        this.fieldValidator.destroyToolTip();
        this.quickPopupHide();
        this.parent.eventWindow.openEditor(this.parent.activeCellsData, 'Add');
    }

    private editClick(): void {
        this.quickPopupHide(true);
        let data: { [key: string]: Object } = this.parent.activeEventData.event as { [key: string]: Object };
        this.parent.currentAction = 'EditSeries';
        if (!isNullOrUndefined(data[this.parent.eventFields.recurrenceRule])) {
            this.parent.currentAction = 'EditOccurrence';
            this.openRecurrenceAlert();
        } else {
            this.parent.eventWindow.openEditor(data, this.parent.currentAction);
        }
    }

    public deleteClick(): void {
        this.quickPopupHide(true);
        this.parent.currentAction = 'Delete';
        if ((<{ [key: string]: Object }>this.parent.activeEventData.event)[this.parent.eventFields.recurrenceRule]) {
            this.openRecurrenceAlert();
        } else {
            this.openDeleteAlert();
        }
    }
    private updateMoreEventContent(): void {
        if (this.morePopup.element.classList.contains('e-popup-close')) {
            return;
        }
        let moreEventContentEle: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_CONTENT_CLASS);
        if (moreEventContentEle) {
            remove(moreEventContentEle);
        }
        let dateElement: Element = this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS);
        let startDate: Date = new Date(parseInt(dateElement.getAttribute('data-date'), 10));
        let endDate: Date = new Date(parseInt(dateElement.getAttribute('data-end-date'), 10));
        let groupIndex: string = dateElement.getAttribute('data-group-index');
        let data: TdData;
        let groupOrder: string[];
        if (!isNullOrUndefined(groupIndex)) {
            data = this.parent.resourceBase.lastResourceLevel[parseInt(groupIndex, 10)];
            groupOrder = data.groupOrder;
        }
        let filteredEvents: Object[] = this.parent.eventBase.filterEvents(startDate, endDate, this.parent.eventsProcessed, data);
        let moreElement: HTMLElement = this.createMoreEventList(filteredEvents as { [key: string]: Object }[], groupOrder, groupIndex);
        this.morePopup.element.querySelector('.' + cls.MORE_EVENT_POPUP_CLASS).appendChild(moreElement);
    }

    private closeClick(): void {
        this.quickPopupHide();
        this.morePopup.hide();
    }

    private dialogButtonClick(event: Event): void {
        this.quickDialog.hide();
        let target: HTMLElement = event.target as HTMLElement;
        let cancelBtn: Element = this.quickDialog.element.querySelector('.' + cls.QUICK_DIALOG_ALERT_CANCEL);
        let eventData: { [key: string]: Object } = this.parent.activeEventData.event as { [key: string]: Object };
        if (target.classList.contains(cls.QUICK_DIALOG_OCCURRENCE_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteOccurrence' : 'EditOccurrence';
            switch (this.parent.currentAction) {
                case 'EditOccurrence':
                    this.parent.eventWindow.openEditor(eventData, this.parent.currentAction);
                    break;
                case 'DeleteOccurrence':
                    this.parent.crudModule.deleteEvent(eventData, this.parent.currentAction);
                    break;
            }
        } else if (target.classList.contains(cls.QUICK_DIALOG_FOLLOWING_EVENTS_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteFollowingEvents' : 'EditFollowingEvents';
            switch (this.parent.currentAction) {
                case 'EditFollowingEvents':
                    this.parent.eventWindow.openEditor(eventData, this.parent.currentAction);
                    break;
                case 'DeleteFollowingEvents':
                    this.parent.crudModule.deleteEvent(eventData, this.parent.currentAction);
                    break;
            }
        } else if (target.classList.contains(cls.QUICK_DIALOG_SERIES_CLASS)) {
            this.parent.currentAction = (this.parent.currentAction === 'Delete') ? 'DeleteSeries' : 'EditSeries';
            switch (this.parent.currentAction) {
                case 'EditSeries':
                    this.parent.eventWindow.openEditor(this.parent.eventBase.getParentEvent(eventData, true), this.parent.currentAction);
                    break;
                case 'DeleteSeries':
                    this.parent.crudModule.deleteEvent(eventData, this.parent.currentAction);
                    break;
            }
        } else if (target.classList.contains(cls.QUICK_DIALOG_DELETE_CLASS)) {
            this.parent.crudModule.deleteEvent(eventData, this.parent.currentAction);
        } else if (!cancelBtn.classList.contains(cls.DISABLE_CLASS) && (target.classList.contains(cls.QUICK_DIALOG_ALERT_OK) ||
            (target.classList.contains(cls.QUICK_DIALOG_ALERT_CANCEL) && !cancelBtn.classList.contains(cls.QUICK_DIALOG_CANCEL_CLASS)))) {
            this.parent.uiStateValues.isIgnoreOccurrence = target.classList.contains(cls.QUICK_DIALOG_ALERT_CANCEL);
            this.parent.eventWindow.eventSave(this.l10n.getConstant('ok'));
        }
    }

    private updateTapHoldEventPopup(target: Element): void {
        let selectedElements: Element[] = this.parent.eventBase.getSelectedEventElements(target);
        this.parent.activeEventData = this.parent.eventBase.getSelectedEvents();
        if (selectedElements.length > 0) {
            let eventObj: Object = this.parent.eventBase.getEventByGuid(selectedElements[0].getAttribute('data-guid'));
            let titleContent: string = (selectedElements.length === 1) ?
                ((<{ [key: string]: Object }>eventObj)[this.parent.eventFields.subject] || this.l10n.getConstant('noTitle')) as string :
                '(' + selectedElements.length + ')' + '&nbsp;' + this.l10n.getConstant('selectedItems');
            this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS).innerHTML = titleContent;
            if (selectedElements.length > 1) {
                addClass([this.quickPopup.element.querySelector('.' + cls.EDIT_ICON_CLASS)], cls.HIDDEN_CLASS);
            } else {
                removeClass([this.quickPopup.element.querySelector('.' + cls.EDIT_ICON_CLASS)], cls.HIDDEN_CLASS);
            }
        } else {
            this.parent.selectedElements = [];
            this.quickPopupHide();
        }
    }

    private getTimezone(event: { [key: string]: Object; }): string {
        let zoneDetails: string = '';
        zoneDetails += event[this.parent.eventFields.startTimezone] as string || '';
        zoneDetails += zoneDetails === '' ? '' : ' - ';
        zoneDetails += event[this.parent.eventFields.endTimezone] as string || '';
        return zoneDetails;
    }

    private getRecurrenceSummary(event: { [key: string]: Object; }): string {
        let recurrenceEditor: RecurrenceEditor = this.parent.eventWindow.getRecurrenceEditorInstance();
        if (recurrenceEditor) {
            let ruleSummary: string = recurrenceEditor.getRuleSummary(<string>event[this.parent.eventFields.recurrenceRule]);
            return ruleSummary.charAt(0).toUpperCase() + ruleSummary.slice(1);
        }
        return '';
    }

    private getDateFormat(date: Date, skeletonString: string, formatString: string): string {
        return util.capitalizeFirstWord(
            isBlazor() ? this.parent.globalize.formatDate(date, { format: formatString, calendar: this.parent.getCalendarMode() }) :
                this.parent.globalize.formatDate(date, { skeleton: skeletonString, calendar: this.parent.getCalendarMode() }),
            'single'
        );
    }

    private getDataFromTarget(target: Element): Object {
        if (target.classList.contains(cls.APPOINTMENT_CLASS)) {
            return this.parent.activeEventData.event;
        }
        // Depricated cells data in quick popups
        let eventObj: { [key: string]: Object } = {
            startTime: this.parent.activeCellsData.startTime,
            endTime: this.parent.activeCellsData.endTime,
            isAllDay: this.parent.activeCellsData.isAllDay,
            groupIndex: this.parent.activeCellsData.groupIndex
        };
        let cellsData: Object = this.parent.activeCellsData;
        this.parent.eventWindow.convertToEventData(cellsData as { [key: string]: Object }, eventObj);
        return eventObj;
    }

    private beforeQuickDialogClose(): void {
        let args: PopupCloseEventArgs = {
            type: (isNullOrUndefined(this.parent.activeEventData.event)) ? 'ValidationAlert' :
                !isNullOrUndefined((<{ [key: string]: Object }>this.parent.activeEventData.event)
                [this.parent.eventFields.recurrenceRule]) ? 'RecurrenceAlert' : 'DeleteAlert',
            cancel: false, data: this.parent.activeEventData.event, element: this.quickDialog.element
        };
        this.parent.trigger(event.popupClose, args, (popupCloseArgs: PopupCloseEventArgs) => {
            popupCloseArgs = this.serializingData(popupCloseArgs);
            if (!popupCloseArgs.cancel) {
                this.parent.eventBase.focusElement();
            }
        });
    }

    private beforeQuickPopupOpen(target: Element, success?: Boolean): void {
        if (isBlazor() && this.isQuickInfoTemplates() && isNullOrUndefined(success)) {
            this.updateQuickPopupTemplates(target);
            return;
        }
        this.parent.renderTemplates();
        let isEventPopup: Element = this.quickPopup.element.querySelector('.' + cls.EVENT_POPUP_CLASS);
        let popupType: PopupType = this.parent.isAdaptive ? isEventPopup ? 'ViewEventInfo' : 'EditEventInfo' : 'QuickInfo';
        let eventProp: PopupOpenEventArgs = {
            type: popupType, cancel: false, data: extend({}, this.getDataFromTarget(target), null, true),
            target: target, element: this.quickPopup.element
        };
        this.parent.trigger(event.popupOpen, eventProp, (popupArgs: PopupOpenEventArgs) => {
            if (popupArgs.cancel) {
                this.quickPopupHide();
                this.destroyButtons();
                if (popupArgs.element.classList.contains(cls.POPUP_OPEN)) {
                    this.quickPopupClose();
                }
                this.resetQuickPopupTemplates();
                util.removeChildren(this.quickPopup.element);
                this.isMultipleEventSelect = false;
            } else {
                let display: string = this.quickPopup.element.style.display;
                this.quickPopup.element.style.display = 'block';
                if (this.parent.isAdaptive) {
                    this.quickPopup.element.removeAttribute('style');
                    this.quickPopup.element.style.display = 'block';
                    this.quickPopup.element.style.height = formatUnit((popupType === 'EditEventInfo') ? 65 : window.innerHeight);
                } else {
                    this.quickPopup.offsetX = 10;
                    this.quickPopup.collision = { X: this.parent.enableRtl ? 'flip' : 'none', Y: 'fit' };
                    this.quickPopup.position = { X: this.parent.enableRtl ? 'left' : 'right', Y: 'top' };
                    this.quickPopup.dataBind();
                    this.quickPopup.refreshPosition(null, true);
                    let collide: string[] = isCollide(this.quickPopup.element, this.parent.element);
                    if (collide.indexOf(this.parent.enableRtl ? 'left' : 'right') > -1) {
                        this.quickPopup.offsetX = -(target as HTMLElement).offsetWidth - 10 - this.quickPopup.element.offsetWidth;
                        this.quickPopup.dataBind();
                        let leftCollide: string[] = isCollide(this.quickPopup.element, this.parent.element);
                        if (leftCollide.indexOf('left') > -1) {
                            this.quickPopup.position = { X: 'center', Y: 'center' };
                            this.quickPopup.collision = { X: 'fit', Y: 'fit' };
                            this.quickPopup.offsetX = -(this.quickPopup.element.offsetWidth / 2);
                            this.quickPopup.dataBind();
                        }
                    }
                    if (this.parent.virtualScrollModule && (collide.indexOf('top') > -1 || collide.indexOf('bottom') > -1)) {
                        let element: HTMLElement = this.parent.element.querySelector('.' + cls.CONTENT_WRAP_CLASS + ' table');
                        let translateY: number = util.getTranslateY(element);
                        this.quickPopup.offsetY = translateY;
                        this.quickPopup.dataBind();
                    }
                }
                if (isEventPopup) {
                    this.applyEventColor();
                }
                this.quickPopup.element.style.display = display;
                this.quickPopup.dataBind();
                this.quickPopup.show();
            }
        });
    }

    private isQuickInfoTemplates(): boolean {
        if (!isNullOrUndefined(this.parent.quickInfoTemplates.header || this.parent.quickInfoTemplates.content
            || this.parent.quickInfoTemplates.footer)) {
            return true;
        }
        return false;
    }

    private applyEventColor(): void {
        let colorField: string = '';
        if (this.parent.currentView === 'Agenda' || this.parent.currentView === 'MonthAgenda') {
            colorField = this.parent.enableRtl ? 'border-right-color' : 'border-left-color';
        } else {
            colorField = 'background-color';
        }
        // tslint:disable-next-line:no-any
        let color: string = (<HTMLElement>this.parent.activeEventData.element).style[<any>colorField];
        if (color === '') {
            return;
        }
        let colorEle: HTMLElement = this.quickPopup.element.querySelector('.' + cls.POPUP_HEADER_CLASS) as HTMLElement;
        let footerEle: HTMLElement = this.quickPopup.element.querySelector('.' + cls.POPUP_FOOTER_CLASS) as HTMLElement;
        if (footerEle && footerEle.offsetParent) {
            colorEle = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLElement;
            if (colorEle) {
                colorEle.style.borderLeftColor = color;
                color = `rgba(${color.match(/\d+/g).join()},0.3)`;
            }
        }
        if (colorEle) {
            colorEle.style.backgroundColor = color;
        }
    }

    private quickPopupOpen(): void {
        if (this.parent.isAdaptive) {
            this.quickPopup.element.style.top = '0px';
            return;
        }
        if (this.quickPopup.element.querySelector('.' + cls.CELL_POPUP_CLASS)) {
            let subjectElement: HTMLElement = this.quickPopup.element.querySelector('.' + cls.SUBJECT_CLASS) as HTMLElement;
            if (subjectElement) {
                (<HTMLInputElement>subjectElement).focus();
            }
        } else {
            let editElement: HTMLElement = this.quickPopup.element.querySelector('.' + cls.EDIT_EVENT_CLASS) as HTMLElement;
            if (editElement) {
                (<HTMLInputElement>editElement).focus();
            }
            let editIcon: HTMLElement = this.quickPopup.element.querySelector('.' + cls.EDIT_CLASS) as HTMLElement;
            if (editIcon) {
                (<HTMLInputElement>editIcon).focus();
            }
        }
    }

    private updateQuickPopupTemplates(target: Element): void {
        let templateReady: { header: boolean, content: boolean, footer: boolean } = {
            header: this.parent.quickInfoTemplates.header ? false : true,
            content: this.parent.quickInfoTemplates.content ? false : true,
            footer: this.parent.quickInfoTemplates.footer ? false : true
        };
        if (this.parent.quickInfoTemplates.header) {
            updateBlazorTemplate(
                this.parent.element.id + '_headerTemplate', 'HeaderTemplate', this.parent.quickInfoTemplates, null, () => {
                    templateReady.header = true;
                    this.quickPopupShow(templateReady, target);
                });
        }
        if (this.parent.quickInfoTemplates.content) {
            updateBlazorTemplate(
                this.parent.element.id + '_contentTemplate', 'ContentTemplate', this.parent.quickInfoTemplates, null, () => {
                    templateReady.content = true;
                    this.quickPopupShow(templateReady, target);
                });
        }
        if (this.parent.quickInfoTemplates.footer) {
            updateBlazorTemplate(
                this.parent.element.id + '_footerTemplate', 'FooterTemplate', this.parent.quickInfoTemplates, null, () => {
                    templateReady.footer = true;
                    this.quickPopupShow(templateReady, target);
                });
        }
    }

    private quickPopupShow(templateReady: { header: boolean, content: boolean, footer: boolean }, target: Element): void {
        if (templateReady.header && templateReady.content && templateReady.footer) {
            this.beforeQuickPopupOpen(target, true);
        }
    }

    private resetQuickPopupTemplates(): void {
        if (isBlazor() && this.isQuickInfoTemplates()) {
            removeClass([this.quickPopup.element], cls.POPUP_OPEN);
            addClass([this.quickPopup.element], cls.POPUP_CLOSE);
            if (this.parent.quickInfoTemplates.header) {
                resetBlazorTemplate(this.parent.element.id + '_headerTemplate', 'HeaderTemplate');
            }
            if (this.parent.quickInfoTemplates.content) {
                resetBlazorTemplate(this.parent.element.id + '_contentTemplate', 'ContentTemplate');
            }
            if (this.parent.quickInfoTemplates.footer) {
                resetBlazorTemplate(this.parent.element.id + '_footerTemplate', 'FooterTemplate');
            }
            this.parent.resetTemplates();
        }
    }

    private quickPopupClose(): void {
        this.resetQuickPopupTemplates();
        this.parent.eventBase.focusElement();
        this.quickPopup.relateTo = cls.WORK_CELLS_CLASS;
        this.fieldValidator.destroyToolTip();
        if (this.quickPopup.element.querySelectorAll('.e-formvalidator').length) {
            this.fieldValidator.destroy();
        }
        this.destroyButtons();
        util.removeChildren(this.quickPopup.element);
    }

    private morePopupOpen(): void {
        if (this.parent.isAdaptive) {
            this.morePopup.element.style.top = '0px';
            this.morePopup.element.style.left = '0px';
            this.morePopup.element.style.height = formatUnit(window.innerHeight);
            return;
        }
        (this.morePopup.element.querySelector('.' + cls.MORE_EVENT_HEADER_DATE_CLASS) as HTMLElement).focus();
        this.morePopup.refreshPosition();
    }

    private morePopupClose(): void {
        let moreWrapper: Element = this.parent.element.querySelector('.' + cls.MORE_EVENT_WRAPPER_CLASS);
        if (moreWrapper) {
            remove(moreWrapper);
        }
    }

    private popupClose(): void {
        this.isCrudAction = false;
        this.quickPopupHide(true);
    }

    public quickPopupHide(hideAnimation?: Boolean): void {
        if (!this.quickPopup.element.classList.contains(cls.POPUP_OPEN)) {
            return;
        }
        let isCellPopup: Element = this.quickPopup.element.querySelector('.' + cls.CELL_POPUP_CLASS);
        let popupData: Object;
        if (isCellPopup) {
            let formvalidator: Element = this.quickPopup.element.querySelector('.e-formvalidator');
            if (this.isCrudAction && formvalidator && !((formvalidator as EJ2Instance).ej2_instances[0] as FormValidator).validate()) {
                return;
            }
            let fields: EventFieldsMapping = this.parent.eventFields;
            let saveObj: { [key: string]: Object } = this.parent.eventWindow.getObjectFromFormData(cls.POPUP_WRAPPER_CLASS) as
                { [key: string]: Object };
            this.parent.eventWindow.setDefaultValueToObject(saveObj);
            saveObj[fields.id] = this.parent.eventBase.getEventMaxID();
            saveObj[fields.startTime] = this.parent.activeCellsData.startTime;
            saveObj[fields.endTime] = this.parent.activeCellsData.endTime;
            saveObj[fields.isAllDay] = this.parent.activeCellsData.isAllDay;
            if (this.parent.resourceBase) {
                this.parent.resourceBase.setResourceValues(saveObj);
            }
            popupData = saveObj;
        } else {
            popupData = this.parent.activeEventData.event;
        }
        let isEventPopup: Element = this.quickPopup.element.querySelector('.' + cls.EVENT_POPUP_CLASS);
        let args: PopupCloseEventArgs = {
            type: this.parent.isAdaptive ? isEventPopup ? 'ViewEventInfo' : 'EditEventInfo' : 'QuickInfo',
            cancel: false, data: popupData, element: this.quickPopup.element,
            target: (isCellPopup ? this.parent.activeCellsData.element : this.parent.activeEventData.element) as Element
        };
        this.parent.trigger(event.popupClose, args, (popupCloseArgs: PopupCloseEventArgs) => {
            popupCloseArgs = this.serializingData(popupCloseArgs);
            if (!popupCloseArgs.cancel) {
                if (this.quickPopup.element.classList.contains('e-popup-open')) {
                    if (isCellPopup && this.isCrudAction) {
                        this.parent.currentAction = 'Add';
                        this.parent.crudModule.addEvent(popupCloseArgs.data);
                    }
                    if (hideAnimation) {
                        let animation: AnimationModel = this.quickPopup.hideAnimation;
                        this.quickPopup.hideAnimation = null;
                        this.quickPopup.hide();
                        this.quickPopup.hideAnimation = animation;
                    } else {
                        this.quickPopup.hide();
                    }
                    this.isMultipleEventSelect = false;
                    this.isCrudAction = false;
                }
            }
        });
    }

    public serializingData(popupCloseArgs: PopupCloseEventArgs): PopupCloseEventArgs {
        if (isBlazor()) {
            let eventFields: EventFieldsMapping = this.parent.eventFields;
            if (popupCloseArgs.data) {
                let eventObj: { [key: string]: Date } = popupCloseArgs.data as { [key: string]: Date };
                eventObj[eventFields.startTime] = this.parent.getDateTime(eventObj[eventFields.startTime]);
                eventObj[eventFields.endTime] = this.parent.getDateTime(eventObj[eventFields.endTime]);
            }
            if (popupCloseArgs.element) {
                popupCloseArgs.element = getElement(popupCloseArgs.element);
            }
            if (popupCloseArgs.target) {
                popupCloseArgs.target = getElement(popupCloseArgs.target);
            }
        }
        return popupCloseArgs;
    }

    private navigationClick(e: Event): void {
        let navigateEle: Element = closest((e.target as Element), '.' + cls.NAVIGATE_CLASS);
        if (!isNullOrUndefined(navigateEle)) {
            let date: Date = this.parent.getDateFromElement(e.currentTarget as HTMLTableCellElement);
            if (this.parent.isServerRenderer()) {
                date = new Date(+date - (date.getTimezoneOffset() * 60000));
            }
            if (!isNullOrUndefined(date)) {
                this.closeClick();
                this.parent.setScheduleProperties({ selectedDate: date });
                this.parent.changeView(this.parent.getNavigateView(), e);
            }
        }
    }

    private documentClick(e: { event: Event }): void {
        let target: Element = e.event.target as Element;
        let classNames: string = '.' + cls.POPUP_WRAPPER_CLASS + ',.' + cls.HEADER_CELLS_CLASS + ',.' + cls.ALLDAY_CELLS_CLASS +
            ',.' + cls.WORK_CELLS_CLASS + ',.' + cls.APPOINTMENT_CLASS + ',.e-popup';
        let popupWrap: Element = this.parent.element.querySelector('.' + cls.POPUP_WRAPPER_CLASS);
        if (popupWrap && popupWrap.childElementCount > 0 && !closest(target, classNames)) {
            this.quickPopupHide();
        }
        let tar: Element = this.parent.element.querySelector('.' + cls.INLINE_SUBJECT_CLASS);
        if (tar && tar !== target && this.parent.allowInline) {
            this.parent.inlineModule.documentClick();
        }
        if (closest(target, '.' + cls.APPOINTMENT_CLASS + ',.' + cls.HEADER_CELLS_CLASS)) {
            this.parent.removeNewEventElement();
        }
        if (!closest(target, classNames)) {
            this.quickPopupHide();
            this.parent.removeNewEventElement();
        }
        if (!closest(target, '.' + cls.MORE_POPUP_WRAPPER_CLASS) && (target.classList &&
            !target.classList.contains(cls.MORE_INDICATOR_CLASS))
            && (!closest(target, '.' + cls.POPUP_OPEN)) && !closest(target, '.' + cls.WORK_CELLS_CLASS)) {
            this.morePopup.hide();
        }
    }

    public onClosePopup(): void {
        this.quickPopupHide();
        this.parent.eventBase.focusElement();
    }

    private addEventListener(): void {
        this.parent.on(event.cellClick, this.cellClick, this);
        this.parent.on(event.eventClick, this.eventClick, this);
        this.parent.on(event.documentClick, this.documentClick, this);
        this.parent.on(event.dataReady, this.updateMoreEventContent, this);
    }

    private removeEventListner(): void {
        this.parent.off(event.cellClick, this.cellClick);
        this.parent.off(event.eventClick, this.eventClick);
        this.parent.off(event.documentClick, this.documentClick);
        this.parent.off(event.dataReady, this.updateMoreEventContent);
    }

    private destroyButtons(): void {
        let buttonCollections: HTMLElement[] = [].slice.call(this.quickPopup.element.querySelectorAll('.e-control.e-btn'));
        for (let button of buttonCollections) {
            let instance: Button = (button as EJ2Instance).ej2_instances[0] as Button;
            if (instance) {
                instance.destroy();
            }
        }
    }

    public refreshQuickDialog(): void {
        if (this.quickDialog.element) {
            this.quickDialog.destroy();
            remove(this.quickDialog.element);
            this.quickDialog.element = null;
        }
        this.renderQuickDialog();
    }

    public refreshQuickPopup(): void {
        if (this.quickPopup.element) {
            this.quickPopup.destroy();
            remove(this.quickPopup.element);
            this.quickPopup.element = null;
        }
        this.renderQuickPopup();
    }

    public refreshMorePopup(): void {
        if (this.morePopup.element) {
            this.morePopup.destroy();
            remove(this.morePopup.element);
            this.morePopup.element = null;
        }
        this.renderMorePopup();
    }

    public destroy(): void {
        if (this.quickPopup.element.querySelectorAll('.e-formvalidator').length) {
            this.fieldValidator.destroy();
        }
        this.removeEventListner();
        this.destroyButtons();
        this.quickPopup.destroy();
        remove(this.quickPopup.element);
        this.morePopup.destroy();
        remove(this.morePopup.element);
        if (this.quickDialog.element) {
            this.quickDialog.destroy();
            remove(this.quickDialog.element);
            this.quickDialog.element = null;
        }
    }
}