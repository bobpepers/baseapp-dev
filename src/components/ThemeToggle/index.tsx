import { History } from 'history';
import React, { Component, Fragment } from 'react';
import {
    connect,
    MapDispatchToPropsFunction,
    MapStateToProps,
} from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { Switch } from '@material-ui/core';
import { RouteProps, withRouter } from 'react-router-dom';
import { Brightness3, WbSunny } from '@material-ui/icons';
// import { Moon } from '../../assets/images/Moon';
// import { Sun } from '../../assets/images/Sun';
// import { colors } from '../../constants';
import {
    changeColorTheme,
    RootState,
    selectCurrentColorTheme,
} from '../../modules';

export interface ReduxProps {
    colorTheme: string;
}

interface DispatchProps {
    changeColorTheme: typeof changeColorTheme;
}

export interface OwnProps {
    onLinkChange?: () => void;
    history: History;
}

type NavbarProps = OwnProps & ReduxProps & RouteProps & DispatchProps;


const ThemeSwitch = withStyles({
  switchBase: {
    color: '#FE6B8B',
    '&$checked': {
      color: '#FE6B8B',
    },
    '&$checked + $track': {
      backgroundColor: '#FE6B8B',
    },
  },
  checked: {},
  track: {},
})(Switch);

// tslint:disable:jsx-no-lambda
class ThemeToggleComponent extends Component<NavbarProps> {
    public render() {
        const { colorTheme } = this.props;

        return (
            <Fragment>
                <WbSunny />
                <ThemeSwitch
                    checked={colorTheme === 'light' ? false : true}
                    onChange={e => this.handleChangeCurrentStyleMode(colorTheme === 'light' ? 'basic' : 'light')}
                />
                <Brightness3 />
            </Fragment>
        );
    }

    private handleChangeCurrentStyleMode = (value: string) => {
        this.props.changeColorTheme(value);
    };
}

const mapStateToProps: MapStateToProps<ReduxProps, {}, RootState> =
    (state: RootState): ReduxProps => ({
        colorTheme: selectCurrentColorTheme(state),
    });

const mapDispatchToProps: MapDispatchToPropsFunction<DispatchProps, {}> =
    dispatch => ({
        changeColorTheme: payload => dispatch(changeColorTheme(payload)),
    });

// tslint:disable-next-line:no-any
const ThemeToggle = withRouter(connect(mapStateToProps, mapDispatchToProps)(ThemeToggleComponent) as any) as any;

export {
    ThemeToggle,
};
