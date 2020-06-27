import React, { memo, useRef, FunctionComponent } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import BigNumber from 'bignumber.js';
import useComponentSize from '@rehooks/component-size';
import {
    Market,
    RootState,
    selectCurrentMarket,
    selectDepthAsks,
    selectDepthBids,
} from '../../modules';
import { MarketDepth } from '../../components/MarketDepths';

interface ReduxProps {
    asksItems: string[][];
    bidsItems: string[][];
    currentMarket: Market | undefined;
}

type tProps = ReduxProps;

const marketIsEqual = (prevProps, currentProps) => {
  return currentProps.currentMarket === prevProps.currentMarket
    && (currentProps.asksItems).toString() === (prevProps.asksItems).toString()
    && (currentProps.bidsItems).toString() === (prevProps.bidsItems).toString();
};


const MarketDepthContainer: FunctionComponent<tProps> = Props => {
    const { asksItems, bidsItems } = Props;
    const ref = useRef(null);
    const size = useComponentSize(ref);
    const { width, height } = size;

    const fillArray = (arr, type) => {
      while (arr.length < 3) {
        arr.push({type: type, price: null, totalVolume: '0'});
      }

      return arr;
    };

    const convertToDepthFormat = () => {
        const fmt = {
          decimalSeparator: '.',
          groupSeparator: '',
        };

        const bids = bidsItems.map((item, index) => {
          const [price, volume] = item;
          const slice = bidsItems.slice(0, index + 1);

          return {
            price: (new BigNumber(price).toFormat(8, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
            volume: (new BigNumber(volume).toFormat(8, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
            type: 'bid',
            totalVolume: slice.length > 0 ? (new BigNumber(slice.reduce((a, b) => (BigNumber.sum(a, b[1]).toString()), (0).toString())).toFormat(8, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1') : (new BigNumber(volume).toFormat(8, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
          };
        }).reverse();

        const asks = asksItems.map((item, index) => {
          const [price, volume] = item;
          const slice = asksItems.slice(0, index + 1);

          return {
            price: (new BigNumber(price).toFormat(8, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
            volume: (new BigNumber(volume).toFormat(8, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
            type: 'ask',
            totalVolume: slice.length > 0 ? (new BigNumber(slice.reduce((a, b) => (BigNumber.sum(a, b[1]).toString()), (0).toString())).toFormat(8, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1') : (new BigNumber(volume).toFormat(8, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1'),
          };
        });

        const filledBids = fillArray(bids, 'bid');
        const filledAsks = fillArray(asks, 'ask');
        const concatArray = (filledBids as any[]).concat({type: 'ask', price: null, totalVolume: '0'}).concat(filledAsks);

        for (let i = 0, len = concatArray.length; i < len; i++) {
            concatArray[i].x = i;
        }

        return concatArray;
    };

    const renderMarketDepth = (divHeight, divWidth) => {
        const { currentMarket } = Props;
        const { quote_unit, base_unit } = currentMarket as any;

        return (
            <MarketDepth
                data={convertToDepthFormat()}
                height={divHeight}
                width={divWidth}
                quoteUnit={quote_unit}
                baseUnit={base_unit}
            />
        );
    };

    return (
        <div className="market-depth-wrapper">
            <div className="trading-component-header">
                <div className="market-depth-title">
                    <FormattedMessage id="page.body.trade.header.marketDepths" />
                </div>
            </div>
            <div ref={ref} className="market-depth-content">
                {(asksItems.length || bidsItems.length) ? renderMarketDepth(height, width) : null}
            </div>
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    asksItems: selectDepthAsks(state),
    bidsItems: selectDepthBids(state),
    currentMarket: selectCurrentMarket(state),
});

export const MarketDepthsComponent = connect(mapStateToProps)(memo(MarketDepthContainer, marketIsEqual));
