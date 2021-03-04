/**
 * Specifies common enumerations
 */

/**
 * It defines the field list render modes. The available modes are:
 * * Fixed - To display the field list icon in pivot table UI to invoke the built-in dialog.
 * * Popup - To display the field list in a static position within a web page.
 */
export type Mode =
    /**
     * To display the field list icon in pivot table UI to invoke the built-in dialog.
     * It hepls to display over the pivot table UI without affecting any form of UI shrink within a web page.
     */
    'Fixed' |
    /** To display the field list in a static position within a web page. */
    'Popup';

/** Allow options for performing CRUD operations with different modes in the data grid that used to update the appropriate cells in the pivot table.
 * The available modes are as follows:
 * * Normal - Allows the currently selected row alone will be completely changed to edit state. You can change the cell values and save it to the data source by clicking “Update” toolbar button.
 * * Dialog - Allows the currently selected row data will be shown in an exclusive dialog. You can change the cell values and save it to the data source by clicking “Save” button in the dialog.
 * * Batch - Allows you to perform double-click on any data specific cell in the data grid, the state of that selected cell will be changed to edit state.
 */
export type EditMode =
    /** Allows the currently selected row alone will be completely changed to edit state. You can change the cell values and save it to the data source by clicking “Update” toolbar button. */
    'Normal' |
    /** Allows the currently selected row data will be shown in an exclusive dialog. You can change the cell values and save it to the data source by clicking “Save” button in the dialog. */
    'Dialog' |
    /**
     * Allows you to perform double-click on any data specific cell in the data grid, the state of that selected cell will be changed to edit state.
     * You can perform bulk changes like add, edit and delete data of the cells and finally save to the data source by clicking “Update” toolbar button.
     */
    'Batch';

/**
 * Defines mode of selection. They are
 * * Cell - Defines SelectionMode to Cell.
 * * Row - Defines SelectionMode to Row.
 * * Column - Defines SelectionMode to Column.
 * * Both - Defines SelectionMode to both Row and Column.
 */
export type SelectionMode =
    /** Defines SelectionMode to Cell */
    'Cell' |
    /** Defines SelectionMode to Row */
    'Row' |
    /** Defines SelectionMode to Column */
    'Column' |
    /** Defines SelectionMode to both Row and Column */
    'Both';

/**
 * Defines border style to PDF export file. They are
 * * Solid - Export as PDF with solid type border.
 * * Dash - Export as PDF with dash type border.
 * * Dot - Export as PDF with dot type border.
 * * DashDot - Export as PDF with dashdot type border.
 * * DashDotDot - Export as PDF with dashdotdot type border.
 */
export type PdfBorderStyle =
    /** Export as PDF with solid type border. */
    'Solid' |
    /** Export as PDF with dash type border. */
    'Dash' |
    /** Export as PDF with dot type border. */
    'Dot' |
    /** Export as PDF with dashdot type border. */
    'DashDot' |
    /** Export as PDF with dashdotdot type border. */
    'DashDotDot';

/**
 * Allows the built-in toolbar options that used to access features like switching between pivot table and pivot chart, changing chart types, conditional formatting, number formatting, exporting, etc… with ease at runtime.
 * The available toolbar options are:
 * * New - Allows to create a new report.
 * * Save - Allows to save the current report.
 * * Save As - Allows to perform save as the current report.
 * * Rename - Allows to rename the current report.
 * * Remove - Allows to delete the current report.
 * * Load - Allows to load any report from the report list.
 * * Grid - Allows to show the pivot table.
 * * Chart - Allows to show the pivot chart with specific type from the built-in list.
 * * Exporting - Allow set of options to export the pivot table as PDF/Excel/CSV and the pivot chart as PDF and image format such as PNG, JPEG, SVG.
 * * Sub-total - Allow set of options to show or hide the sub totals in the pivot table. The subtotals will not be displayed in the pivot chart by default.
 * * Grand Total - Allow set of options to show or hides the grand totals in the pivot table. By default, the grand totals will not be displayed in the pivot chart.
 * * Conditional Formatting - Allows to show the conditional formatting pop-up to apply formatting to the values.
 * * Number Formatting - Allows to show the number formatting pop-up to apply number formatting to the values.
 * * Formatting - Allow options to show the conditional formatting and the number formatting pop-up that used to apply formatting to the values in the component.
 * * Field List - Allows you to show the field list pop-up. It allows you to modify the report with a variety of actions such as re-arrange the fields between axes by drag-and-drop,
 * add new fields to report, remove any fields from report, filtering and sorting a specific field members, etc., that are used to update the pivot table during runtime.
 * * MDX - Allows ro show the MDX query that was run to retrieve data from the OLAP data source. **Note: It is applicable only for OLAP data source.**
 */
export type ToolbarItems =
    /** Allows to create a new report. */
    'New' |
    /** Allows to save the current report. */
    'Save' |
    /** Allows to perform save as the current report. */
    'SaveAs' |
    /** Allows to load any report from the report list. */
    'Load' |
    /** Allows to rename the current report. */
    'Rename' |
    /** Allows to delete the current report. */
    'Remove' |
    /** Allows to show the pivot table. */
    'Grid' |
    /**
     * Allows to show the pivot chart with specific type from the built-in list.
     * It also has the option to show the chart with multiple axes based on the value fields bound to the report.
     * You can do this by selecting the checkbox at the bottom of the list.
     */
    'Chart' |
    /** Allow set of options to export the pivot table as PDF/Excel/CSV and the pivot chart as PDF and image format such as PNG, JPEG, SVG. */
    'Export' |
    /** Allow set of options to show or hide the sub totals in the pivot table. The subtotals will not be displayed in the pivot chart by default. */
    'SubTotal' |
    /** Allow set of options to show or hides the grand totals in the pivot table. By default, the grand totals will not be displayed in the pivot chart. */
    'GrandTotal' |
    /** Shows the fieldlist pop-up. */
    'FieldList' |
    /**
     * Allows you to show the field list pop-up. It allows you to modify the report with a variety of actions such as re-arrange the fields between axes by drag-and-drop,
     * add new fields to report, remove any fields from report, filtering and sorting a specific field members, etc., that are used to update the pivot table during runtime.
     */
    'ConditionalFormatting' |
    /** Shows the MDX query that was run to retrieve data from the OLAP data source. */
    'MDX' |
    /**
     * Allows ro show the MDX query that was run to retrieve data from the OLAP data source.
     * > It is applicable only for OLAP data source.
     */
    'NumberFormatting' |
    /** Allow options to show the conditional formatting and the number formatting pop-up that used to apply formatting to the values in the component. */
    'Formatting';

/**
 * It defines the view port as either table or chart or both table and chart. The available options are:
 * * Table - To render the component as tabular form.
 * * Chart - To render the component as graphical format.
 * * Both - To render the component as both table and chart.
 */
export type View =
    /**  To render the component as both table and chart. */
    'Both' |
    /**  To render the component as graphical format. */
    'Chart' |
    /**  To render the component as tabular form. */
    'Table';

/**
 * Allows you to set the primary view to be either table or chart.The available options are:
 * * Table - Allows you to display the pivot table as primary view.
 * * Chart - Allows you to display the pivot chart as primary view.
 */
export type Primary =
    /**  Allows you to display the pivot table as primary view. */
    'Chart' |
    /**  Allows you to display the pivot chart as primary view. */
    'Table';

/**
 * Defines the pivot chart types.
 * The available chart types are:
 * * Line - Allows to display the pivot chart with line series.
 * * Column - Allows to display the pivot chart with column series.
 * * Area - Allows to display the pivot chart with area series.
 * * Bar - Allows to display the pivot chart with bar series.
 * * StackingColumn - Allows to display the pivot chart with stacked column series.
 * * StackingArea - Allows to display the pivot chart with stacked area series.
 * * StackingBar - Allows to display the pivot chart with stacked bar series.
 * * StepLine - Allows to display the pivot chart with step line series.
 * * StepArea - Allows to display the pivot chart with step area series.
 * * SplineArea - Allows to display the pivot chart with spline area series.
 * * Scatter - Allows to display the pivot chart with scatter series.
 * * Spline - Allows to display the pivot chart with spline series.
 * * StackingColumn100 - Allows to display the pivot chart with 100% stacked column series.
 * * StackingBar100 - Allows to display the pivot chart with 100% stacked bar series.
 * * StackingArea100 - Allows to display the pivot chart with 100% stacked area series.
 * * Bubble - Allows to display the pivot chart with bubble series.
 * * Pareto - Allows to display the pivot chart with pareto series.
 * * Polar - Allows to display the pivot chart with polar series.
 * * Radar - Allows to display the pivot chart with radar series.
 */
export type ChartSeriesType =
    /**  Allows to display the pivot chart with line series. */
    'Line' |
    /**  Allows to display the pivot chart with column series. */
    'Column' |
    /**  Allows to display the pivot chart with area series. */
    'Area' |
    /**  Allows to display the pivot chart with bar series. */
    'Bar' |
    /**  Allows to display the pivot chart with stacked column series. */
    'StackingColumn' |
    /**  Allows to display the pivot chart with stacked area series. */
    'StackingArea' |
    /**  Allows to display the pivot chart with stacked bar series. */
    'StackingBar' |
    /**  Allows to display the pivot chart with step line series. */
    'StepLine' |
    /**  Allows to display the pivot chart with step area series. */
    'StepArea' |
    /**  Allows to display the pivot chart with spline area series. */
    'SplineArea' |
    /**  Allows to display the pivot chart with scatter series. */
    'Scatter' |
    /**  Allows to display the pivot chart with spline series. */
    'Spline' |
    /** Allows to display the pivot chart with 100% stacked column series. */
    'StackingColumn100' |
    /** Allows to display the pivot chart with 100% stacked bar series. */
    'StackingBar100' |
    /** Allows to display the pivot chart with 100% stacked area series. */
    'StackingArea100' |
    /** Allows to display the pivot chart with bubble series. */
    'Bubble' |
    /** Allows to display the pivot chart with pareto series. */
    'Pareto' |
    /** Allows to display the pivot chart with polar series. */
    'Polar' |
    /** Allows to display the pivot chart with radar series. */
    'Radar' |
    /** Allows to display the pivot chart with pie series. */
    'Pie' |
    /** Allows to display the pivot chart with pyramid series. */
    'Pyramid' |
    /** Allows to display the pivot chart with doughnut series. */
    'Doughnut' |
    /** Allows to display the pivot chart with funnel series. */
    'Funnel';

/**
 * Defines the pivot chart selection mode. They are
 * * None - Disable the selection.
 * * Series - To select a series.
 * * Point - To select a point.
 * * Cluster - To select a cluster of point.
 * * DragXY - To select points, by dragging with respect to both horizontal and vertical axis.
 * * DragY - To select points, by dragging with respect to vertical axis.
 * * DragX - To select points, by dragging with respect to horizontal axis.
 */
export type ChartSelectionMode =
    /** Disable the selection. */
    'None' |
    /** To select a series. */
    'Series' |
    /** To select a point. */
    'Point' |
    /** To select a cluster of point. */
    'Cluster' |
    /** To select points, by dragging with respect to both horizontal and vertical axis. */
    'DragXY' |
    /** To select points, by dragging with respect to vertical axis. */
    'DragY' |
    /** To select points, by dragging with respect to horizontal axis. */
    'DragX';

/**
 * Defines the pivot table context menu items. They are
 * * Drillthrough - Enables drill through for the cell.
 * * Expand - Expands the cell.
 * * Collapse - Collapse the cell.
 * * CalculatedField - Enables calculated field for the pivot grid.
 * * Pdf Export - Export the grid as Pdf format.
 * * Excel Export - Export the grid as Excel format.
 * * Csv Export - Export the grid as CSV format.
 * * Sort Ascending - Sort the current column in ascending order.
 * * Sort Descending - Sort the current column in descending order.
 * * Aggregate - Sets aggregate type to sum.
 */
export type PivotTableContextMenuItem =
    /** Enables drill through for the cell. */
    'Drillthrough' |
    /** Expands the cell. */
    'Expand' |
    /** Collapse the cell. */
    'Collapse' |
    /** Enables calculated field for the pivot grid. */
    'CalculatedField' |
    /** Export the grid as Pdf format. */
    'Pdf Export' |
    /** Export the grid as Excel format. */
    'Excel Export' |
    /** Export the grid as CSV format. */
    'Csv Export' |
    /** Sort the current column in ascending order. */
    'Sort Ascending' |
    /** Sort the current column in descending order. */
    'Sort Descending' |
    /** Sets aggregate type to sum. */
    'Aggregate';

/**
 * Defines modes of GridLine, They are
 * * Both - Show both the vertical and horizontal line in the Grid.
 * * None - Hide both the vertical and horizontal line in the Grid.
 * * Horizontal - Shows the horizontal line only in the Grid.
 * * Vertical - Shows the vertical line only in the Grid.
 * * Default - Shows the grid lines based on the theme.
 */
export type PivotTableGridLine =
    /** Show both the vertical and horizontal line in the Grid. */
    'Both' |
    /** Hide both the vertical and horizontal line in the Grid. */
    'None' |
    /** Shows the horizontal line only in the Grid. */
    'Horizontal' |
    /** Shows the vertical line only in the Grid. */
    'Vertical' |
    /** Shows the grid lines based on the theme. */
    'Default';

/**
 * Defines mode of cell selection. The modes available are:
 * * Flow - Allows the range of cells to be selected between the start index and the end index, which also includes the other cells of the selected rows in the pivot table.
 * * Box - Allows you to select a range of cells within the starting and ending column indexes that are included in the range between row cells in the pivot table.
 * * BoxWithBorder - Allows the range of cells to be selected as the box mode, but along with the borders in the pivot table.
 */
export type PivotCellSelectionMode =
    /**  Allows the range of cells to be selected between the start index and the end index, which also includes the other cells of the selected rows in the pivot table. */
    'Flow' |
    /**  Allows you to select a range of cells within the starting and ending column indexes that are included in the range between row cells in the pivot table. */
    'Box' |
    /**  Allows the range of cells to be selected as the box mode, but along with the borders in the pivot table. */
    'BoxWithBorder';

/**
 * Defines types of Selection. They are:
 * * Single - Allows the user to select a row or cell on their own in the pivot table.
 * * Multiple - Allows the user to select multiple rows or columns or cells in the pivot table.
 */
export type PivotTableSelectionType =
    /** Allows the user to select a row or cell on their own in the pivot table. */
    'Single' |
    /** Allows the user to select multiple rows or columns or cells in the pivot table. */
    'Multiple';

/**
 * Defines modes of checkbox Selection. They are:
 * * Default - Allows multiple rows to be selected by clicking rows one by one.
 * * ResetOnRowClick - Allows to reset the previously selected row when a row is clicked and multiple rows can be selected by using CTRL or SHIFT key.
 */
export type PivotTableCheckboxSelectionType =
    /**  Allows multiple rows to be selected by clicking rows one by one. */
    'Default' |
    /**  Allows to reset the previously selected row when a row is clicked and multiple rows can be selected by using CTRL or SHIFT key. */
    'ResetOnRowClick';

/**
 * Defines the cell content's overflow mode. The available modes are
 * * Clip -  Truncates the cell content when it overflows its area.
 * * Ellipsis -  Displays ellipsis when the cell content overflows its area.
 * * EllipsisWithTooltip - Displays ellipsis when the cell content overflows its area
 * also it will display tooltip while hover on ellipsis applied cell.
 */
export type PivotTableClipMode =
    /**  Truncates the cell content when it overflows its area */
    'Clip' |
    /** Displays ellipsis when the cell content overflows its area */
    'Ellipsis' |
    /** Displays ellipsis when the cell content overflows its area also it will display tooltip while hover on ellipsis applied cell. */
    'EllipsisWithTooltip';

/**
 * Print mode options are
 * * AllPages - Print all pages records of the Grid.
 * * CurrentPage - Print current page records of the Grid.
 */
export type PivotTablePrintMode =
    /**  Print all pages records of the Grid. */
    'AllPages' |
    /**  Print current page records of the Grid. */
    'CurrentPage';

/**
 * Defines the shape of marker. They are
 * * circle - Renders the marker shaper as circle.
 * * rectangle - Renders the marker shaper as rectangle.
 * * triangle - Renders the marker shaper as triangle.
 * * diamond - Renders the marker shaper as diamond.
 * * cross - Renders the marker shaper as cross.
 * * horizontalLine - Renders the marker shaper as horizontalLine.
 * * verticalLine - Renders the marker shaper as verticalLine.
 * * pentagon- Renders the marker shaper as pentagon.
 * * invertedTriangle - Renders the marker shaper as invertedTriangle.
 * * image - Renders the marker shaper as image.
 */
export type PivotChartShape =
    /** Render the marker shaper as circle. */
    'Circle' |
    /** Render the marker shaper as Rectangle. */
    'Rectangle' |
    /** Render the marker shaper as Triangle. */
    'Triangle' |
    /** Render the marker shaper as Diamond. */
    'Diamond' |
    /** Render the marker shaper as Cross. */
    'Cross' |
    /** Render the marker shaper as HorizontalLine. */
    'HorizontalLine' |
    /** Render the marker shaper as VerticalLine. */
    'VerticalLine' |
    /** Render the marker shaper as Pentagon. */
    'Pentagon' |
    /** Render the marker shaper as InvertedTriangle. */
    'InvertedTriangle' |
    /** Render the marker shaper as Image. */
    'Image';

/**
 * Defines the type of error bar. They are
 * * fixed - Renders a fixed type error bar.
 * * percentage - Renders a percentage type error bar.
 * * standardDeviation - Renders a standard deviation type error bar.
 * * standardError - Renders a standard error type error bar.
 * * custom - Renders a custom type error bar.
 */
export type PivotChartErrorBarType =
    /** Renders a fixed type error bar. */
    'Fixed' |
    /** Renders a percentage type error bar. */
    'Percentage' |
    /** Renders a standard deviation type error bar. */
    'StandardDeviation' |
    /** Renders a standard error type error bar. */
    'StandardError' |
    /** Renders a custom type error bar. */
    'Custom';

/**
 * Defines the direction of error bar. They are
 * * both -  Renders both direction of error bar.
 * * minus - Renders minus direction of error bar.
 * * plus - Renders plus direction error bar.
 */
export type PivotChartErrorBarDirection =
    /** Renders both direction of error bar. */
    'Both' |
    /** Renders minus direction of error bar. */
    'Minus' |
    /** Renders plus direction error bar. */
    'Plus';

/**
 * Defines the modes of error bar. They are
 * * vertical -  Renders a vertical error bar.
 * * horizontal - Renders a horizontal error bar.
 * * both - Renders both side error bar.
 */
export type PivotChartErrorBarMode =
    /** Renders a vertical error bar. */
    'Vertical' |
    /** Renders a horizontal error bar. */
    'Horizontal' |
    /** Renders both side error bar. */
    'Both';

/**
 * Defines the type of trendlines. They are:
 * * Linear - Defines the linear trendline.
 * * Exponential - Defines the exponential trendline.
 * * Polynomial - Defines the polynomial trendline.
 * * Power - Defines the power trendline.
 * * Logarithmic - Defines the logarithmic trendline.
 * * MovingAverage - Defines the moving average trendline.
 */
export type PivotChartTrendlineTypes =
    /** Defines the linear trendline. */
    'Linear' |
    /** Defines the exponential trendline. */
    'Exponential' |
    /** Defines the polynomial trendline. */
    'Polynomial' |
    /** Defines the power trendline. */
    'Power' |
    /** Defines the logarithmic trendline. */
    'Logarithmic' |
    /** Defines the moving average trendline. */
    'MovingAverage';

/**
 * Defines the shape of legend. They are
 * * circle - Renders a circle.
 * * rectangle - Renders a rectangle.
 * * triangle - Renders a triangle.
 * * diamond - Renders a diamond.
 * * cross - Renders a cross.
 * * horizontalLine - Renders a horizontalLine.
 * * verticalLine - Renders a verticalLine.
 * * pentagon - Renders a pentagon.
 * * invertedTriangle - Renders a invertedTriangle.
 * * SeriesType -Render a legend shape based on series type.
 */
export type PivotChartLegendShape =
    /** Render a legend shape based on series type. */
    'SeriesType' |
    /** Render a circle. */
    'Circle' |
    /** Render a Rectangle. */
    'Rectangle' |
    /** Render a Triangle. */
    'Triangle' |
    /** Render a Diamond. */
    'Diamond' |
    /** Render a Cross. */
    'Cross' |
    /** Render a HorizontalLine. */
    'HorizontalLine' |
    /** Render a VerticalLine. */
    'VerticalLine' |
    /** Render a Pentagon. */
    'Pentagon' |
    /** Render a InvertedTriangle. */
    'InvertedTriangle';

/**
 * Defines the empty point mode of the chart.
 * * Gap - Used to display empty points as space.
 * * Zero - Used to display empty points as zero.
 * * Drop - Used to ignore the empty point while rendering.
 * * Average - Used to display empty points as previous and next point average.
 */
export type PivotChartEmptyPointMode =
    /** Used to display empty points as space. */
    'Gap' |
    /** Used to display empty points as zero. */
    'Zero' |
    /** Used to ignore the empty point while rendering. */
    'Drop' |
    /** Used to display empty points as previous and next point average. */
    'Average';

/**
 * Defines the Alignment. They are
 * * near - Align the element to the left.
 * * center - Align the element to the center.
 * * far - Align the element to the right.
 */
export type PivotChartAlignment =
    /** Align the element to the center. */
    'Center' |
    /** Align the element to the left. */
    'Near' |
    /** Align the element to the right. */
    'Far';

/**
 * Defines the Text overflow.
 * * None - Shown the chart title with overlap if exceed.
 * * Wrap - Shown the chart title with wrap if exceed.
 * * Trim - Shown the chart title with trim if exceed.
 */
export type PivotChartTextOverflow =
    /** Used to show the chart title with Trim. */
    'Trim' |
    /** Used to show the chart title with overlap to other element. */
    'None' |
    /** Used to show the chart title with Wrap support. */
    'Wrap';

/**
 * Defines the unit of Strip line Size. They are
 * * auto - In numeric axis, it will consider a number and DateTime axis, it will consider as milliseconds.
 * * pixel - The stripline gets their size in pixel.
 * * year - The stipline size is based on year in the DateTime axis.
 * * month - The stipline size is based on month in the DateTime axis.
 * * day - The stipline size is based on day in the DateTime axis.
 * * hour - The stipline size is based on hour in the DateTime axis.
 * * minutes - The stipline size is based on minutes in the DateTime axis.
 * * seconds - The stipline size is based on seconds in the DateTime axis.
 */
export type PivotChartSizeType =
    /**   In numeric axis, it will consider a number and DateTime axis, it will consider as milliseconds. */
    'Auto' |
    /** The stripline gets their size in pixel. */
    'Pixel' |
    /**  The stipline size is based on year in the DateTime axis. */
    'Years' |
    /** The stipline size is based on month in the DateTime axis. */
    'Months' |
    /** The stipline size is based on day in the DateTime axis. */
    'Days' |
    /** The stipline size is based on hour in the DateTime axis. */
    'Hours' |
    /** The stipline size is based on minutes in the DateTime axis. */
    'Minutes' |
    /** The stipline size is based on seconds in the DateTime axis. */
    'Seconds';

/**
 * Defines the strip line text position.
 * * Start - Places the strip line text at the start.
 * * Middle - Places the strip line text in the middle.
 * * End - Places the strip line text at the end.
 */
export type PivotChartAnchor =
    /** Places the strip line text in the middle. */
    'Middle' |
    /** Places the strip line text at the start. */
    'Start' |
    /** Places the strip line text at the end. */
    'End';

/**
 *  Specifies the order of the strip line. `Over` | `Behind`.
 * * Over - Places the strip line over the series elements.
 * * Behind - laces the strip line behind the series elements.
 */
export type PivotChartZIndex =
    /** Places the strip line behind the series elements. */
    'Behind' |
    /** Places the strip line over the series elements. */
    'Over';

/**
 * Defines border type for multi level labels.
 * * Rectangle - Shows chart border as rectangle.
 * * Brace - Shows chart border as braces.
 * * WithoutBorder - Shows chart without border.
 * * Without top Border -  Shows chart with border on its top.
 * * Without top and bottom border - Shows chart with border on its top and bottom.
 * * Curly brace - Shows chart with curly braces.
 */
export type PivotChartBorderType =
    /** Shows chart border as rectangle. */
    'Rectangle' |
    /** Shows chart border as braces. */
    'Brace' |
    /** Shows chart without border. */
    'WithoutBorder' |
    /** Shows chart with border on its top. */
    'WithoutTopBorder' |
    /** Shows chart with border on its top and bottom. */
    'WithoutTopandBottomBorder' |
    /** Shows chart with curly braces. */
    'CurlyBrace';

/**
 * Defines the mode of line in crosshair. They are
 * * none - Hides both vertical and horizontal crosshair line.
 * * both - Shows both vertical and horizontal crosshair line.
 * * vertical - Shows the vertical line.
 * * horizontal - Shows the horizontal line.
 */
export type PivotChartLineType =
    /** Shows both vertical and horizontal crosshair line. */
    'Both' |
    /** Hides both vertical and horizontal crosshair line. */
    'None' |
    /** Shows the vertical line. */
    'Vertical' |
    /** Shows the horizontal line. */
    'Horizontal';

/**
 * Defines the SelectionMode for chart types pie, doughnut, Funnel and pyramid.
 * * none - Disable the selection.
 * * point - To select a point.
 */
export type PivotAccumulationChartSelectionMode =
    /** Disable the selection. */
    'None' |
    /** To select a point. */
    'Point';

/**
 * Defines the ConnectorType for chart types pie, doughnut, Funnel and pyramid. They are
 * * Line - Accumulation series Connector line type as Straight line.
 * * Curve - Accumulation series Connector line type as Curved line.
 * *
 */
export type PivotChartConnectorType =
    /** Accumulation series Connector line type as Straight line */
    'Line' |
    /** Accumulation series Connector line type as Curved line */
    'Curve';

/**
 * Defines the LabelPosition for chart types pie, doughnut, Funnel and pyramid. They are
 * * Inside - Define the data label position for the accumulation series Inside.
 * * Outside - Define the data label position for the accumulation series Outside.
 * *
 */
export type PivotChartLabelPosition =
    /** Define the data label position for the accumulation series Inside */
    'Inside' |
    /** Define the data label position for the accumulation series Outside */
    'Outside';

/**
 * Defines the mode of the group mode for chart types pie, doughnut, Funnel and pyramid
 * * Point - When choosing points, the selected points get grouped.
 * * Value - When choosing values, the points which less then values get grouped.
 */
export type PivotChartGroupModes =
    /** When choosing points, the selected points get grouped */
    'Point' |
    /** When choosing values, the points which less then values get grouped. */
    'Value';

/**
 * Defines the mode of the pyramid
 * * Linear - Height of the pyramid segments reflects the values
 * * Surface - Surface/Area of the  pyramid segments reflects the values
 */
export type PivotChartPyramidModes =
    /** Height of the pyramid segments reflects the values */
    'Linear' |
    /** Surface/Area of the  pyramid segments reflects the values */
    'Surface';

/**
 * Defines the position of the legend. They are
 * * auto - Places the legend based on area type.
 * * top - Displays the legend on the top of chart.
 * * left - Displays the legend on the left of chart.
 * * bottom - Displays the legend on the bottom of chart.
 * * right - Displays the legend on the right of chart.
 * * custom - Displays the legend  based on given x and y value.
 */
export type PivotChartLegendPosition =
    /** Places the legend based on area type. */
    'Auto' |
    /** Places the legend on the top of chart. */
    'Top' |
    /** Places the legend on the left of chart. */
    'Left' |
    /** Places the legend on the bottom of chart. */
    'Bottom' |
    /** Places the legend on the right of chart. */
    'Right' |
    /** Places the legend based on given x and y. */
    'Custom';

/**
 * * Type of series to be drawn in radar or polar series. They are
 * * line - Renders the line series.
 * * column - Renders the column series.
 * * area - Renders the area series.
 * * scatter - Renders the scatter series.
 * * spline - Renders the spline series.
 * * stackingColumn - Renders the stacking column series.
 * * stackingArea - Renders the stacking area series.
 * * rangeColumn - Renders the range column series.
 * * splineArea - Renders the spline area series.
 */
export type PivotChartDrawType =
    /**  Define the line series. */
    'Line' |
    /**  Define the Column series. */
    'Column' |
    /**  Define the stacking Column series. */
    'StackingColumn' |
    /**  Define the Area series. */
    'Area' |
    /**  Define the Scatter series. */
    'Scatter' |
    /** Define the Range column series */
    'RangeColumn' |
    /** Define the Spline series */
    'Spline' |
    /** Define the Spline Area series */
    'SplineArea' |
    /** Define the spline series */
    'StackingArea' |
    /** Define the Stacking line series */
    'StackingLine';

/**
 * It defines type of spline.
 * Natural - Used to render Natural spline.
 * Cardinal - Used to render cardinal spline.
 * Clamped - Used to render Clamped spline
 * Monotonic - Used to render monotonic spline
 */
export type PivotChartSplineType =
    /** Used to render natural spline type */
    'Natural' |
    /** Used to render Monotonicspline  */
    'Monotonic' |
    /** Used to render Cardinal */
    'Cardinal' |
    /** Used to render Clamped */
    'Clamped';

/**
 * Defines the Alignment. They are
 * * none - Shows all the labels.
 * * hide - Hide the label when it intersect.
 * * rotate45 - Rotate the label to 45 degree when it intersect.
 * * rotate90 - Rotate the label to 90 degree when it intersect.
 */
export type PivotChartLabelIntersectAction =
    /** Rotate the label to 45 degree when it intersect. */
    'Rotate45' |
    /** Shows all the labels. */
    'None' |
    /** Hide the label when it intersect. */
    'Hide' |
    /** Trim the label when it intersect. */
    'Trim' |
    /** Wrap the label when it intersect. */
    'Wrap' |
    /** Arrange the label in multiple row when it intersect. */
    'MultipleRows' |
    /** Rotate the label to 90 degree when it intersect. */
    'Rotate90';

/**
 * Defines the Edge Label Placement for an axis. They are
 * * none - No action will be perform.
 * * hide - Edge label will be hidden.
 * * shift - Shift the edge labels.
 */
export type PivotChartEdgeLabelPlacement =
    /**  Render the edge label in axis. */
    'None' |
    /**  Hides the edge label in axis. */
    'Hide' |
    /**  Shift the edge series in axis. */
    'Shift';

/**
 * Defines the Label Placement for category axis. They are
 * * betweenTicks - Render the label between the ticks.
 * * onTicks - Render the label on the ticks.
 */
export type PivotChartLabelPlacement =
    /**  Render the label between the ticks. */
    'BetweenTicks' |
    /**  Render the label on the ticks. */
    'OnTicks';

/**
 * Defines the Position. They are
 * * inside - Place the ticks or labels inside to the axis line.
 * * outside - Place the ticks or labels outside to the axis line.
 */
export type PivotChartAxisPosition =
    /** Place the ticks or labels outside to the axis line. */
    'Outside' |
    /** Place the ticks or labels inside to the axis line. */
    'Inside';

/**
 * Defines the zooming mode, They are.
 * * x,y - Chart will be zoomed with respect to both vertical and horizontal axis.
 * * x - Chart will be zoomed with respect to horizontal axis.
 * * y - Chart will be zoomed with respect to vertical axis.
 */
export type PivotChartZoomMode =
    /** Chart will be zoomed with respect to both vertical and horizontal axis. */
    'XY' |
    /** Chart will be zoomed with respect to horizontal axis. */
    'X' |
    /** Chart will be zoomed with respect to vertical axis. */
    'Y';

/**
 * Defines the ZoomingToolkit, They are.
 * * zoom - Renders the zoom button.
 * * zoomIn - Renders the zoomIn button.
 * * zoomOut - Renders the zoomOut button.
 * * pan - Renders the pan button.
 * * reset - Renders the reset button.
 */
export type PivotChartToolbarItems =
    /** Renders the zoom button. */
    'Zoom' |
    /** Renders the zoomIn button. */
    'ZoomIn' |
    /** Renders the zoomOut button. */
    'ZoomOut' |
    /** Renders the pan button. */
    'Pan' |
    /** Renders the reset button. */
    'Reset';

/**
 * Defines Theme of the chart. They are
 * * Material - Render a chart with Material theme.
 * * Fabric - Render a chart with Fabric theme.
 * * Bootstrap - Render a chart with Bootstrap theme.
 * * HighContrastLight - Render a chart with HighcontrastLight theme.
 * * MaterialDark - Render a chart with MaterialDark theme.
 * * FabricDark - Render a chart with FabricDark theme.
 * * HighContrast - Render a chart with HighContrast theme.
 * * BootstrapDark - Render a chart with BootstrapDark theme.
 * * Bootstrap4 - Render a chart with Bootstrap4 theme.
 */
export type PivotChartTheme =
    /**  Render a chart with Material theme. */
    'Material' |
    /**  Render a chart with Fabric theme. */
    'Fabric' |
    /**  Render a chart with Bootstrap theme. */
    'Bootstrap' |
    /**  Render a chart with HighcontrastLight theme. */
    'HighContrastLight' |
    /**  Render a chart with MaterialDark theme. */
    'MaterialDark' |
    /**  Render a chart with FabricDark theme. */
    'FabricDark' |
    /**  Render a chart with HighContrast theme. */
    'HighContrast' |
    /**  Render a chart with BootstrapDark theme. */
    'BootstrapDark' |
    /**  Render a chart with Bootstrap4 theme. */
    'Bootstrap4';

/**
 * Defines the data label position. They are,
 * * Outer: Positions the label outside the point.
 * * top: Positions the label on top of the point.
 * * Bottom: Positions the label at the bottom of the point.
 * * Middle: Positions the label to the middle of the point.
 * * Auto: Positions the label based on series.
 */
export declare type LabelPosition =
    /** Position the label outside the point. */
    'Outer' |
    /** Position the label on top of the point. */
    'Top' |
    /** Position the label on bottom of the point. */
    'Bottom' |
    /** Position the label to middle of the point. */
    'Middle' |
    /** Position the label based on series. */
    'Auto';

/**
 * Allows to display the values in the pivot table with appropriate aggregations such as sum, product, count, average, etc… The available types are,
 * * Sum - Allows to display the pivot table values with sum.
 * * Product - Allows to display the pivot table values with product.
 * * Count - Allows to display the pivot table values with count.
 * * DistinctCount - Allows to display the pivot table values with distinct count.
 * * Min - Allows to display the pivot table with minimum value.
 * * Max - Allows to display the pivot table with maximum value.
 * * Avg - Allows to display the pivot table values with average.
 * * Median - Allows to display the pivot table values with median.
 * * Index - Allows to display the pivot table values with index.
 * * PopulationStDev - Allows to display the pivot table values with population standard deviation.
 * * SampleStDev - Allows to display the pivot table values with sample standard deviation.
 * * PopulationVar - Allows to display the pivot table values with population variance.
 * * SampleVar - Allows to display the pivot table values with sample variance.
 * * RunningTotals - Allows to display the pivot table values with running totals.
 * * DifferenceFrom - Allows to display the pivot table values with difference from the value of the base item in the base field.
 * * PercentageOfDifferenceFrom - Allows to display the pivot table values with percentage difference from the value of the base item in the base field.
 * * PercentageOfGrandTotal - Allows to display the pivot table values with percentage of grand total of all values.
 * * PercentageOfColumnTotal - Allows to display the pivot table values in each column with percentage of total values for the column.
 * * PercentageOfRowTotal - Allows to display the pivot table values in each row with percentage of total values for the row.
 * * PercentageOfParentTotal - Allows to display the pivot table values with percentage of total of all values based on selected field.
 * * PercentageOfParentColumnTotal - Allows to display the pivot table values with percentage of its parent total in each column.
 * * PercentageOfParentRowTotal - Allows to display the pivot table values with percentage of its parent total in each row.
 *
 * > It is applicable only for relational data source.
 */
export type AggregateTypes =
    /** Allows to display the pivot table values with sum. */
    'Sum' |
    /** Allows to display the pivot table values with product. */
    'Product' |
    /** Allows to display the pivot table values with count. */
    'Count' |
    /** Allows to display the pivot table values with distinct count. */
    'DistinctCount' |
    /** Allows to display the pivot table with median value. */
    'Median' |
    /** Allows to display the pivot table with minimum value. */
    'Min' |
    /** To display with maximum value. */
    'Max' |
    /** Allows to display the pivot table with maximum value. */
    'Avg' |
    /** Allows to display the pivot table values with average. */
    'Index' |
    /** Allows to display the pivot table values with percentage of grand total of all values. */
    'PercentageOfGrandTotal' |
    /** Allows to display the pivot table values in each column with percentage of total values for the column. */
    'PercentageOfColumnTotal' |
    /** Allows to display the pivot table values in each row with percentage of total values for the row. */
    'PercentageOfRowTotal' |
    /** Allows to display the pivot table values with percentage of its parent total in each row. */
    'PercentageOfParentRowTotal' |
    /** Allows to display the pivot table values with percentage of its parent total in each column. */
    'PercentageOfParentColumnTotal' |
    /** Allows to display the pivot table values with percentage of total of all values based on selected field. */
    'PercentageOfParentTotal' |
    /** Allows to display the pivot table values with running totals. */
    'RunningTotals' |
    /** Allows to display the pivot table values with population standard deviation. */
    'PopulationStDev' |
    /** Allows to display the pivot table values with sample standard deviation. */
    'SampleStDev' |
    /** Allows to display the pivot table values with population variance. */
    'PopulationVar' |
    /** Allows to display the pivot table values with sample variance. */
    'SampleVar' |
    /** Allows to display the pivot table values with difference from the value of the base item in the base field. */
    'DifferenceFrom' |
    /** Allows to display the pivot table values with percentage difference from the value of the base item in the base field. */
    'PercentageOfDifferenceFrom';
