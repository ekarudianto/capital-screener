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
      {
        Header: 'Market Status',
        accessor: 'marketStatus',
      },
    ],
    []
  )
  const fetchData = async() => {
    const response = await fetch(`${backendAPI}/markets`, {
      headers: {
        "X-SECURITY-TOKEN": securityToken,
        "CST": cst,
      },
    });
    const { markets } = await response.json();

    if (!markets) {
      alert('data is not available!');
      return;
    }

    const filteredShares = markets
      .filter((market: any, index: number) => {
        const isRegularMarket = market.marketModes.includes('REGULAR');
        const isShares = market.instrumentType === "SHARES";
        return isRegularMarket && isShares && index < 30;
      })

    setShares(filteredShares.map((item: any) => {
      return {
        ticker: item.epic,
        name: item.instrumentName,
        offer: item.offer,
        bid: item.bid,
        change: item.percentageChange,
        marketModes: item.marketModes,
        marketStatus: item.marketStatus
      }
    }));
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
        Fetch data
      </button>

      <table {...getTableProps()}>
        <thead>
        {headerGroups.map((headerGroup: any) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column: any) => (
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
              >
                {column.render('Header')}
                <span>
                  {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                </span>
              </th>
            ))}
          </tr>
        ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {rows.map((row: any) => {
          prepareRow(row)
          return (
            <tr key={row.id} {...row.getRowProps()}>
              {row.cells.map((cell: any) => {
                const { key } = cell.getCellProps();
                const { column: { Header }, value} = cell;
                const isOfferPrice = Header === 'Offer';
                const isBidPrice = Header === 'Bid';
                const isChangePercentage = Header === 'Change';

                const offerPriceClassName = isOfferPrice ? 'offer-price-cell' : '';
                const bidPriceClassName = isBidPrice ? 'bid-price-cell' : '';
                let changePercentageClassName = '';

                if (isChangePercentage) {
                  changePercentageClassName = value > 0 ? 'offer-price-cell' : 'bid-price-cell';
                }

                return (
                  <td
                    className={`${offerPriceClassName} ${bidPriceClassName} ${changePercentageClassName}`}
                    key={key}
                    {...cell.getCellProps()}
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
