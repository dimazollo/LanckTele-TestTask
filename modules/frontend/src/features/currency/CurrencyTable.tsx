import React, { useEffect } from 'react';
import { Column, useTable } from 'react-table';
import { CurrencyRowData } from './types';
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSearchParams } from 'react-router-dom';
import { initCurrencySlice, selectRowData } from "./currencySlice";

export interface CurrencyTableProps {
  className?: string;
}

// const data: CurrencyRowData[] = [
//   {
//     currencyCode: 'EUR',
//     currencyRate: 1.1,
//     startDate: '07.08.2021',
//   },
//   {
//     currencyCode: 'RUR',
//     currencyRate: 0.013,
//     startDate: '08.08.2021',
//   },
//   {
//     currencyCode: 'GBP',
//     currencyRate: 1.3,
//     startDate: '06.08.2021',
//   },
// ];

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
  const rowData = useAppSelector(selectRowData)
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    dispatch(initCurrencySlice());
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data: rowData,
    });

  return (
    <table
      {...getTableProps()}
      className={props.className}
      style={{ border: 'solid 1px blue' }}
    >
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th
                {...column.getHeaderProps()}
                style={{
                  borderBottom: 'solid 3px red',
                  background: 'aliceblue',
                  color: 'black',
                  fontWeight: 'bold',
                }}
              >
                {column.render('Header')}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return (
                  <td
                    {...cell.getCellProps()}
                    style={{
                      padding: '10px',
                      border: 'solid 1px gray',
                      background: 'papayawhip',
                    }}
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
  );
}
