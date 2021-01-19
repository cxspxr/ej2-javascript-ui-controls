import { CellModel, ColumnModel } from './../base/index';

/**
 * Check whether the text is formula or not.
 * @param text 
 */
export function checkIsFormula(text: string): boolean {
    return text && text[0] === '=' && text.length > 1;
}
/**
 * Check whether the value is cell reference or not.
 * @param {string} value - Specify the value to check. 
 */
export function isCellReference(value: string): boolean {
    let range: string = value;
    range = range.split('$').join('');
    if (range.indexOf(':') > -1) {
        let rangeSplit: string[] = range.split(':');
        if (isValidCellReference(rangeSplit[0]) && isValidCellReference(rangeSplit[1])) {
           return true;
        }
    } else if (range.indexOf(':') < 0) {
        if (isValidCellReference(range)) {
            return true;
        }
    }
    return false;
}
/**
 * Check whether the value is character or not.
 * @param {string} value - Specify the value to check. 
 */
export function isChar(value: string): boolean {
    if ((value.charCodeAt(0) >= 65 && value.charCodeAt(0) <= 90) || (value.charCodeAt(0) >= 97 && value.charCodeAt(0) <= 122)) {
        return true;
    }
    return false;
}

export function inRange(range: number[], rowIdx: number, colIdx: number) : boolean {
    return range && (rowIdx >= range[0] && rowIdx <= range[2] && colIdx >= range[1] && colIdx <= range[3]);
}

/**
 * Check whether the cell is locked or not
 * @hidden
 */
export function isLocked(cell: CellModel, column: ColumnModel): boolean {
    if (!cell) {
        cell = {};
    }
    if (cell.isLocked) {
        return true;
    } else if (cell.isLocked === false) {
        return false;
    } else if (column && column.isLocked) {
        return true;
    } else if (!cell.isLocked && (column && column.isLocked !== false)) {
        return true;
    }
    return false;
}

/**
 * Check whether the value is cell reference or not.
 * @param {string} value - Specify the value to check. 
 * @hidden
 */
export function isValidCellReference(value: string): boolean {
    let text: string = value;
    let startNum: number = 0;
    let endNum: number = 0;
    let j: number = 0;
    let numArr: number[] = [89, 71, 69];
    // XFD is the last column, for that we are using ascii values of Z, G, E (89, 71, 69) to restrict the flow.
    let cellText: string = '';
    let textLength: number = text.length;
    for (let i: number = 0; i < textLength; i++) {
        if (isChar(text[i])) {
            endNum++;
        }
    }
    cellText = text.substring(startNum, endNum);
    let cellTextLength: number = cellText.length;
    if (cellTextLength !== textLength) {
        if (cellTextLength < 4) {
            if (textLength !== 1 && (isNaN(parseInt(text, 10)))) {
                while (j < cellTextLength) {
                    if ((cellText[j]) && cellText[j].charCodeAt(0) < numArr[j]) {
                        j++;
                        continue;
                    } else if (!(cellText[j]) && j > 0) {
                        break;
                    } else {
                        return false;
                    }
                }
                let cellNumber: number = parseFloat(text.substring(endNum, textLength));
                if (cellNumber > 0 && cellNumber < 1048577) { // 1048576 - Maximum number of rows in excel.
                    return true;
                }
            }
        }
    }
    return false;
}