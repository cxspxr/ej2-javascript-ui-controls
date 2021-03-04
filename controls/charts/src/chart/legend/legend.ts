/**
 * Chart legend
 */
import { remove, Browser, extend } from '@syncfusion/ej2-base';
import { Series } from '../series/chart-series';
import { Indexes } from '../../common/model/base';
import { ChartSeriesType, ChartDrawType } from '../utils/enum';
import { LegendOptions, BaseLegend } from '../../common/legend/legend';
import { Chart } from '../../chart';
import { LegendSettingsModel } from '../../common/legend/legend-model';
import { textTrim, ChartLocation, removeElement, RectOption, withInBounds, blazorTemplatesReset} from '../../common/utils/helper';
import { getUnicodeText} from '../../common/utils/helper';
import { Size, measureText, Rect, CanvasRenderer, getElement } from '@syncfusion/ej2-svg-base';
import { ILegendRegions } from '../../common/model/interface';
import { ILegendRenderEventArgs, ILegendClickEventArgs } from '../../chart/model/chart-interface';
import { legendRender, legendClick, regSub, regSup} from '../../common/model/constants';
import { Axis } from '../axis/axis';
import { LegendTitlePosition } from '../../common/utils/enum';
/**
 * `Legend` module is used to render legend for the chart.
 */
export class Legend extends BaseLegend {
    constructor(chart: Chart) {
        super(chart);
        this.library = this;
        this.addEventListener();
    }
    /**
     * Binding events for legend module.
     */
    private addEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.on(Browser.touchMoveEvent, this.mouseMove, this);
        this.chart.on('click', this.click, this);
        this.chart.on(Browser.touchEndEvent, this.mouseEnd, this);
    }
    /**
     * UnBinding events for legend module.
     */
    private removeEventListener(): void {
        if (this.chart.isDestroyed) { return; }
        this.chart.off(Browser.touchMoveEvent, this.mouseMove);
        this.chart.off('click', this.click);
        this.chart.off(Browser.touchEndEvent, this.mouseEnd);
    }
    /**
     * To handle mosue move for legend module
     */
    private mouseMove(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && !this.chart.isTouch) {
            this.move(e);
            if ((<Chart>this.chart).highlightModule && (<Chart>this.chart).highlightMode !== 'None') {
                this.click(e);
            }
        }
    }
    /**
     * To handle mosue end for legend module
     */
    private mouseEnd(e: MouseEvent): void {
        if (this.chart.legendSettings.visible && this.chart.isTouch) {
            this.move(e);
        }
    }
    /**
     * Get the legend options.
     * @return {void}
     * @private
     */
    public getLegendOptions(visibleSeriesCollection: Series[], chart: Chart): void {
        this.legendCollections = [];
        let seriesType: ChartDrawType | ChartSeriesType;
        let fill: string;
        for (let series of visibleSeriesCollection) {
            if (series.category !== 'Indicator' && series.name !== '') {
                seriesType = (chart.chartAreaType === 'PolarRadar') ? <ChartDrawType>series.drawType :
                    <ChartSeriesType>series.type;
                // To set legend color when use pointColorMapping
                fill = (series.pointColorMapping && series.points.length > 0) ?
                    (series.points[0].interior ? series.points[0].interior : series.interior) : series.interior;
                this.legendCollections.push(new LegendOptions(
                    series.name, fill, series.legendShape, (series.category === 'TrendLine' ?
                        (this.chart as Chart).series[series.sourceIndex].trendlines[series.index].visible : series.visible),
                    seriesType, series.legendImageUrl, series.marker.shape, series.marker.visible
                ));
            }
        }
    }
    /** @private */
    public getLegendBounds(availableSize: Size, legendBounds: Rect, legend: LegendSettingsModel): void {
        this.calculateLegendTitle(legend, legendBounds);
        this.isTitle = legend.title ? true : false;
        let padding: number = legend.padding;
        let titlePosition: LegendTitlePosition = legend.titlePosition;
        let extraHeight: number = 0;
        let extraWidth: number = 0;
        let arrowWidth: number = this.arrowWidth;
        let arrowHeight: number = this.arrowHeight;
        let verticalArrowSpace: number = this.isVertical && !legend.enablePages ? arrowHeight : 0;
        let titleSpace: number = this.isTitle && titlePosition === 'Top' ? this.legendTitleSize.height + this.fivePixel : 0;
        titleSpace = this.isTitle && this.isVertical && titlePosition !== 'Top' ? this.legendTitleSize.height + this.fivePixel : titleSpace;
        if (!this.isVertical) {
            extraHeight = !legend.height ? ((availableSize.height / 100) * 5) : 0;
        } else {
            extraWidth = !legend.width ? ((availableSize.width / 100) * 5) : 0;
        }
        legendBounds.height += (extraHeight);
        legendBounds.width += extraWidth;
        let shapeWidth: number = legend.shapeWidth;
        let shapePadding: number = legend.shapePadding;
        let maximumWidth: number = 0;
        let rowWidth: number = 0;
        let legendWidth: number = 0;
        let columnHeight: number = 0;
        let rowCount: number = 0;
        let titlePlusArrowSpace: number = 0;
        let legendEventArgs: ILegendRenderEventArgs;
        this.maxItemHeight = Math.max(measureText('MeasureText', legend.textStyle).height, legend.shapeHeight);
        let render: boolean = false;
        for (let legendOption of this.legendCollections) {
            if (regSub.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSub);
            }
            if (regSup.test(legendOption.text)) {
                legendOption.text = getUnicodeText(legendOption.text, regSup);
            }
            legendEventArgs = {
                fill: legendOption.fill, text: legendOption.text, shape: legendOption.shape,
                markerShape: legendOption.markerShape, name: legendRender, cancel: false
            };
            this.chart.trigger(legendRender, legendEventArgs);
            legendOption.render = !legendEventArgs.cancel;
            legendOption.text = legendEventArgs.text;
            legendOption.fill = legendEventArgs.fill;
            legendOption.shape = legendEventArgs.shape;
            legendOption.markerShape = legendEventArgs.markerShape;
            legendOption.textSize = measureText(legendOption.text, legend.textStyle);
            if (legendOption.render && legendOption.text !== '') {
                render = true;
                legendWidth = shapeWidth + shapePadding + legendOption.textSize.width + padding;
                rowWidth = rowWidth + legendWidth;
                if (!legend.enablePages && !this.isVertical) {
                    titlePlusArrowSpace = this.isTitle && titlePosition !== 'Top' ? this.legendTitleSize.width + this.fivePixel : 0;
                    titlePlusArrowSpace += arrowWidth;
                }
                if (legendBounds.width < (padding + rowWidth + titlePlusArrowSpace) || this.isVertical) {
                    maximumWidth = Math.max(maximumWidth, (rowWidth + padding + titlePlusArrowSpace - (this.isVertical ? 0 : legendWidth)));
                    if (rowCount === 0 && (legendWidth !== rowWidth)) {
                        rowCount = 1;
                    }
                    rowWidth = this.isVertical ? 0 : legendWidth;
                    rowCount++;
                    columnHeight = (rowCount * (this.maxItemHeight + padding)) + padding + titleSpace + verticalArrowSpace;
                }
            }
        }
        columnHeight = Math.max(columnHeight, (this.maxItemHeight + padding) + padding + titleSpace);
        this.isPaging = legendBounds.height < columnHeight;
        if (this.isPaging && !legend.enablePages) {
            if (this.isVertical) {
                columnHeight = columnHeight;
            } else {
                columnHeight = (this.maxItemHeight + padding) + padding + (titlePosition === 'Top' ? titleSpace : 0);
            }
        }
        this.totalPages = rowCount;
        if (!this.isPaging && !this.isVertical) {
            rowWidth += this.isTitle && titlePosition !== 'Top' ? (this.fivePixel + this.legendTitleSize.width + this.fivePixel) : 0;
        }
        if (render) {
            this.setBounds(Math.max((rowWidth + padding), maximumWidth), columnHeight, legend, legendBounds);
        } else {
            this.setBounds(0, 0, legend, legendBounds);
        }
    }
    /** @private */
    public getRenderPoint(
        legendOption: LegendOptions, start: ChartLocation, textPadding: number, prevLegend: LegendOptions,
        rect: Rect, count: number, firstLegend: number): void {
        let padding: number = this.legend.padding;
        let previousBound: number = (prevLegend.location.x + textPadding + prevLegend.textSize.width);
        if ((previousBound + (legendOption.textSize.width + textPadding)) > (rect.x + rect.width + this.legend.shapeWidth / 2) ||
            this.isVertical) {
            legendOption.location.x = start.x;
            legendOption.location.y = (count === firstLegend) ? prevLegend.location.y :
                prevLegend.location.y + this.maxItemHeight + padding;
        } else {
            legendOption.location.x = (count === firstLegend) ? prevLegend.location.x : previousBound;
            legendOption.location.y = prevLegend.location.y;
        }
        let availwidth: number = (this.legendBounds.x + this.legendBounds.width) - (legendOption.location.x +
            textPadding - this.legend.shapeWidth / 2);
        legendOption.text = textTrim(+availwidth.toFixed(4), legendOption.text, this.legend.textStyle);
    }
    /** @private */
    public LegendClick(seriesIndex: number, event: Event | PointerEvent): void {
        let chart: Chart = <Chart>this.chart;
        let series: Series = chart.visibleSeries[seriesIndex];
        let legend: LegendOptions = this.legendCollections[seriesIndex];
        let changeDetection: string = 'isProtectedOnChange';
        let legendClickArgs: ILegendClickEventArgs = {
            legendText: legend.text, legendShape: legend.shape,
            chart: chart.isBlazor ? {} as Chart : chart, series: series, name: legendClick, cancel: false
        };
        if (chart.legendSettings.toggleVisibility) {
            if (series.category === 'TrendLine') {
                if (!chart.series[series.sourceIndex].trendlines[series.index].visible) {
                    chart.series[series.sourceIndex].trendlines[series.index].visible = true;
                } else {
                    chart.series[series.sourceIndex].trendlines[series.index].visible = false;
                }
            } else {
                series.chart[changeDetection] = true;
                this.changeSeriesVisiblity(series, series.visible);
            }
        }
        this.chart.trigger(legendClick, legendClickArgs);
        series.legendShape = legendClickArgs.legendShape;
        if (series.fill !== null) {
            chart.visibleSeries[seriesIndex].interior = series.fill;
        }
        let selectedDataIndexes: Indexes[] = [];
        if (chart.selectionModule) {
            selectedDataIndexes = <Indexes[]>extend([], chart.selectionModule.selectedDataIndexes, null, true);
        }
        if (chart.legendSettings.toggleVisibility) {
            legend.visible = series.category === 'TrendLine' ? chart.series[series.sourceIndex].trendlines[series.index].visible :
                             (series.visible);
            if ((chart.svgObject.childNodes.length > 0 ) && !chart.enableAnimation && !chart.enableCanvas) {
                while (chart.svgObject.lastChild) {
                    chart.svgObject.removeChild(chart.svgObject.lastChild);
                }
                remove(chart.svgObject);
            }
            chart.animateSeries = false;
            chart.redraw = chart.enableAnimation;
            chart.rotatedDataLabelCollections = [];
            blazorTemplatesReset(chart);
            removeElement(
                getElement(chart.element.id + '_Secondary_Element').querySelectorAll('.ejSVGTooltip')[0]
            );
            this.redrawSeriesElements(series, chart);
            chart.removeSvg();
            chart.refreshAxis();
            series.refreshAxisLabel();
            this.refreshSeries(chart.visibleSeries);
            chart.markerRender.removeHighlightedMarker();
            chart.refreshBound();
            chart.trigger('loaded', { chart: chart });
            if (selectedDataIndexes.length > 0) {
                chart.selectionModule.selectedDataIndexes = selectedDataIndexes;
                chart.selectionModule.redrawSelection(chart, chart.selectionMode);
            }
            if (chart.highlightModule && chart.highlightMode !== 'None') {
                chart.highlightModule.redrawSelection(chart, chart.highlightMode);
            }
            chart.redraw = false;
        } else if (chart.selectionModule) {
            chart.selectionModule.legendSelection(chart, seriesIndex, event);
        } else if (chart.highlightModule) {
            chart.highlightModule.legendSelection(chart, seriesIndex, event);
        }
        series.chart[changeDetection] = false;
    }

    private changeSeriesVisiblity(series: Series, visibility: boolean): void {
        series.visible = !visibility;
        if (this.isSecondaryAxis(series.xAxis)) {
            series.xAxis.internalVisibility = series.xAxis.series.some((value: Series) => (value.visible));
        }
        if (this.isSecondaryAxis(series.yAxis)) {
            series.yAxis.internalVisibility = series.yAxis.series.some((value: Series) => (value.visible));
        }
    }
    private isSecondaryAxis(axis: Axis): boolean {
        return((this.chart as Chart).axes.indexOf(axis) > -1);
    }
    private redrawSeriesElements(series: Series, chart: Chart): void {
        if (!chart.redraw) {
            return null;
        }
        removeElement(
            chart.element.id + '_Series_' + (series.index === undefined ? series.category : series.index) +
            '_DataLabelCollections'
        );
    }
    private refreshSeries(seriesCollection: Series[]): void {
        for (let series of seriesCollection) {
            series.position = undefined;
        }
    }
    /**
     * To show the tooltip for the trimmed text in legend.
     * @return {void}
     */
    public click(event: Event | PointerEvent): void {
        if (!this.chart.legendSettings.visible) {
            return;
        }
        let pageX: number = this.chart.mouseX;
        let pageY: number = this.chart.mouseY;
        let legendRegion: ILegendRegions[] = [];
        let targetId: string = (<HTMLElement>event.target).id;
        let legendItemsId: string[] = [this.legendID + '_text_', this.legendID + '_shape_marker_',
        this.legendID + '_shape_'];
        let seriesIndex: number;
        for (let id of legendItemsId) {
            if (targetId.indexOf(id) > -1) {
                seriesIndex = parseInt(targetId.split(id)[1], 10);
                this.LegendClick(seriesIndex, event);
                break;
            }
        }
        if (targetId.indexOf(this.legendID + '_pageup') > -1) {
            this.changePage(event, true);
        } else if (targetId.indexOf(this.legendID + '_pagedown') > -1) {
            this.changePage(event, false);
        }
        if ((this.chart as Chart).enableCanvas && this.pagingRegions.length) {
            this.checkWithinBounds(pageX, pageY);
        }

        legendRegion = this.legendRegions.filter((region: ILegendRegions) => {
            return (withInBounds(pageX, (pageY + (this.isPaging ? (this.currentPageNumber - 1) * this.translatePage(null, 1, 2) : 0)),
                                 region.rect));
        });
        if (legendRegion.length && (this.chart as Chart).enableCanvas) {
            this.LegendClick(legendRegion[0].index, event);
        }
    }
    /**
     * To check click position is within legend bounds
     */
    protected checkWithinBounds(pageX: number , pageY: number): void {
        let cRender: CanvasRenderer = this.chart.renderer as CanvasRenderer;
        let bounds: Rect = this.legendBounds;
        let borderWidth: number = this.chart.legendSettings.border.width;
        let canvasRect: Rect = new Rect(bounds.x, bounds.y, bounds.width, bounds.height);
        canvasRect.x = canvasRect.x - borderWidth / 2;
        canvasRect.y = canvasRect.y - borderWidth / 2;
        canvasRect.width = canvasRect.width + borderWidth;
        canvasRect.height = canvasRect.height + borderWidth;
        if (withInBounds(pageX, pageY, this.pagingRegions[0])) {
            // pagedown calculations are performing here
            if (--this.currentPageNumber > 0) {
                this.legendRegions = [];
                cRender.clearRect(canvasRect);
                cRender.canvasClip(new RectOption('legendClipPath', 'transparent', { width: 0, color: '' }, null, canvasRect));
                this.renderLegend(this.chart, this.legend, bounds);
                cRender.canvasRestore();
            } else {
                ++this.currentPageNumber;
            }
            return null;
        }
        if (withInBounds(pageX, pageY, this.pagingRegions[1])) {
            // pageUp calculations are performing here
            if (++this.currentPageNumber > 0 && this.currentPageNumber <= this.totalNoOfPages) {
                this.legendRegions = [];
                cRender.clearRect(canvasRect);
                cRender.canvasClip(new RectOption('legendClipPath', 'transpaent', { width: 0, color: '' }, null, canvasRect));
                this.renderLegend(this.chart, this.legend, bounds);
                cRender.canvasRestore();
            } else {
                --this.currentPageNumber;
            }
            return null;
        }
    }

    /**
     * Get module name
     */
    protected getModuleName(): string {
        return 'Legend';
    }

    /**
     * To destroy the Legend.
     * @return {void}
     * @private
     */
    public destroy(chart: Chart): void {
        this.removeEventListener();
    }

}