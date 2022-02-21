import React, { useEffect } from 'react';
import { Column, useTable } from 'react-table';
import { CurrencyRowData } from './types';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { initCurrencySlice, selectRowData } from './currencySlice';
import { classnames } from '@bem-react/classnames';

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

  useEffect(() => {
    dispatch(initCurrencySlice());
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: rowData,
    });

  return (
    <div className="flex flex-col">
      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
        <div className="shadow contain-paint border-b border-gray-200 sm:rounded-lg">
          <table
            {...getTableProps()}
            className={classnames(
              props.className,
              'min-w-full divide-y divide-gray-200',
            )}
          >
            <thead className="bg-gray-50 sticky top-0">
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {column.render('Header')}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody
              {...getTableBodyProps()}
              className="bg-white divide-y divide-gray-200"
            >
              {rows.map((row, idx) => {
                prepareRow(row);
                return (
                  <tr
                    {...row.getRowProps()}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    {row.cells.map((cell) => {
                      return (
                        <td
                          {...cell.getCellProps()}
                          className="px-6 py-2 whitespace-nowrap text-sm text-gray-900"
                        >
                          {cell.render('Cell')}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
