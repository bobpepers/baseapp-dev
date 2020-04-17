import React, { Fragment } from 'react';
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@material-ui/core';
import { Market } from '../../modules';

interface Props {
    currentBidUnit: string;
    currentBidUnitsList: string[];
    markets: Market[];
    redirectToTrading: (key: string) => void;
    setCurrentBidUnit: (key: string) => void;
    translate: (id: string) => string;
}

export class LandingTable extends React.Component<Props> {
    public renderTableHeader(currentBidUnit: string) {
        const {
            currentBidUnitsList,
            setCurrentBidUnit,
            translate,
        } = this.props;

        return (
            <ul className="nav nav-pills" role="tablist">
                {currentBidUnitsList.map((item, i) => (
                    <li
                        key={i}
                        onClick={() => setCurrentBidUnit(item)}
                    >
                        <span className={`nav-link ${item === currentBidUnit && 'active'}`}>
                            {item ? item.toUpperCase() : translate('page.body.marketsTable.filter.all')}
                        </span>
                    </li>
                ))}
            </ul>
        );
    }

    public render() {
        const {
            currentBidUnit,
            markets,
            translate,
        } = this.props;

        return (
            <Fragment>
                {this.renderTableHeader(currentBidUnit)}
                <TableContainer className="landingTable">
                    <Table aria-label="simple table">
                        <TableHead className="landingTable-head">
                            <TableRow>
                                <TableCell>
                                    <span className="landingTable-cell">
                                        {translate('page.body.marketsTable.header.pair')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {translate('page.body.marketsTable.header.change')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {translate('page.body.marketsTable.header.lastPrice')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {translate('page.body.marketsTable.header.high')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {translate('page.body.marketsTable.header.low')}
                                    </span>
                                </TableCell>
                                <TableCell align="right">
                                    <span className="landingTable-cell">
                                        {translate('page.body.marketsTable.header.volume')}
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {markets[0] && markets.map(this.renderItemRow)}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Fragment>
        );
    }

    private renderItemRow = (market, index: number) => {
        const { redirectToTrading } = this.props;
        const marketChangeColor = +(market.change || 0) < 0 ? 'negative' : 'positive';

        return (
            <TableRow key={index} onClick={() => redirectToTrading(market.id)} className="landingTable-row">
                <TableCell>
                    <span className="landingTable-cell">
                        {market && market.name}
                    </span>
                </TableCell>
                <TableCell align="right" className="landingTable-cell">
                    <span className={marketChangeColor}>
                        {market.price_change_percent}
                    </span>
                </TableCell>
                <TableCell align="right">
                    <span className="landingTable-cell">
                        {market.last}
                    </span>
                </TableCell>
                <TableCell align="right" className="landingTable-cell">
                    <span className="landingTable-cell">
                        {market.high}
                    </span>
                </TableCell>
                <TableCell align="right" className="landingTable-cell">
                    <span className="landingTable-cell">
                        {market.low}
                    </span>
                </TableCell>
                <TableCell align="right" className="landingTable-cell">
                    <span className="landingTable-cell">
                        {market.vol}
                    </span>
                </TableCell>
            </TableRow>
        );
    };
}
