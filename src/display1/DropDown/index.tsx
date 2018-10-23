import * as React from 'react';
import { Card, Dropdown } from 'antd'

import { DropPanel } from './interface';

export default class extends React.PureComponent<DropPanel> {

    state = {
        show: false
    }

    public hide = () => {
        this.setState({ show: false });
    }

    toogle(show: boolean) {
        if (show) {
            this.setState({ show });
        }
    }

    overlay() {
        return <Card>{this.props.children}</Card>
    }

    render() {
        return <Dropdown
            overlay={this.overlay()}
            placement="bottomLeft"
            // onVisibleChange={ function(show){console.log(arguments)}}
            onVisibleChange={(show) => this.toogle(show)}
            visible={this.state.show}
            trigger={['click']}
        >{this.props.action}</Dropdown>
    }
}
