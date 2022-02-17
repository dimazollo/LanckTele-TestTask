export const SortableColumnMetadataKey = Symbol('sortable_column_name');

export function Sortable() {
  return (target: Object, propertyKey: string | symbol): void => {
    Reflect.defineMetadata(
      SortableColumnMetadataKey,
      true,
      target,
      propertyKey,
    );
  };
}
