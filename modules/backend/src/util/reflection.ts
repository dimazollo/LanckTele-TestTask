import { SortableColumnMetadataKey } from './decorator/Sortable.decorator';

export function getSortableColumnsFromReflection(constructor: {
  new (): Object;
}) {
  const instance = new constructor();
  const propertyNames = Object.getOwnPropertyNames(instance);

  const sortableColumnNames = propertyNames.flatMap((propertyName) => {
    const isColumnSortable = Reflect.getMetadata(
      SortableColumnMetadataKey,
      instance,
      propertyName,
    );

    return isColumnSortable ? [propertyName] : [];
  });

  return sortableColumnNames;
}
