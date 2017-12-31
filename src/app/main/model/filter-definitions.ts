import { FilterDefinition } from './filter';

export const defaultFilterType = 'genres';

export const filterDefinitions: { [index: string]: FilterDefinition<any>; } = {
    interprets: {
      type: null,
      typeText: 'Interprets',
      operators: {
        'contains_at_least_one_of': 'contains at least one of',
      },
      defaultOperator: 'contains_at_least_one_of',
      defaultValue: '',
      // valueTextFunc: (value: string) => value ? value : ''
    },
    genres: {
        type: null,
        typeText: 'Genres',
        operators: {
            'contains_at_least_one_of': 'contains at least one of',
        },
        defaultOperator: 'contains_at_least_one_of',
        defaultValue: '',
        // valueTextFunc: (value: string) => value ? value : ''
    },
    rating: {
        type: null,
        typeText: 'Rating',
        operators: {
            'gte': 'is at least',
            'lte': 'is not higher than'
        },
        defaultOperator: 'gte',
        defaultValue: 1,
        // valueTextFunc: (value: number) => value != null && !isNaN(value) && isFinite(value) ? value.toFixed(0) : ''
    },
    tags: {
        type: null,
        typeText: 'Tags',
        operators: {
            'contains_at_least_one_of': 'contains at least one of',
            'contains_all_of': 'contains all of',
            'contains_none_of': 'contains none of'
        },
        defaultOperator: 'contains_at_least_one_of',
        defaultValue: '',
    }
};

export const filterDefinitionsAsArray: FilterDefinition<any>[] = [];

for (const type in filterDefinitions) {
    const filterDefinition = filterDefinitions[type];
    filterDefinition.type = type;
    filterDefinitionsAsArray.push(filterDefinition);
}
