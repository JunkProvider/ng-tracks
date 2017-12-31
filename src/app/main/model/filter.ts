import { filterDefinitions, defaultFilterType } from './filter-definitions';
import { Event } from '@junkprovider/common';

export function createNewFilter() {
    return new Filter(filterDefinitions, defaultFilterType);
}

export class Filter {
    private static nextId = 0;

    static fromData(definitionsMappedByType: { [index: string]: FilterDefinition<string>; }, data: FilterData<string>) {
      const filter = new Filter(definitionsMappedByType, data.type);
      filter.operator = data.operator;
      filter.value = data.value;
      return filter;
    }

    readonly changedEvent = new Event<void>();

    private readonly definitionsMappedByType: { [index: string]: FilterDefinition<string>; };
    private definition: FilterDefinition<string>;
    private data: FilterData<string>;

    get id() { return this.data.id; }

    get type() { return this.data.type; }
    set type(type: string) { this.data.type = type; this.onTypeChanged() }

    get operator() { return this.data.operator; }
    set operator(operator: string) { this.data.operator = operator; this.onChanged(); }

    get value() { return this.data.value; }
    set value(value: string) { this.data.value = value; this.onChanged(); }

    get text() {
        return this.definition.typeText + ' ' + this.definition.operators[this.data.operator] + ' ' + this.data.value;
    }

    get operators() {
        return this.definition.operators;
    }

    get operatorsAsArray() {
        const operators: { value: string; text: string; }[] = [];
        for (let value in this.definition.operators) {
            operators.push({ value: value, text: this.definition.operators[value] });
        }
        return operators;
    }

    constructor(definitionsMappedByType: { [index: string]: FilterDefinition<string>; }, type: string) {
        this.definitionsMappedByType = definitionsMappedByType;
        this.data = {
            id: Filter.nextId++,
            type: type,
            operator: null,
            value: null
        };
        this.onTypeChanged();
    }

    getData() {
        return Object.assign({}, this.data);
    }

    private onTypeChanged() {
        if (this.definitionsMappedByType[this.data.type] === undefined) {
            throw new Error('No filter definition for type ' + this.data.type + ' found.');
        }
        this.definition = this.definitionsMappedByType[this.data.type];
        this.data.operator = this.definition.defaultOperator;
        this.data.value = this.definition.defaultValue;
        this.onChanged();
    }

    private onChanged() {
        this.changedEvent.trigger(this, null);
    }
}

export interface FilterDefinition<Value> {
    type: string;

    defaultOperator: string;
    defaultValue: Value;

    typeText: string;
    operators: { [index: string]: string; };
}

export interface FilterData<Value> {
    readonly id: number;
    type: string;
    operator: string;
    value: Value;
}
