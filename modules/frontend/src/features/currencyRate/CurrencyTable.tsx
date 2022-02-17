import React from 'react';
import { Column, useTable } from 'react-table';
import { CurrencyRowData } from './types';

export function CurrencyTable() {
  const data = React.useMemo(
    (): CurrencyRowData[] => [
      {
        currency: 'EUR',
        rate: '1.1',
        date: '07.08.2021',
      },
      {
        currency: 'RUR',
        rate: '0.013',
        date: '08.08.2021',
      },
      {
        currency: 'GBP',
        rate: '1.3',
        date: '06.08.2021',
      },
    ],
    [],
  );

  const columns = React.useMemo(
    (): Column<CurrencyRowData>[] => [
      {
        Header: 'Currency',
        accessor: 'currency', // accessor is the "key" in the data
      },
      {
        Header: 'Rate',
        accessor: 'rate',
      },
      {
        Header: 'Date',
        accessor: 'date',
      },
    ],
    [],
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable({
      columns,
      data,
    });

  return (
    <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
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
