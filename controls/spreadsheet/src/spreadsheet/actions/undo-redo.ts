import { Spreadsheet, locale, deleteImage, createImageElement } from '../../spreadsheet/index';
import { performUndoRedo, updateUndoRedoCollection, enableToolbarItems, ICellRenderer, completeAction } from '../common/index';
import { UndoRedoEventArgs, setActionData, getBeforeActionData, updateAction, initiateFilterUI } from '../common/index';
import { BeforeActionData, PreviousCellDetails, CollaborativeEditArgs, setUndoRedo } from '../common/index';
import { selectRange, clearUndoRedoCollection, setMaxHgt, getMaxHgt, setRowEleHeight } from '../common/index';
import { getRangeFromAddress, getRangeIndexes, BeforeCellFormatArgs, getSheet, workbookEditOperation } from '../../workbook/index';
import { getCell, setCell, CellModel, BeforeSortEventArgs, getSheetIndex, wrapEvent, getSheetIndexFromId } from '../../workbook/index';
import { SheetModel, MergeArgs, setMerge, getRangeAddress, FilterCollectionModel, getSwapRange } from '../../workbook/index';
import { addClass, L10n } from '@syncfusion/ej2-base';
import { getFilteredCollection, CellStyleModel, TextDecoration, setCellFormat } from '../../workbook/index';
/**
 * UndoRedo module allows to perform undo redo functionalities.
 */
export class UndoRedo {
    private parent: Spreadsheet;
    private undoCollection: CollaborativeEditArgs[] = [];
    private redoCollection: CollaborativeEditArgs[] = [];
    private isUndo: boolean = false;
    private beforeActionData: BeforeActionData;
    private undoRedoStep: number = 100;
    constructor(parent: Spreadsheet) {
        this.parent = parent;
        this.addEventListener();
    }

    private setActionData(options: { args: CollaborativeEditArgs }): void {
        let sheet: SheetModel = this.parent.getActiveSheet();
        let address: number[];
        let cells: PreviousCellDetails[] = [];
        let cutCellDetails: PreviousCellDetails[] = [];
        let args: CollaborativeEditArgs = options.args;
        let eventArgs: UndoRedoEventArgs = args.eventArgs;
        switch (args.action) {
            case 'format':
                address = getRangeIndexes((args.eventArgs as BeforeCellFormatArgs).range);
                break;
            case 'clipboard':
                let copiedInfo: { [key: string]: Object } = eventArgs.copiedInfo;
                address = getRangeIndexes(getRangeFromAddress(eventArgs.pastedRange));
                if (copiedInfo.isCut) {
                    cutCellDetails = this.getCellDetails(
                        copiedInfo.range as number[], getSheet(this.parent, getSheetIndexFromId(this.parent, <number>copiedInfo.sId)));
                }
                break;
            case 'beforeSort':
                address = getRangeIndexes((args.eventArgs as BeforeSortEventArgs).range);
                if (address[0] === address[2] && (address[2] - address[0]) === 0) { //if selected range is a single cell 
                    address[0] = 0; address[1] = 0; address[2] = sheet.usedRange.rowIndex; address[3] = sheet.usedRange.colIndex;
                }
                break;
            case 'beforeCellSave':
            case 'cellDelete':
                address = getRangeIndexes(eventArgs.address);
                break;
            case 'beforeWrap':
                address = this.parent.getAddressInfo(eventArgs.address).indices;
                break;
            case 'beforeReplace':
                address = this.parent.getAddressInfo(eventArgs.address).indices;
                break;
            case 'beforeClear':
                address = getRangeIndexes(eventArgs.range);
                break;
            case 'beforeInsertImage':
                address = getRangeIndexes(eventArgs.range);
                break;
            case 'beforeInsertChart':
                address = getRangeIndexes(eventArgs.range);
                break;
            case 'filter':
                address = getRangeIndexes(eventArgs.range);
                break;
        }
        cells = this.getCellDetails(address, sheet);
        this.beforeActionData = { cellDetails: cells, cutCellDetails: cutCellDetails };
    }

    private getBeforeActionData(args: { beforeDetails: BeforeActionData }): void {
        args.beforeDetails = this.beforeActionData;
    }

    private performUndoRedo(args: { isUndo: boolean, isPublic: boolean }): void {
        let undoRedoArgs: CollaborativeEditArgs = args.isUndo ? this.undoCollection.pop() : this.redoCollection.pop();
        this.isUndo = args.isUndo;
        if (undoRedoArgs) {
            switch (undoRedoArgs.action) {
                case 'cellSave':
                case 'format':
                case 'sorting':
                case 'wrap':
                case 'cellDelete':
                    undoRedoArgs = this.performOperation(undoRedoArgs);
                    break;
                case 'clipboard':
                    undoRedoArgs = this.undoForClipboard(undoRedoArgs);
                    break;
                case 'resize':
                    undoRedoArgs = this.undoForResize(undoRedoArgs);
                    break;
                case 'hideShow':
                    undoRedoArgs.eventArgs.hide = !undoRedoArgs.eventArgs.hide;
                    updateAction(undoRedoArgs, this.parent);
                    break;
                case 'replace':
                    undoRedoArgs = this.performOperation(undoRedoArgs);
                    break;
                case 'insert':
                case 'filter':
                    updateAction(undoRedoArgs, this.parent, !args.isUndo);
                    break;
                case 'delete':
                    updateAction(undoRedoArgs, this.parent, !args.isUndo);
                    break;
                case 'validation':
                    updateAction(undoRedoArgs, this.parent, !args.isUndo);
                    break;
                case 'merge':
                    undoRedoArgs.eventArgs.merge = !undoRedoArgs.eventArgs.merge;
                    updateAction(undoRedoArgs, this.parent);
                    break;
                case 'clear':
                    undoRedoArgs = this.performOperation(undoRedoArgs);
                    break;
                case 'conditionalFormat':
                    updateAction(undoRedoArgs, this.parent, !args.isUndo);
                    break;
                case 'clearCF':
                    updateAction(undoRedoArgs, this.parent, !args.isUndo);
                    break;
                case 'insertImage':
                    updateAction(undoRedoArgs, this.parent, !args.isUndo);
                    break;
                case 'imageRefresh':
                    updateAction(undoRedoArgs, this.parent, !args.isUndo);
                    break;
                case 'insertChart':
                case 'deleteChart':
                    updateAction(undoRedoArgs, this.parent, !args.isUndo);
                    break;
                case 'chartRefresh':
                    updateAction(undoRedoArgs, this.parent, !args.isUndo);
                    break;
            }
            args.isUndo ? this.redoCollection.push(undoRedoArgs) : this.undoCollection.push(undoRedoArgs);
            if (this.undoCollection.length > this.undoRedoStep) {
                this.undoCollection.splice(0, 1);
            }
            if (this.redoCollection.length > this.undoRedoStep) {
                this.redoCollection.splice(0, 1);
            }
            this.updateUndoRedoIcons();
            let completeArgs: UndoRedoEventArgs = Object.assign({}, undoRedoArgs.eventArgs);
            completeArgs.requestType = args.isUndo ? 'undo' : 'redo';
            delete completeArgs.beforeActionData;
            if (!args.isPublic) {
                this.parent.notify(completeAction, { eventArgs: completeArgs, action: 'undoRedo' });
            }
        }
    }

    private updateUndoRedoCollection(options: { args: CollaborativeEditArgs, isPublic?: boolean }): void {
        let actionList: string[] = ['clipboard', 'format', 'sorting', 'cellSave', 'resize', 'resizeToFit', 'wrap', 'hideShow', 'replace',
            'validation', 'merge', 'clear', 'conditionalFormat', 'clearCF', 'insertImage', 'imageRefresh', 'insertChart', 'deleteChart',
            'chartRefresh', 'filter', 'cellDelete'];
        if ((options.args.action === 'insert' || options.args.action === 'delete') && options.args.eventArgs.modelType !== 'Sheet') {
            actionList.push(options.args.action);
        }
        let action: string = options.args.action;
        if (actionList.indexOf(action) === -1 && !options.isPublic) {
            return;
        }
        let eventArgs: UndoRedoEventArgs = options.args.eventArgs;
        if (action === 'clipboard' || action === 'sorting' || action === 'format' || action === 'cellSave' ||
            action === 'wrap' || action === 'replace' || action === 'validation' || action === 'clear' || action === 'conditionalFormat' ||
            action === 'clearCF' || action === 'insertImage' || action === 'imageRefresh' || action === 'insertChart' ||
            action === 'chartRefresh' || action === 'filter' || action === 'cellDelete') {
            let beforeActionDetails: { beforeDetails: BeforeActionData } = { beforeDetails: { cellDetails: [] } };
            this.parent.notify(getBeforeActionData, beforeActionDetails);
            eventArgs.beforeActionData = beforeActionDetails.beforeDetails;
        }
        this.undoCollection.push(options.args);
        this.redoCollection = [];
        if (this.undoCollection.length > this.undoRedoStep) {
            this.undoCollection.splice(0, 1);
        }
        this.updateUndoRedoIcons();
    }

    private clearUndoRedoCollection(): void {
        this.undoCollection = [];
        this.redoCollection = [];
        this.updateUndoRedoIcons();
    }

    private updateUndoRedoIcons(): void {
        let l10n: L10n = this.parent.serviceLocator.getService(locale);
        this.parent.notify(enableToolbarItems, [{
            tab: l10n.getConstant('Home'), items: [this.parent.element.id + '_undo']
            , enable: this.undoCollection.length > 0
        }]);
        this.parent.notify(enableToolbarItems, [{
            tab: l10n.getConstant('Home'), items: [this.parent.element.id + '_redo']
            , enable: this.redoCollection.length > 0
        }]);
    }

    private undoForClipboard(args: CollaborativeEditArgs): CollaborativeEditArgs {
        let eventArgs: UndoRedoEventArgs = args.eventArgs;
        let address: string[] = eventArgs.pastedRange.split('!');
        let range: number[] = getRangeIndexes(address[1]);
        let sheetIndex: number = getSheetIndex(this.parent, address[0]);
        let sheet: SheetModel = getSheet(this.parent, sheetIndex);
        let copiedInfo: { [key: string]: Object } = eventArgs.copiedInfo;
        let actionData: BeforeActionData = eventArgs.beforeActionData;
        let isRefresh: boolean = this.checkRefreshNeeded(sheetIndex);
        let pictureElem: HTMLElement;
        if (args.eventArgs.requestType === 'imagePaste') {
            let copiedShapeInfo: { [key: string]: Object } = eventArgs.copiedShapeInfo;
            if (this.isUndo) {
                pictureElem = copiedShapeInfo.pictureElem as HTMLElement;
                if (copiedShapeInfo.isCut) {
                    this.parent.notify(deleteImage, {
                        id: pictureElem.id, sheetIdx: eventArgs.pasteSheetIndex + 1
                    });
                    this.parent.notify(createImageElement, {
                        options: {
                            data: pictureElem.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
                            height: copiedShapeInfo.height, width: copiedShapeInfo.width, imageId: pictureElem.id
                        },
                        range: copiedShapeInfo.copiedRange, isPublic: false, isUndoRedo: true
                    });
                } else {
                    this.parent.notify(deleteImage, {
                        id: eventArgs.pastedPictureElement.id, sheetIdx: eventArgs.pasteSheetIndex + 1
                    });
                }
            } else {
                if (copiedShapeInfo.isCut) {
                    pictureElem = copiedShapeInfo.pictureElem as HTMLElement;
                    this.parent.notify(deleteImage, {
                        id: pictureElem.id, sheetIdx: copiedShapeInfo.sId
                    });
                    this.parent.notify(createImageElement, {
                        options: {
                            data: pictureElem.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
                            height: copiedShapeInfo.height, width: copiedShapeInfo.width, imageId: pictureElem.id
                        },
                        range: copiedShapeInfo.pastedRange, isPublic: false, isUndoRedo: true
                    });
                } else {
                    pictureElem = eventArgs.pastedPictureElement;
                    this.parent.notify(createImageElement, {
                        options: {
                            data: pictureElem.style.backgroundImage.replace(/url\((['"])?(.*?)\1\)/gi, '$2'),
                            height: pictureElem.offsetHeight, width: pictureElem.offsetWidth, imageId: pictureElem.id
                        },
                        range: copiedShapeInfo.pastedRange, isPublic: false, isUndoRedo: true
                    });
                }
            }
        } else {
            if (this.isUndo) {
                if (copiedInfo.isCut) {
                    let cells: PreviousCellDetails[] = actionData.cutCellDetails;
                    this.updateCellDetails(
                        cells, getSheet(this.parent, getSheetIndexFromId(this.parent, <number>copiedInfo.sId)),
                        getSwapRange(copiedInfo.range as number[]), isRefresh);
                    this.parent.notify(getFilteredCollection, null);
                    for (let i: number = 0; i < this.parent.sheets.length; i++) {
                        let sheetIndex: number = getSheetIndexFromId(this.parent, <number>copiedInfo.sId);
                        if (this.parent.filterCollection && this.parent.filterCollection[i] &&
                            this.parent.filterCollection[i].sheetIdx === eventArgs.pasteSheetIndex) {
                            let filterCol: FilterCollectionModel = this.parent.filterCollection[i];
                            let fRange: number[] = getRangeIndexes(filterCol.filterRange); let pRange: number[] = getSwapRange(range);
                            if (fRange[0] >= pRange[0] && fRange[2] <= pRange[2]) {
                                this.parent.notify(initiateFilterUI, {
                                    predicates: null, range: filterCol.filterRange,
                                    sIdx: eventArgs.pasteSheetIndex, isCut: true
                                });
                                let diff: number[] = [Math.abs(pRange[0] - fRange[0]), Math.abs(pRange[1] - fRange[1]),
                                Math.abs(pRange[2] - fRange[2]), Math.abs(pRange[3] - fRange[3])];
                                let copiedRange: number[] = getSwapRange(copiedInfo.range as number[]);
                                diff = [copiedRange[0] + diff[0], copiedRange[1] + diff[1],
                                Math.abs(copiedRange[2] - diff[2]), Math.abs(copiedRange[3] - diff[3])];
                                this.parent.notify(initiateFilterUI, {
                                    predicates: null,
                                    range: getRangeAddress(diff), sIdx: sheetIndex, isCut: true
                                });
                            }
                        }
                    }
                }
                this.updateCellDetails(actionData.cellDetails, sheet, range, isRefresh);
                setMaxHgt(sheet, range[0], range[1], 20);
                let hgt: number = getMaxHgt(sheet, range[0]);
                setRowEleHeight(this.parent, sheet, hgt, range[0]);
                eventArgs.mergeCollection.forEach((mergeArgs: MergeArgs): void => {
                    mergeArgs.merge = !mergeArgs.merge; this.parent.notify(setMerge, mergeArgs); mergeArgs.merge = !mergeArgs.merge;
                });
            } else {
                updateAction(args, this.parent, copiedInfo.isCut as boolean);
            }
            if (isRefresh) { this.parent.notify(selectRange, { indexes: range }); }
        }
        return args;
    }

    private undoForResize(args: CollaborativeEditArgs): CollaborativeEditArgs {
        let eventArgs: UndoRedoEventArgs = args.eventArgs;
        if (eventArgs.hide === undefined) {
            if (eventArgs.isCol) {
                let temp: string = eventArgs.oldWidth;
                eventArgs.oldWidth = eventArgs.width;
                eventArgs.width = temp;
            } else {
                let temp: string = eventArgs.oldHeight;
                eventArgs.oldHeight = eventArgs.height;
                eventArgs.height = temp;
            }
        } else {
            eventArgs.hide = !eventArgs.hide;
        }
        updateAction(args, this.parent);
        return args;
    }

    private performOperation(args: CollaborativeEditArgs): CollaborativeEditArgs {
        let eventArgs: UndoRedoEventArgs = args.eventArgs;
        let address: string[] = (args.action === 'cellSave' || args.action === 'wrap' || args.action === 'replace'
            || args.action === 'cellDelete') ? eventArgs.address.split('!') : eventArgs.range.split('!');
        let range: number[] = getRangeIndexes(address[1]);
        let indexes: number[] = range;
        let sheetIndex: number = getSheetIndex(this.parent, address[0]);
        let sheet: SheetModel = getSheet(this.parent, sheetIndex);
        let actionData: BeforeActionData = eventArgs.beforeActionData;
        let isRefresh: boolean = this.checkRefreshNeeded(sheetIndex);
        if (this.isUndo) {
            this.updateCellDetails(actionData.cellDetails, sheet, range, isRefresh, args);
            setMaxHgt(sheet, range[0], range[1], 20);
            let hgt: number = getMaxHgt(sheet, range[0]);
            setRowEleHeight(this.parent, sheet, hgt, range[0]);
        } else {
            /* tslint:disable-next-line:no-any */
            let argsEventArgs: any = args.eventArgs;
            let activeCellIndexes: number[] = getRangeIndexes(sheet.activeCell);
            let cellValue: TextDecoration = this.parent.getCellStyleValue(['textDecoration'], activeCellIndexes).textDecoration;
            if (argsEventArgs && argsEventArgs.style && (argsEventArgs.style as CellStyleModel).textDecoration ) {
                let value: TextDecoration = (argsEventArgs.style as CellStyleModel).textDecoration;
                let changedValue: TextDecoration = value;
                let changedStyle: CellStyleModel;
                let removeProp: boolean = false;
                if (cellValue === 'underline') {
                    changedValue = value === 'underline' ? 'none' : 'underline line-through';
                } else if (cellValue === 'line-through') {
                    changedValue = value === 'line-through' ? 'none' : 'underline line-through';
                } else if (cellValue === 'underline line-through') {
                    changedValue = value === 'underline' ? 'line-through' : 'underline'; removeProp = true;
                }
                if (changedValue === 'none') { removeProp = true; }
                (argsEventArgs.style as CellStyleModel).textDecoration = changedValue;
                args.eventArgs = argsEventArgs as UndoRedoEventArgs;
                this.parent.notify(setCellFormat, {
                    style: { textDecoration: changedValue } , range: activeCellIndexes, refreshRibbon: true,
                    onActionUpdate: true
                });
                for (let i: number = indexes[0]; i <= indexes[2]; i++) {
                    for (let j: number = indexes[1]; j <= indexes[3]; j++) {
                        if (i === activeCellIndexes[0] && j === activeCellIndexes[1]) { continue; }
                        changedStyle = {};
                        cellValue = this.parent.getCellStyleValue(['textDecoration'], [i, j]).textDecoration;
                        if (cellValue === 'none') {
                            if (removeProp) { continue; }
                            changedStyle.textDecoration = value;
                        } else if (cellValue === 'underline' || cellValue === 'line-through') {
                            if (removeProp) {
                                if (value === cellValue) {
                                    changedStyle.textDecoration = 'none';
                                } else {
                                    continue;
                                }
                            } else {
                                changedStyle.textDecoration = value !== cellValue ? 'underline line-through' : value;
                            }
                        } else if (cellValue === 'underline line-through') {
                            if (removeProp) {
                                changedStyle.textDecoration = value === 'underline' ? 'line-through' : 'underline';
                            } else {
                                continue;
                            }
                        }
                        this.parent.notify(setCellFormat, {
                            style: { textDecoration: changedStyle.textDecoration }, range: [i, j, i, j], refreshRibbon: true,
                            onActionUpdate: true
                        });
                    }
                }
                (argsEventArgs.style as CellStyleModel).textDecoration = value;
                args.eventArgs = argsEventArgs as UndoRedoEventArgs;
            } else {
                updateAction(args, this.parent);
            }
        }
        if (isRefresh) {
            this.parent.notify(selectRange, { indexes: range });
        }
        return args;
    }
    private getCellDetails(address: number[], sheet: SheetModel): PreviousCellDetails[] {
        let cells: PreviousCellDetails[] = [];
        let cell: CellModel;
        address = getSwapRange(address);
        for (let i: number = address[0]; i <= address[2]; i++) {
            for (let j: number = address[1]; j <= address[3]; j++) {
                cell = getCell(i, j, sheet);
                cells.push({
                    rowIndex: i, colIndex: j, format: cell ? cell.format : null,
                    style: cell && cell.style ? Object.assign({}, cell.style) : null, value: cell ? cell.value : '', formula: cell ?
                    cell.formula : '', wrap: cell && cell.wrap, rowSpan: cell && cell.rowSpan, colSpan: cell && cell.colSpan,
                    hyperlink: cell && cell.hyperlink, image: cell && cell.image && cell.chart
                });
            }
        }
        return cells;
    }

    private updateCellDetails(
        cells: PreviousCellDetails[], sheet: SheetModel, range: number[], isRefresh: boolean, args?: CollaborativeEditArgs): void {
        let len: number = cells.length;
        let cellElem: HTMLElement;
        for (let i: number = 0; i < len; i++) {
            setCell(cells[i].rowIndex, cells[i].colIndex, sheet, {
                value: cells[i].value, format: cells[i].format,
                style: cells[i].style && Object.assign({}, cells[i].style), formula: cells[i].formula,
                wrap: cells[i].wrap, rowSpan: cells[i].rowSpan,
                colSpan: cells[i].colSpan, hyperlink: cells[i].hyperlink
            });
            if (cells[i].formula) {
                this.parent.notify(
                    workbookEditOperation,
                    {
                        action: 'updateCellValue', address: [cells[i].rowIndex, cells[i].colIndex, cells[i].rowIndex,
                        cells[i].colIndex], value: cells[i].formula
                    });
            }
            if (args && args.action === 'wrap' && args.eventArgs.wrap) {
                this.parent.notify(wrapEvent, {
                    range: [cells[i].rowIndex, cells[i].colIndex, cells[i].rowIndex,
                    cells[i].colIndex], wrap: false, sheet: sheet
                });
            }
            if (args && cells[i].hyperlink && args.action === 'clear') {
                args.eventArgs.range = sheet.name + '!' + getRangeAddress([cells[i].rowIndex, cells[i].colIndex, cells[i].rowIndex,
                cells[i].colIndex]);
                cellElem = this.parent.getCell(cells[i].rowIndex, cells[i].colIndex);
                if (args.eventArgs.type === 'Clear All' || args.eventArgs.type === 'Clear Hyperlinks') {
                    this.parent.addHyperlink(cells[i].hyperlink, args.eventArgs.range);
                } else if (args.eventArgs.type === 'Clear Formats') {
                    addClass(cellElem.querySelectorAll('.e-hyperlink'), 'e-hyperlink-style');
                }
            }
        }
        if (isRefresh) {
            this.parent.serviceLocator.getService<ICellRenderer>('cell').refreshRange(range);
        }
    }

    private checkRefreshNeeded(sheetIndex: number): boolean {
        let isRefresh: boolean = true;
        if (sheetIndex !== this.parent.activeSheetIndex) {
            this.parent.activeSheetIndex = sheetIndex;
            this.parent.dataBind();
            isRefresh = false;
        }
        return isRefresh;
    }
    private addEventListener(): void {
        this.parent.on(performUndoRedo, this.performUndoRedo, this);
        this.parent.on(updateUndoRedoCollection, this.updateUndoRedoCollection, this);
        this.parent.on(setActionData, this.setActionData, this);
        this.parent.on(getBeforeActionData, this.getBeforeActionData, this);
        this.parent.on(clearUndoRedoCollection, this.clearUndoRedoCollection, this);
        this.parent.on(setUndoRedo, this.updateUndoRedoIcons, this);
    }

    private removeEventListener(): void {
        if (!this.parent.isDestroyed) {
            this.parent.off(performUndoRedo, this.performUndoRedo);
            this.parent.off(updateUndoRedoCollection, this.updateUndoRedoCollection);
            this.parent.off(setActionData, this.setActionData);
            this.parent.off(getBeforeActionData, this.getBeforeActionData);
            this.parent.off(clearUndoRedoCollection, this.clearUndoRedoCollection);
            this.parent.off(setUndoRedo, this.updateUndoRedoIcons);
        }
    }

    /**
     * Destroy undo redo module.
     */

    public destroy(): void {
        this.removeEventListener();
        this.parent = null;
    }
    /**
     * Get the undo redo module name.
     */
    public getModuleName(): string {
        return 'undoredo';
    }
}
