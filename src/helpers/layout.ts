import { LayoutGrid } from '../components/Grid';
import { customLayouts } from '../custom/helpers/layout';
import { isResizableGrid, isDraggableGrid} from '../api/config';

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
    const isDraggable = isDraggableGrid();
    const isResizable = isResizableGrid();

    return {
        lg: [
            /* Top Bar */
            { i: '1', x: 0, y: 0, w: 24, h: 3, minH: 3, maxH: 6, minW: 13, isDraggable: false, isResizable: false },
            /* Left Side */
            { i: '2', x: 0, y: 3, w: 14, h: 36, minH: 36, maxH: 36, minW: 4, isDraggable: isDraggable, isResizable: isResizable }, /* Chart */
            { i: '3', x: 0, y: 39, w: 14, h: 10, minH: 10, minW: 5, isDraggable: isDraggable, isResizable: isResizable }, /* Market Depth */
            { i: '4', x: 0, y: 49, w: 14, h: 21, minH: 21, minW: 5, isDraggable: isDraggable, isResizable: isResizable }, /* Order Component */ 
            { i: '5', x: 0, y: 70, w: 14, h: 20, minH: 20, minW: 5, isDraggable: isDraggable, isResizable: isResizable }, /* Open Orders */

            /* Right Side */
            { i: '6', x: 14, y: 3, w: 10, h: 36, minH: 36, minW: 4, isDraggable: isDraggable, isResizable: isResizable }, /* Markets */
            { i: '7', x: 14, y: 39, w: 10, h: 31, minH: 31, minW: 4, isDraggable: isDraggable, isResizable: isResizable }, /* Order Book */
            { i: '8', x: 14, y: 70, w: 10, h: 20, minH: 20, minW: 4, isDraggable: isDraggable, isResizable: isResizable }, /* Recent Trades */
        ],
        md: [
            /* Top Bar */
            { i: '1', x: 0, y: 0, w: 24, h: 6, minH: 6, maxH: 6, minW: 13, isDraggable: false, isResizable: false },
            /* Left Side */
            { i: '2', x: 0, y: 3, w: 14, h: 36, minH: 36, maxH: 36, minW: 4, isDraggable: isDraggable, isResizable: isResizable },
            { i: '3', x: 0, y: 39, w: 14, h: 10, minH: 10, minW: 5, isDraggable: isDraggable, isResizable: isResizable },
            { i: '4', x: 0, y: 49, w: 14, h: 21, minH: 21, minW: 5, isDraggable: isDraggable, isResizable: isResizable },
            { i: '5', x: 0, y: 70, w: 14, h: 20, minH: 20, minW: 5, isDraggable: isDraggable, isResizable: isResizable },

            /* Right Side */
            { i: '6', x: 14, y: 3, w: 10, h: 36, minH: 36, minW: 5, isDraggable: isDraggable, isResizable: isResizable },
            { i: '7', x: 14, y: 39, w: 10, h: 31, minH: 31, minW: 4, isDraggable: isDraggable, isResizable: isResizable },
            { i: '8', x: 14, y: 70, w: 10, h: 20, minH: 20, minW: 4, isDraggable: isDraggable, isResizable: isResizable },
        ],
        sm: [
            { i: '1', x: 0, y: 0, w: 24, h: 6, minH: 6, maxH: 6, minW: 13, isDraggable: false, isResizable: false },
            { i: '2', x: 0, y: 3, w: 12, h: 36, minH: 22, maxH: 22, minW: 5, isDraggable: false },
            { i: '3', x: 0, y: 39, w: 12, h: 10, minH: 30, minW: 5, isDraggable: false },
            { i: '4', x: 0, y: 49, w: 12, h: 21, minH: 12, minW: 3, isDraggable: false },
            { i: '5', x: 0, y: 70, w: 12, h: 20, minH: 12, minW: 7, isDraggable: false },
            { i: '6', x: 0, y: 90, w: 12, h: 36, minH: 12, minW: 7, isDraggable: false },
            { i: '7', x: 0, y: 126, w: 12, h: 31, minH: 12, minW: 7, isDraggable: false },
            { i: '8', x: 0, y: 157, w: 12, h: 20, minH: 12, minW: 7, isDraggable: false },
        ],
        ...customLayouts,
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
