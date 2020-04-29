import React, { FunctionComponent } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import { incrementalOrderBook } from '../../../api';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Decimal } from '../../../components';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TableSortLabel,
} from '@material-ui/core';

import {
    InjectedIntlProps,
    injectIntl,
    FormattedMessage,
} from 'react-intl';

import {
    depthFetch,
    Market,
    RootState,
    selectCurrentMarket,
    selectMarkets,
    selectMarketTickers,
    setCurrentMarket,
    setCurrentPrice,
    Ticker,
} from '../../../modules';

interface ReduxProps {
    currentMarket: Market | undefined;
    markets: Market[];
    marketTickers: {
        [key: string]: Ticker,
    };
}

interface DispatchProps {
    setCurrentMarket: typeof setCurrentMarket;
    depthFetch: typeof depthFetch;
    setCurrentPrice: typeof setCurrentPrice;
}

interface OwnProps {
    search: string;
    currencyQuote: string;
}

interface Data {
  last: string;
  priceChangePercentNum: string;
  vol: string;
  id: string;
  isPositiveChange: boolean;
  baseUnit: string;
}

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  order: Order;
  orderBy: string;
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

type Props = ReduxProps & OwnProps & DispatchProps & InjectedIntlProps;
type Order = 'asc' | 'desc';

const createData = (
  id: string,
  last: string,
  vol: string,
  priceChangePercentNum: string,
  isPositiveChange: boolean,
  baseUnit: string,
): Data => {
  return { id, last, vol, priceChangePercentNum, isPositiveChange, baseUnit };
};

const descendingComparator = <T extends unknown>(a: T, b: T, orderBy: keyof T) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }

  return 0;
};

const getComparator: <Key extends keyof any>(
  order: Order,
  orderBy: Key,
) => (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number = (order, orderBy) => {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const stableSort = <T extends unknown>(array: T[], comparator: (a: T, b: T) => number) => {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }

    return a[1] - b[1];
  });

  return stabilizedThis.map(el => el[0]);
};

const headCells: HeadCell[] = [
  { id: 'id', numeric: false, disablePadding: true, label: 'markets.market' },
  { id: 'last', numeric: true, disablePadding: false, label: 'markets.price' },
  { id: 'vol', numeric: true, disablePadding: false, label: 'markets.volume' },
  { id: 'priceChangePercentNum', numeric: true, disablePadding: false, label: 'markets.change' },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    table: {
      width: '100%',
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 20,
      width: 1,
    },
  }),
);

const EnhancedTableHead = (props: EnhancedTableProps) => {
  const { classes, order, orderBy, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead className="landingTable-head">
      <TableRow>
        {headCells.map((headCell, i) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <span className={`landingTable-cell ${i === 0 ? '' : 'label-reverse'}`}>
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                <FormattedMessage id={headCell.label} />
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </span>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

const MarketsListComponent: FunctionComponent<Props> = props => {
  const {
    markets,
    marketTickers,
    search,
    currencyQuote,
  } = props;

  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('desc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('vol');

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const mapMarkets = () => {
        const defaultTicker = {
            last: 0,
            vol: 0,
            price_change_percent: '+0.00%',
        };
        const regExp = new RegExp(search.toLowerCase());
        const arr: Market[] = [];

        const marketsMapped = markets.map((market: Market) => {
            return {
                ...market,
                last: (marketTickers[market.id] || defaultTicker).last,
                vol: (marketTickers[market.id] || defaultTicker).vol,
                price_change_percent: (marketTickers[market.id] || defaultTicker).price_change_percent,
                priceChangePercentNum: Number.parseFloat((marketTickers[market.id] || defaultTicker).price_change_percent),
            };
        });


        return marketsMapped.reduce((pV, cV) => {
            const [,quote] = cV.name.toLowerCase().split('/');
            if (
                regExp.test(cV.id.toLowerCase()) &&
                (
                    currencyQuote === '' ||
                    currencyQuote.toLowerCase() === quote ||
                    currencyQuote.toLowerCase() === 'all'
                )
            ) {
                pV.push(cV);
            }

            return pV;
        }, arr).map((market: Market & Ticker, index: number) => {
            const isPositive = /\+/.test((marketTickers[market.id] || defaultTicker).price_change_percent);

            return (
                createData(
                    market.name,
                    Decimal.format(Number(market.last), market.price_precision),
                    Decimal.format(Number(market.vol), market.amount_precision),
                    market.price_change_percent,
                    isPositive,
                    market.base_unit,
                )
            );
        });
    };

  const data = mapMarkets();

  const currencyPairSelectHandler = (e: any, key: string) => {
        const marketToSet = markets.find(el => el.name === key);
        props.setCurrentPrice();
        if (marketToSet) {
            props.setCurrentMarket(marketToSet);
            if (!incrementalOrderBook()) {
              props.depthFetch(marketToSet);
            }
        }
    };

  return (
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />
            <TableBody>
              {stableSort(data, getComparator(order, orderBy))
                .map((row, index) => {
                  const classname = classnames({
                    'pg-dropdown-markets-list-container__positive': row.isPositiveChange,
                    'pg-dropdown-markets-list-container__negative': !row.isPositiveChange,
                  });

                  return (
                    <TableRow
                      hover
                      tabIndex={-1}
                      key={row.id}
                      onClick={e => currencyPairSelectHandler(e, String(row.id))}
                      className="landingTable-row"
                    >
                      <TableCell>
                        <span className="landingTable-cell">
                            <img src={`https://downloads.runebase.io/${row.baseUnit}.svg`} alt={`${row.id} market icon`} className="MarketListCoinIcon" />
                                {row.id}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                        <span className={classname}>
                            {row.last}
                        </span>
                      </TableCell>
                      <TableCell align="right">
                            <span className={classname}>
                                {row.vol}
                            </span>
                      </TableCell>
                      <TableCell align="right">
                            <span className={classname}>
                                {row.priceChangePercentNum}
                            </span>
                      </TableCell>
                    </TableRow>
                  );
              })}
            </TableBody>
          </Table>
        </TableContainer>
  );
};

const mapStateToProps = (state: RootState): ReduxProps => ({
    currentMarket: selectCurrentMarket(state),
    markets: selectMarkets(state),
    marketTickers: selectMarketTickers(state),
});

const mapDispatchToProps = {
    setCurrentMarket,
    depthFetch,
    setCurrentPrice,
};

export const MarketsList = injectIntl(connect(mapStateToProps, mapDispatchToProps)(MarketsListComponent));
