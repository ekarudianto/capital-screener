import {usePagination, useSortBy, useTable} from 'react-table';
import { useMemo, useState } from "react";
import './Screener.css';
import {MarketModes, MarketStatus} from "../../config/constants";
export default function Screener(props: any) {
  const { credentials: { securityToken, cst }, filter: { marketType }} = props;
  const backendAPI = 'https://api-capital.backend-capital.com/api/v1';
  const [shares, setShares] = useState([]);

  const data: any = useMemo(
    () => shares,
    [shares]
  )

  function compareNumericString(rowA:any, rowB:any, id:number, desc:any) {
    let a = Number.parseFloat(rowA.values[id]);
    let b = Number.parseFloat(rowB.values[id]);
    if (Number.isNaN(a)) {  // Blanks and non-numeric strings to bottom
      a = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    }
    if (Number.isNaN(b)) {
      b = desc ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY;
    }
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  }

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
        Header: 'Change (net)',
        accessor: 'netChange'
      },
      {
        Header: 'Change (%)',
        accessor: 'change',
        sortType: compareNumericString,
      },
      {
        Header: 'Market Status',
        accessor: 'marketStatus',
      },
      {
        Header: 'Market Modes',
        accessor: 'marketModes',
      }
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
      setShares([]);
      return;
    }

    const filteredShares = markets
      .filter((market: any) => {
        const isSelectedMarketType = market.instrumentType === marketType;
        return isSelectedMarketType;
      })

    setShares(filteredShares.map((item: any) => {
      return {
        ticker: item.epic,
        name: item.instrumentName,
        offer: item.offer,
        bid: item.bid,
        change: item.percentageChange,
        netChange: item.netChange,
        marketModes: item.marketModes.join(','),
        marketStatus: item.marketStatus,
      }
    }));
  };

  const handleClick = () => {
    fetchData();
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  }: any = useTable(
    {
      columns, data
    },
    useSortBy,
    usePagination,
  );

  return (
    <div className='Screener'>
      <button onClick={handleClick}>
        Fetch data
      </button>

      <div>
        Total rows: {shares.length}
      </div>
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
        {page.map((row: any) => {
          prepareRow(row)
          return (
            <tr key={row.id} {...row.getRowProps()} className="row">
              {row.cells.map((cell: any) => {
                const { key } = cell.getCellProps();
                const { column: { Header }, value} = cell;
                const isOfferPrice = Header === 'Offer';
                const isBidPrice = Header === 'Bid';
                const isChangePercentage = Header === 'Change (%)';
                const isChangeNet = Header === 'Change (net)';
                const isMarketStatus = Header === 'Market Status';
                const isMarketModes = Header === 'Market Modes';

                const offerPriceClassName = isOfferPrice ? 'offer-price-cell' : '';
                const bidPriceClassName = isBidPrice ? 'bid-price-cell' : '';
                const marketStatusClassName = isMarketStatus && value === MarketStatus.TRADEABLE ? 'offer-price-cell bold' : '';
                const marketModesClassName = isMarketModes && value.includes(MarketModes.REGULAR) ? 'offer-price-cell bold' : '';
                let changeClassName = '';

                if ((isChangePercentage || isChangeNet) && value > 0) {
                  changeClassName = 'offer-price-cell';
                } else if ((isChangePercentage || isChangeNet) && value < 0) {
                  changeClassName = 'bid-price-cell';
                }

                return (
                  <td
                    className={`
                      ${offerPriceClassName} 
                      ${bidPriceClassName} 
                      ${changeClassName} 
                      ${marketStatusClassName}
                      ${marketModesClassName}`
                  }
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

      { shares.length > 0 &&
        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
          Page{' '}
            <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
          <span>
          | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={e => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0
                gotoPage(page)
              }}
              style={{ width: '100px' }}
            />
        </span>{' '}
          <select
            value={pageSize}
            onChange={e => {
              setPageSize(Number(e.target.value))
            }}
          >
            {[10, 20, 30, 40, 50, 100].map(pageSize => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      }

    </div>
  );
}
