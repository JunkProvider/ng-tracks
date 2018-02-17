export interface Provider<TEntity> {
    getAll(): Promise<TEntity[]>;
}

export abstract class SuggestionProvider<TEntity> {
    maxSuggestions = 20;

    constructor(private readonly provider: Provider<TEntity>, private readonly entityToString: (entity: TEntity) => string) {}

    provide(word: string) {
        word = word.toUpperCase();

        /*if (word.length === 0) {
          return Promise.resolve([]);
        }*/

        return this.provider.getAll().then(
            entities => {
                let suggestions = entities
                    .map(entity => this.entityToString(entity))
                    .filter(text => text.toUpperCase().startsWith(word));

                if (suggestions.length > this.maxSuggestions) {
                    suggestions = suggestions.slice(0, this.maxSuggestions);
                }

                return suggestions;
            }
        );
    }
}
