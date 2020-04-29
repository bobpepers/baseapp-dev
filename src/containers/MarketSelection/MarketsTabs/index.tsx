import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../modules';
import {
    Market,
    selectMarkets,
} from '../../../modules/public/markets';

interface ReduxProps {
    markets: Market[];
}

interface OwnProps {
    onSelect?: (value: string) => void;
}

interface State {
    selectedItem: number;
    scrollLeft: number;
}

type Props = ReduxProps & OwnProps;

export class MarketsTabsComponent extends React.Component<Props, State> {

    public readonly state = {
        selectedItem: 0,
        scrollLeft: 0,
    };

    public constructor(props) {
        super(props);
        this.tabsRef = React.createRef();
    }

    private tabsRef;

    public render() {
        return this.fastSearchButtons();
    }

    private fastSearchButtons = () => {
        const { markets } = this.props;
        let listOfQuote: string[] = ['All'];
        if (markets.length > 0) {
            listOfQuote = markets.reduce(this.quoteCurrencies, listOfQuote);
        }

        return (
            <ul className="nav nav-pills" role="tablist" onWheel={this.handleOnMouseWheel} ref={this.tabsRef}>
                {listOfQuote.map(this.renderFastSearchButton)}
            </ul>
        );
    };

    private renderFastSearchButton = (item: string, index: number) => {

        return (
            //tslint:disable-next-line
            <li key={index} onClick={() => this.handleSelectButton(index)}>
                <span className={`nav-link ${this.state.selectedItem === index && 'active'}`}>
                    {item}
                </span>
            </li>
        );
    };

    private handleOnMouseWheel = (event: React.WheelEvent) => {
        this.tabsRef.current.scrollLeft += event.deltaX;
    };

    private handleSelectButton = (index: number) => {
        this.setState({
            selectedItem: index,
        }, () => {
            if (this.props.onSelect) {
                const { markets } = this.props;
                let listOfQuote: string[] = ['All'];
                if (markets.length > 0) {
                    listOfQuote = markets.reduce(this.quoteCurrencies, listOfQuote);
                }
                this.props.onSelect(listOfQuote[this.state.selectedItem]);
            }
        });
    };

    private quoteCurrencies = (pV: string[], cV: Market) => {
        const [, quote] = cV.name.split('/');
        if (pV.indexOf(quote) === -1) {
            pV.push(quote);
        }

        return pV;
    };
}

const mapStateToProps = (state: RootState): ReduxProps => ({
    markets: selectMarkets(state),
});

//tslint:disable-next-line:no-any
export const MarketsTabs = connect(mapStateToProps, {})(MarketsTabsComponent) as any;
