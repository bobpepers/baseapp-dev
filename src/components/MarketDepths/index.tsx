import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BigNumber from 'bignumber.js';
import { scaleLinear } from 'd3-scale';
import { curveStep } from 'd3-shape';
import { ChartCanvas, Chart } from 'react-stockcharts';
import { AreaSeries } from 'react-stockcharts/lib/series';
import { XAxis, YAxis } from 'react-stockcharts/lib/axes';
import { fitWidth } from 'react-stockcharts/lib/helper';
import { DepthHoverTooltip } from './DepthHoverTooltip';

interface AppState {
   data: any;
   width: number;
   height: number;
   axisColor: string;
   type: any;
   ratio: number;
   quoteUnit: string;
   baseUnit: string;
}


const getAccessorColor = d => {
  return d.type === 'bid' ? '#00FF00' : '#FF0000';
};

const tooltipContent = (baseUnit, quoteUnit) => {
  const fmt = {
    decimalSeparator: '.',
    groupSeparator: '',
  };
  return ({ currentItem, xAccessor }) => {
    if (!currentItem.price) {
      return null;
    }
    return {
      x: xAccessor(currentItem),
      y: [
        {
          label: currentItem.type === 'bid' ? 'Volume' : 'Volume',
          value: currentItem.totalVolume && `${currentItem.totalVolume} ${baseUnit.toUpperCase()}`,
          stroke: currentItem.type === 'bid' ? '#FF0000' : '#00FF00',
          labelStroke: currentItem.type === 'bid' ? '#FF0000' : '#00FF00',
          fontSize: 11,
        },
        {
          label: 'Estimated Cost',
          value:
            currentItem.totalVolume &&
            `${(new BigNumber(currentItem.totalVolume * currentItem.price).toFormat(8, fmt)).replace(/(\.[0-9]*[1-9])0+$|\.0*$/,'$1')} ${quoteUnit.toUpperCase()}`,
          stroke: currentItem.type === 'bid' ? '#FF0000' : '#00FF00',
          labelStroke: currentItem.type === 'bid' ? '#FF0000' : '#00FF00',
          fontSize: 11,
        },
      ],
    };
  };
};

class MyCharts extends Component<AppState> {
  public static propTypes = {
    data: PropTypes.array.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    ratio: PropTypes.number.isRequired,
    axisColor: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['svg', 'hybrid']).isRequired,
  };

  public static defaultProps = {
    type: 'svg',
    ratio: 1,
    axisColor: '#8A939F',
  };

  public render() {
    const { data, width, height, axisColor, type, ratio, baseUnit, quoteUnit } = this.props;
    const biggestVolume = data.reduce((a,b) => parseFloat(a.totalVolume) > parseFloat(b.totalVolume) ? a : b).totalVolume;
    const xScale = scaleLinear();
    const xExtents = [0, data.length - 1];
    return (
      <ChartCanvas
        ratio={ratio}
        width={width}
        height={height}
        margin={{ left: 10, right: 10, top: 10, bottom: 30 }}
        seriesName="MSFT"
        data={data}
        type={type}
        xAccessor={d => d.x}
        // xAccessor={d => d.price}
        xExtents={xExtents}
        xScale={xScale}
        //mouseMoveEvent={d=>d.price}
        panEvent={true}
        zoomEvent={true}
        clamp={false}
        displayXAccessor={d => d.price}
      >
        <Chart id={0} yExtents={d => [0, parseFloat(biggestVolume)]}>
          <XAxis
            axisAt="bottom"
            orient="bottom"
            tickStroke={axisColor}
            stroke={'transparent'}
            strokeWidth={0}
            tickFormat={d => (d && data && data[d] !== undefined && data[d].price ? data[d].price.toString() : '')}
            zoomEnabled={true}
            ticks={10}
          />
          <YAxis
            axisAt="right"
            orient="left"
            tickStroke={axisColor}
            stroke={'transparent'}
            strokeWidth={0}
            zoomEnabled={true}
            ticks={10}
          />
          <YAxis
            axisAt="left"
            orient="right"
            tickStroke={axisColor}
            stroke={'transparent'}
            strokeWidth={0}
            zoomEnabled={true}
            ticks={10}
          />
          <AreaSeries
            yAccessor={d => d.type === 'bid' && d.price && d.totalVolume}
            strokeWidth={2}
            interpolation={curveStep}
            fill="#203D25"
            stroke={'#84F766'}
          />
          <AreaSeries
            yAccessor={d => d.type === 'ask' && d.price && d.totalVolume}
            strokeWidth={2}
            interpolation={curveStep}
            fill="#f9672d"
            stroke={'#f9672d'}
          />
          <DepthHoverTooltip
            chartId={0}
            fontSize={15}
            fill={'#3d3d3d'}
            stroke={'#3d3d3d'}
            fontFamily={'sans-serif'}
            fontFill={'#fff'}
            opacity={1}
            tooltipContent={tooltipContent(baseUnit, quoteUnit)}
            yAccessor={d => d.totalVolume}
            lineStroke={getAccessorColor}
            r={5}
          />
        </Chart>
      </ChartCanvas>
    );
  }
}


const MarketDepth = fitWidth(MyCharts);

export { MarketDepth };
