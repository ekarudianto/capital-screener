import {useSortBy, useTable} from 'react-table';
import { useMemo, useState } from "react";
import './Screener.css';
export default function Screener(props: any) {
  const { credentials: { securityToken, cst }} = props;
  const backendAPI = 'https://api-capital.backend-capital.com/api/v1';
  const [shares, setShares] = useState([]);

  const data: any = useMemo(
    () => shares,
    [shares]
  )

  const columns: any = useMemo(
    () => [
      {
        Header: 'Ticker',
        accessor: 'ticker', // accessor is the "key" in the data
      },
      {
        Header: 'Name',
        accessor: 'name',
      },
      {
        Header: 'Offer',
        accessor: 'offer',
      },
      {
        Header: 'Bid',
        accessor: 'bid',
      },
      {
        Header: 'Change',
        accessor: 'change',
      },
    ],
    []
  )
  const fetchData = async() => {
    setShares([]);
    const response = await fetch(`${backendAPI}/markets`, {
      headers: {
        "X-SECURITY-TOKEN": securityToken,
        "CST": cst,
      },
    });
    const { markets } = await response.json();
    const filteredShares = markets
      .filter((market: any) => market.instrumentType === "SHARES")
      .map((item: any) => {
        return {
          ticker: item.epic,
          name: item.instrumentName,
          offer: item.offer,
          bid: item.bid,
          change: item.percentageChange
        }
      });
    setShares(filteredShares);
  };

  const handleClick = (e: any) => {
    fetchData();
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({columns, data}, useSortBy)

  return (
    <div className='Screener'>
      <button onClick={handleClick}>
        Click me
      </button>
      <table {...getTableProps()} style={{ border: 'solid 1px blue' }}>
        <thead>
        {headerGroups.map((headerGroup: any) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
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
        {rows.map((row: any) => {
          prepareRow(row)
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map((cell: any) => {
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
                )
              })}
            </tr>
          )
        })}
        </tbody>
      </table>
    </div>
  );
}
