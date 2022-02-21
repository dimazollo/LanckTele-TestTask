import React, { useCallback, useEffect } from 'react';
import { Column, useBlockLayout, useTable } from 'react-table';
import { CurrencyRowData } from './types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  fetchCurrencyDataAction,
  initCurrencySlice,
  selectRowData,
  selectRowIds,
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

export function CurrencyTable(props: CurrencyTableProps) {
  const dispatch = useAppDispatch();
  const rowData = useAppSelector(selectRowData);
  const totalCount = useAppSelector((state) => state.currency.total);

  const defaultColumn = React.useMemo(
    () => ({
      width: 100,
    }),
    [],
  );

  const loadMoreItems = useCallback((startIndex: number, stopIndex: number) => {
    dispatch(
      fetchCurrencyDataAction({
        paging: { limit: stopIndex - startIndex + 1, offset: startIndex },
      }),
    );
  }, []);

  useEffect(() => {
    dispatch(initCurrencySlice());
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    totalColumnsWidth,
    prepareRow,
  } = useTable(
    {
      columns,
      data: rowData,
      defaultColumn,
    },
    useBlockLayout,
  );

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
              <div {...cell.getCellProps()} className="td">
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
      return index >= totalCount || index < ids.length;
    },
    [ids, totalCount],
  );

  return (
    <div {...getTableProps()} className={classnames(props.className)}>
      <div>
        {headerGroups.map((headerGroup) => (
          <div {...headerGroup.getHeaderGroupProps()} className="tr">
            {headerGroup.headers.map((column) => (
              <div {...column.getHeaderProps()} className="th">
                {column.render('Header')}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div {...getTableBodyProps()} className={'h-full'}>
        <AutoSizer disableWidth>
          {({ height }) => (
            <InfiniteLoader
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
