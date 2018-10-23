import { CardProps } from 'antd/lib/card';
import { RowProps } from 'antd/lib/row';


export interface CardTabListType {
    key: string;
    tab: React.ReactNode;
    content?: React.ReactNode;
    // default?: boolean;
}
// export interface CardProps {
//     prefixCls?: string;
//     title?: React.ReactNode;
//     extra?: React.ReactNode;
//     bordered?: boolean;
//     bodyStyle?: React.CSSProperties;
//     style?: React.CSSProperties;
//     loading?: boolean;
//     noHovering?: boolean;
//     hoverable?: boolean;
//     children?: React.ReactNode;
//     id?: string;
//     className?: string;
//     type?: CardType;
//     cover?: React.ReactNode;
//     actions?: Array<React.ReactNode>;
//     tabList?: CardTabListType[];
// }

export interface PanelProps extends CardProps {
    /**
     * 标题前面打个 ICON图标
    */
    icon?: string;
    /**
     * 宽度
    */
    width?: number;
    /**
     * 跨度大小，分成24份
    */
    span?: number;
    /**
     * 标签页
    */
    tabList?: CardTabListType[];
}

export interface RowPanelProps extends CardProps {
    /**
     * 标题前面打个 ICON图标
    */
    icon?: string;
    /**
     * Panel高度
    */
    height: number | string;
    /**
     * 标签页
    */
    tabList?: CardTabListType[];
}

export interface VRowProps extends RowProps {
    height: number | string;
}