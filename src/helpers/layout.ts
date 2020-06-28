import { LayoutGrid } from '../components/Grid';

export const getStaticHeight = () => {
    const header = document.getElementsByTagName('header')[0];
    const headerHeight = header ? header.clientHeight : 0;
    const headerContainer = document.getElementsByClassName('pg-trading-header-container')[0];
    const headerContainerHeight = headerContainer ? headerContainer.clientHeight : 0;

    return headerHeight + headerContainerHeight;
};

export const gridUnitsToPixels = (gridUnit: number, rowHeight: number, margin: number) => {
    let res = gridUnit * (rowHeight + margin);
    if (gridUnit > 1) {
        res -= margin;
    }

    return res;
};

export const pixelsToGridUnits = (pixels: number, rowHeight: number, margin: number) => {
    let tmp = pixels;

    if (pixels / (rowHeight + margin) > 1) {
        tmp += margin;
    }

    return tmp / (rowHeight + margin);
};

const getLayouts = () => {

    return {
        lg: [
            /* Top Bar */
            { i: '1', x: 0, y: 0, w: 24, h: 3, minH: 3, maxH: 6, minW: 13, isDraggable: false, isResizable: false },
            /* Left Side */
            { i: '2', x: 0, y: 3, w: 14, h: 36, minH: 36, maxH: 36, minW: 4, isDraggable: false, isResizable: false }, /* Chart */
            { i: '3', x: 0, y: 49, w: 14, h: 21, minH: 21, minW: 5, isDraggable: false, isResizable: false }, /* Order Component */
            { i: '4', x: 0, y: 70, w: 14, h: 30, minH: 30, minW: 5, isDraggable: false, isResizable: false }, /* Open Orders */

            /* Right Side */
            { i: '5', x: 14, y: 3, w: 10, h: 36, minH: 36, minW: 4, isDraggable: false, isResizable: false }, /* Markets */
            { i: '6', x: 14, y: 39, w: 10, h: 31, minH: 31, minW: 4, isDraggable: false, isResizable: false }, /* Order Book */
            { i: '7', x: 14, y: 70, w: 10, h: 20, minH: 20, minW: 4, isDraggable: false, isResizable: false }, /* Recent Trades */
        ],
        md: [
            /* Top Bar */
            { i: '1', x: 0, y: 0, w: 24, h: 6, minH: 6, maxH: 6, minW: 13, isDraggable: false, isResizable: false },
            /* Left Side */
            { i: '2', x: 0, y: 3, w: 14, h: 36, minH: 36, maxH: 36, minW: 4, isDraggable: false, isResizable: false },
            { i: '3', x: 0, y: 49, w: 14, h: 21, minH: 21, minW: 5, isDraggable: false, isResizable: false },
            { i: '4', x: 0, y: 70, w: 14, h: 30, minH: 30, minW: 5, isDraggable: false, isResizable: false },

            /* Right Side */
            { i: '5', x: 14, y: 3, w: 10, h: 36, minH: 36, minW: 5, isDraggable: false, isResizable: false },
            { i: '6', x: 14, y: 39, w: 10, h: 31, minH: 31, minW: 4, isDraggable: false, isResizable: false },
            { i: '7', x: 14, y: 70, w: 10, h: 20, minH: 20, minW: 4, isDraggable: false, isResizable: false },
        ],
        sm: [
            { i: '1', x: 0, y: 0, w: 24, h: 6, minH: 6, maxH: 6, minW: 13, isDraggable: false, isResizable: false },
            { i: '2', x: 0, y: 39, w: 12, h: 36, minH: 22, maxH: 22, minW: 5, isDraggable: false, isResizable: false },
            { i: '3', x: 0, y: 106, w: 12, h: 21, minH: 12, minW: 3, isDraggable: false, isResizable: false },
            { i: '4', x: 0, y: 127, w: 12, h: 20, minH: 12, minW: 7, isDraggable: false, isResizable: false },
            { i: '5', x: 0, y: 3, w: 12, h: 36, minH: 12, minW: 7, isDraggable: false, isResizable: false },
            { i: '6', x: 0, y: 75, w: 12, h: 31, minH: 12, minW: 7, isDraggable: false, isResizable: false },
            { i: '7', x: 0, y: 157, w: 12, h: 20, minH: 12, minW: 7, isDraggable: false, isResizable: false },
        ],
    };
};

export const layouts = getLayouts();

export const getLayoutFromLS = (key: string): LayoutGrid | undefined => {
    let obj = {};
    if (localStorage) {
        try {
            obj = JSON.parse(localStorage.getItem('rgl') || '') || {};
        } catch (e) {
            // ignore
        }
    }

    return obj[key];
};

export const saveLayoutToLS = (key: string, value): void => {
    if (localStorage) {
        localStorage.setItem(
            'rgl',
            JSON.stringify({[key]: value}),
        );
    }
};

export const resetLayout = (key: string): void => {
    if (localStorage) {
        localStorage.setItem(
            'rgl',
            JSON.stringify({[key]: layouts}),
        );
    }
};
