import React, { useCallback, useEffect, useRef } from 'react';
import isEqual from 'lodash.isequal';
import { Column, useBlockLayout, useSortBy, useTable } from 'react-table';
import {
  CurrencyRowData,
  SortingColumnEnum,
  SortingOrderEnum,
  SortingParams,
} from './types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchCurrencyDataAction,
  initCurrencyDataAction,
  selectRowData,
  selectRowIds,
  updateSortingAction,
} from './currencySlice';
import { FixedSizeList } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import './currency.css';
import { classnames } from '@bem-react/classnames';
import InfiniteLoader from 'react-window-infinite-loader';
import { scrollbarWidth } from '../../utils/scrollbarWidth';

export interface CurrencyTableProps {
  className?: string;
}

const columns: Column<CurrencyRowData>[] = [
  {
    Header: 'Currency',
    accessor: 'currencyCode', // accessor is the "key" in the data
  },
  {
    Header: 'Rate',
    accessor: 'currencyRate',
  },
  {
    Header: 'Date',
    accessor: 'startDate',
  },
];

const frontToBackColumnNamesMap: Record<
  keyof CurrencyRowData,
  SortingColumnEnum
> = {
  currencyCode: SortingColumnEnum.CURRENCY_CODE,
  currencyRate: SortingColumnEnum.CURRENCY_RATE,
  startDate: SortingColumnEnum.START_DATE,
};

export function CurrencyTable(props: CurrencyTableProps) {
  const dispatch = useAppDispatch();
  const rowData = useAppSelector(selectRowData);
  const totalCount = useAppSelector((state) => state.currency.total);
  const infiniteLoaderRef = useRef<InfiniteLoader>(null);

  const defaultColumn = React.useMemo(
    () => ({
      width: 100,
    }),
    [],
  );

  useEffect(() => {
    dispatch(initCurrencyDataAction());
  }, [dispatch]);

  const loadMoreItems = useCallback(
    (startIndex: number, stopIndex: number) => {
      // todo @dimazoll - remove console.log
      console.log('loadMoreItems: ', startIndex, stopIndex);
      dispatch(
        fetchCurrencyDataAction({
          paging: { limit: stopIndex - startIndex + 1, offset: startIndex },
        }),
      );
    },
    [dispatch],
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
    state: { sortBy },
  } = useTable(
    {
      columns,
      data: rowData,
      defaultColumn,
      manualSortBy: true,
    },
    useBlockLayout,
    useSortBy,
    //  todo @dimazoll - add filters
  );

  const currentSortingState = useAppSelector((state) => state.currency.sorting);
  useEffect(() => {
    const sortingState: SortingParams = sortBy.reduce<SortingParams>(
      (acc, rule) => {
        acc[frontToBackColumnNamesMap[rule.id as keyof CurrencyRowData]] =
          rule.desc ? SortingOrderEnum.DESC : SortingOrderEnum.ASC;
        return acc;
      },
      {},
    );
    if (!isEqual(currentSortingState, sortingState)) {
      if (infiniteLoaderRef.current) {
        infiniteLoaderRef.current.resetloadMoreItemsCache();
        // todo @dimazoll - remove console.log
        console.log(sortingState);
        dispatch(updateSortingAction(sortingState));
      }
    }
  }, [dispatch, sortBy, currentSortingState]);

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      if (row === undefined) {
        return null;
      }
      prepareRow(row);
      return (
        <div
          {...row.getRowProps({
            style,
          })}
          className="tr"
        >
          {row.cells.map((cell) => {
            return (
              <div {...cell.getCellProps()} className={'m-0 p-0.5'}>
                {cell.render('Cell')}
              </div>
            );
          })}
        </div>
      );
    },
    [prepareRow, rows],
  );

  const ids = useAppSelector(selectRowIds);
  const isItemLoaded = React.useCallback(
    (index: number): boolean => {
      const res = index >= totalCount || index < ids.length;
      // console.log(
      //   `isItemLoaded ==> (index: ${index}, totalCount: ${totalCount}, idsLength: ${ids.length}) => (index >= totalCount || index < ids.length = ${res})`,
      // );
      return index >= totalCount || index < ids.length;
    },
    [ids, totalCount],
  );

  return (
    <div {...getTableProps()} className={classnames(props.className)}>
      <div>
        {headerGroups.map((headerGroup) => (
          <div {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <div
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className="m-0 p-0.5 select-none"
              >
                {column.render('Header')}
                <span>
                  {column.isSorted
                    ? column.isSortedDesc
                      ? ' \u1401'
                      : ' \u1403'
                    : ''}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()} className={'h-full'}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <InfiniteLoader
              ref={infiniteLoaderRef}
              isItemLoaded={isItemLoaded}
              loadMoreItems={loadMoreItems}
              itemCount={totalCount}
            >
              {({ onItemsRendered, ref }) => (
                <FixedSizeList
                  height={height}
                  width={totalColumnsWidth + scrollbarWidth()}
                  itemCount={totalCount}
                  itemSize={35}
                  onItemsRendered={onItemsRendered}
                  ref={ref}
                >
                  {RenderRow}
                </FixedSizeList>
              )}
            </InfiniteLoader>
          )}
        </AutoSizer>
      </div>
    </div>
  );
}
