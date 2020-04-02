import React, { Component } from 'react';
import PropTypes from 'prop-types';
import GenericComponent from 'react-stockcharts/lib/GenericComponent';
import { sum } from 'd3-array';

import {
  first,
  last,
  isNotDefined,
  isDefined,
  hexToRGBA,
} from 'react-stockcharts/lib/utils';

const STROKEWIDTH = 3;
const PADDING = 5;
const X = 6;
const Y = 6;

const tooltipSVG = ({ fontFamily, fontSize, fontFill }, content) => {
  const tspans : any[] = [];
  const startY = Y + fontSize * 0.9;
  let labelFontSize = fontSize;
  for (let i = 0; i < content.y.length; i++) {
    const y = content.y[i];
    if (y.fontSize) {
      labelFontSize = y.fontSize;
    }

    const textY = startY + fontSize * (i + 1);

    const style = { fontFamily: fontFamily, fontSize: labelFontSize };

    tspans.push(
      <tspan key={`L-${i}`} x={X} y={textY} style={style} fill={y.stroke}>
        {y.label}
      </tspan>,
    );
    tspans.push(<tspan key={i}> </tspan>);
    tspans.push(
      <tspan key={`V-${i}`} style={style}>
        {y.value}
      </tspan>,
    );
  }
  return (
    <text fontFamily={fontFamily} fontSize={fontSize} fill={fontFill}>
      <tspan x={X} y={startY}>
        {content.x}
      </tspan>
      {tspans}
    </text>
  );
};

const backgroundShapeSVG = ({ fill, stroke, opacity }, { height, width }) => {
  return (
    <rect
      height={height}
      width={width}
      fill={fill}
      stroke={stroke}
      opacity={opacity}
    />
  );
};

const backgroundShapeCanvas = (props, { width, height }, ctx) => {
  const { fill, stroke, opacity } = props;
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fillStyle = hexToRGBA(fill, opacity);
  ctx.fill();
  ctx.lineWidth = 1;
  ctx.strokeStyle = stroke;
  ctx.stroke();
};

const tooltipCanvas = ({ fontFamily, fontSize, fontFill }, content, ctx) => {
  const startY = Y + fontSize * 0.9;
  // const width = reverse ? -STROKEWIDTH : STROKEWIDTH;

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontFill;
  ctx.fillText(content.x, X, startY);

  let labelFontSize = fontSize;
  for (let i = 0; i < content.y.length; i++) {
    const y = content.y[i];
    if (y.fontSize) {
      labelFontSize = y.fontSize;
    }
    const textY = startY + fontSize * (i + 1);
    ctx.font = `${labelFontSize}px ${fontFamily}`;
    ctx.fillStyle = y.stroke || fontFill;
    ctx.fillText(y.label, X, textY);

    ctx.fillStyle = fontFill;
    ctx.fillText((' ' as string) + (y.value as string), (X as number) + (ctx.measureText(y.label).width as number), textY);
  }
};

const drawOnCanvas = (ctx, props, context, pointer, height, moreProps) => {
  const { margin, ratio } = context;
  const { r, lineStroke, lineOpacity } = props;
  const { currentItem } = moreProps;

  const originX = ratio * 0.5 + (margin.left as number);
  const originY = ratio * 0.5 + (margin.top as number);

  ctx.save();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(ratio, ratio);
  ctx.translate(originX, originY);

  const { x, y, content, bgSize } = pointer;
  const linestroke = typeof lineStroke === 'string'
    ? lineStroke
    : lineStroke(currentItem);
  const stroke = hexToRGBA(linestroke, lineOpacity);

  const xAdjust = bgSize.reverse ? -1 : 1;

  ctx.fillStyle = stroke;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, false);
  ctx.fill();

  ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.arc(x, y, (r as number) + 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([3]);
  ctx.moveTo(x, y);
  ctx.lineTo(x, height);
  ctx.stroke();

  ctx.beginPath();
  ctx.setLineDash([]);
  ctx.moveTo((x as number) + (STROKEWIDTH / 2) * xAdjust, bgSize.y);
  ctx.lineTo((x as number) + (STROKEWIDTH / 2) * xAdjust, (bgSize.y as number) + (bgSize.height as number));
  ctx.lineWidth = STROKEWIDTH;
  ctx.stroke();

  ctx.translate((bgSize.x as number) + STROKEWIDTH * xAdjust, bgSize.y);
  backgroundShapeCanvas(props, bgSize, ctx);
  tooltipCanvas(props, content, ctx);

  ctx.restore();
};

const calculateTooltipSize = ({ fontFamily, fontSize, fontFill }, content, ctx) => {
  if (isNotDefined(ctx)) {
    const canvas = document.createElement('canvas');
    ctx = canvas.getContext('2d'); // tslint:disable-line
  }
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontFill;
  ctx.textAlign = 'left';

  const measureText = str => {
    return {
      width: ctx.measureText(str).width,
      height: fontSize,
    };
  };

  const { width, height } = content.y
    .map(({ label, value, ...rest }) => {
      const lableFontFamily = rest.fontFamily || fontFamily;
      const lableFontSize = rest.fontSize || fontSize;
      ctx.font = `${lableFontSize}px ${lableFontFamily}`;
      return measureText(`${label}: ${value}`);
    })
    .reduce((res, size) => sumSizes(res, size), measureText(String(content.x))); // tslint:disable-line
  return {
    width: ((width as number) + X * 2),
    height: ((height as number) + X * 2),
  };
};

const sumSizes = (...sizes) => {
  return {
    width: Math.max(...sizes.map(size => size.width)),
    height: sum(sizes, d => d.height),
  };
};

const normalizeX = (x, bgSize, pointWidth, width) => {
  // return x - bgSize.width - pointWidth / 2 - PADDING * 2 < 0
  if (x < width / 2) {
    return { x: x, reverse: false };
  } else {
    return { x: x - bgSize.width, reverse: true };
  }
};

const normalizeY = (y: number, bgSizeHeight: number, r: number, height: number) => {
  if (y + bgSizeHeight + r * 2 > height) {
    return { y: y - (bgSizeHeight + PADDING + r), ySign: -1 };
  } else {
    return { y: y + PADDING + r, ySign: 1 };
  }
};

const originCoords = (props, moreProps, bgSize, pointWidth) => {
  const { chartId, yAccessor, r } = props;
  const {
    mouseXY,
    xAccessor,
    currentItem,
    xScale,
    chartConfig,
    width,
    height,
  } = moreProps;
  let y: number = last(mouseXY);

  const xValue = xAccessor(currentItem);
  const x: number = Math.round(xScale(xValue));
  if (isDefined(chartId) && isDefined(yAccessor)) {
    const yValue = yAccessor(currentItem);
    if (chartConfig) {
      if (chartConfig !== null && typeof chartConfig === 'object') {
        y = Math.round(chartConfig.yScale(yValue));
      } else if (chartConfig.isArray()) {
        const chartIndex = chartConfig.findIndex(z => z.id === chartId);
        y = Math.round(chartConfig[chartIndex].yScale(yValue));
      }
    }
  }
  const xPoint = normalizeX(x, bgSize, pointWidth, width);
  const yPoint = normalizeY(y, bgSize.height, r, height);
  const point: any = { ...xPoint, ...yPoint };
  return [x, y, point];
};

const helper = (props, moreProps, ctx) => {
  const { show, xScale, currentItem, plotData } = moreProps;
  const { tooltipContent } = props;
  const { xAccessor, displayXAccessor } = moreProps;

  if (!show || isNotDefined(currentItem)) {
    return;
  }

  const xValue = xAccessor(currentItem);

  if (!show || isNotDefined(xValue)) {
    return;
  }

  const content = tooltipContent({ currentItem, xAccessor: displayXAccessor });
  if (!show || isNotDefined(content)) {
    return;
  }

  const centerX = xScale(xValue);
  const pointWidth =
    Math.abs(
      xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData))),
    ) /
    (plotData.length - 1);

  const bgSize = calculateTooltipSize(props, content, ctx);

  const [x, y, point] = originCoords(props, moreProps, bgSize, pointWidth);

  return {
    x,
    y,
    content,
    centerX,
    pointWidth,
    bgSize: { ...bgSize, ...point },
  };
};

interface AppState {
  r: number;
  lineStroke: any;
  backgroundShapeSVG: any;
  tooltipSVG: any;
  className: any;
  bgheight?: number;
  bgwidth?: number;
}

class DepthHoverTooltip extends Component<AppState> {
  public static propTypes = {
    chartId: PropTypes.number,
    yAccessor: PropTypes.func,
    tooltipSVG: PropTypes.func,
    backgroundShapeSVG: PropTypes.func,
    bgwidth: PropTypes.number,
    bgheight: PropTypes.number,
    bgFill: PropTypes.string.isRequired,
    bgOpacity: PropTypes.number.isRequired,
    lineStroke: PropTypes.oneOfType([PropTypes.string, PropTypes.func])
      .isRequired,
    lineOpacity: PropTypes.number.isRequired,
    tooltipContent: PropTypes.func.isRequired,
    fontFamily: PropTypes.string,
    fontSize: PropTypes.number,
    r: PropTypes.number.isRequired,
    className: PropTypes.string,
  };

  public static contextTypes = {
    margin: PropTypes.object.isRequired,
    ratio: PropTypes.number.isRequired,
  };

  public static defaultProps = {
    tooltipSVG: tooltipSVG,
    tooltipCanvas: tooltipCanvas,
    fill: '#D4E2FD',
    bgFill: '#D4E2FD',
    bgOpacity: 0,
    lineStroke: '#D4E2FD',
    lineOpacity: 1,
    stroke: '#9B9BFF',
    fontFill: '#000000',
    opacity: 0,
    backgroundShapeSVG: backgroundShapeSVG,
    backgroundShapeCanvas: backgroundShapeCanvas,
    fontFamily: 'sans-serif, Helvetica Neue, Helvetica, Arial, sans-serif',
    fontSize: 12,
    r: 3,
    className: 'react-stockcharts-current-coordinate',
  };

  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
  }
  public drawOnCanvas(ctx, moreProps) {
    const pointer: any = helper(this.props, moreProps, ctx);
    const { height } = moreProps;
    if (isNotDefined(pointer)) {
      return;
    }
    drawOnCanvas(ctx, this.props, this.context, pointer, height, moreProps);
    return;
  }
  public renderSVG(moreProps) {
    const pointer: any = helper(this.props, moreProps, null);

    if (isNotDefined(pointer)) {
      return null;
    }

    const {
      r,
      lineStroke,
      backgroundShapeSVG, // tslint:disable-line
      tooltipSVG, // tslint:disable-line
      className,
      bgheight,
      bgwidth,
    } = this.props;
    const { height, currentItem } = moreProps;

    const { x, y, content, bgSize } = pointer;
    const bgShape =
      isDefined(bgwidth) && isDefined(bgheight)
        ? { ...bgSize, width: bgwidth, height: bgheight }
        : bgSize;
    const linestroke = typeof lineStroke === 'string'
      ? lineStroke
      : lineStroke(currentItem);
    const xAdjust = bgSize.reverse ? -1 : 1;
    return (
      <g>
        <circle className={className} cx={x} cy={y} r={r} fill={linestroke} />
        <circle
          className={className}
          cx={x}
          cy={y}
          r={r + 2}
          stroke={linestroke}
          fill={'transparent'}
        />
        <line
          x1={x}
          y1={y}
          x2={x}
          y2={height}
          stroke={linestroke}
          strokeDasharray={'3'}
        />
        <line
          x1={(x as number) + (STROKEWIDTH / 2) * xAdjust}
          y1={bgShape.y}
          x2={(x as number) + (STROKEWIDTH / 2) * xAdjust}
          y2={(bgShape.y as number) + (bgShape.height as number)}
          stroke={linestroke}
          strokeWidth={STROKEWIDTH}
        />
        <g
          className="react-stockcharts-tooltip-content"
          transform={`translate(${(bgShape.x as number) + (STROKEWIDTH + 1) * xAdjust}, ${
            bgShape.y
          })`}
        >
          {backgroundShapeSVG(this.props, bgShape)}
          {tooltipSVG(this.props, content)}
        </g>
      </g>
    );
  }
  public render() {
    return (
      <GenericComponent
        svgDraw={this.renderSVG}
        canvasDraw={this.drawOnCanvas}
        drawOn={['mousemove']}
        {...this.props}
      />
    );
  }
}

export { DepthHoverTooltip };
