import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';
const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
import { Ajax, Cache } from 'vap/utils';
import { Popover, Menu, Icon } from 'vap/layouts/display';

class Header extends React.PureComponent {

    state = {
        pathname: window.location.pathname,
        menus: {
            children: []
        },
        themeVisable: false,
    }

    render() {
        return <dl className="app-header">
            <dt className="header-logo">安全监测大数据平台</dt>
            <dd className="header-menu">
                <ul className={this.state.menus.children.length > 0 ? 'hover' : 'none-hover'}>
                </ul>
            </dd>
            <dd className="header-action">
                <ul className={this.state.menus.children.length > 0 ? 'hover' : 'none-hover'}>
                    <li><a href="/portal"><Icon type="home" title="回到首页" /></a></li>
                    <li>
                    </li>
                    <li><Icon type="logout" title="退出登录" onClick={e => (console.log('x'))} /></li>
                </ul>
            </dd>
        </dl>
    }

}
ReactDOM.render(<Header />, document.getElementById("__header") as HTMLElement);