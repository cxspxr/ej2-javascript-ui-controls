import { Property, ChildProperty } from '@syncfusion/ej2-base';

/**  
 * Holds the configuration of columns in kanban board.
 */
export class Columns extends ChildProperty<Columns> {
    /**
     * Defines the column keyField
     * @default null
     */
    @Property()
    public keyField: string;

    /**
     * Defines the column header title
     * @default null
     */
    @Property()
    public headerText: string;

    /**
     * Defines the column template
     * @default null
     */
    @Property()
    public template: string;

    /**
     * Enable or disable toggle column
     * @default false
     */
    @Property(false)
    public allowToggle: boolean;

    /**
     * Defines the collapsed or expandable state
     * @default true
     */
    @Property(true)
    public isExpanded: boolean;

    /**
     * Defines the minimum card count in column
     * @default null
     */
    @Property()
    public minCount: number;

    /**
     * Defines the maximum card count in column
     * @default null
     */
    @Property()
    public maxCount: number;

    /**
     * Enable or disable card count in column
     * @default false
     */
    @Property(false)
    public showItemCount: boolean;

}