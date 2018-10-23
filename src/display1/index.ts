import * as _ from 'lodash';

/**
 * 导出 antd 原生模块
*/
export { Affix } from 'antd';
export { Anchor } from 'antd';
export { AutoComplete } from 'antd';
export { Alert } from 'antd';
export { Avatar } from 'antd';
export { BackTop } from 'antd';
export { Badge } from 'antd';
export { Breadcrumb } from 'antd';
export { Button } from 'antd';
export { Calendar } from 'antd';
export { Card } from 'antd';
export { Collapse } from 'antd';
export { Carousel } from 'antd';
export { Cascader } from 'antd';
export { Checkbox } from 'antd';
export { Col } from 'antd';
export { DatePicker } from 'antd';
export { Divider } from 'antd';
export { Dropdown } from 'antd';
export { Form } from 'antd';
export { Icon } from 'antd';
export { Input } from 'antd';
export { InputNumber } from 'antd';
export { Layout } from 'antd';
export { List } from 'antd';
export { LocaleProvider } from 'antd';
export { message } from 'antd';
export { Menu } from 'antd';
export { Modal } from 'antd';
export { notification } from 'antd';
export { Pagination } from 'antd';
export { Popconfirm } from 'antd';
export { Popover } from 'antd';
export { Progress } from 'antd';
export { Radio } from 'antd';
export { Rate } from 'antd';
export { Select } from 'antd';
export { Slider } from 'antd';
export { Spin } from 'antd';
export { Steps } from 'antd';
export { Switch } from 'antd';
export { Transfer } from 'antd';
export { Tree } from 'antd';
export { TreeSelect } from 'antd';
export { Tabs } from 'antd';
export { Tag } from 'antd';
export { TimePicker } from 'antd';
export { Timeline } from 'antd';
export { Tooltip } from 'antd';
export { Mention } from 'antd';
export { Upload } from 'antd';
export { version } from 'antd';

/**
 *  Row 被重写
export { Row } from 'antd';
*/

/**
 *  Table 被重写
export { Table } from 'antd';
 * */

/**
 * 定制 antd 模块，
 * 订制化：
 *  1. Table
 *  3. Modal 各种弹框
 * 及 VAP 特有模块
 *  1. ESTable
 *  2. Export (导出)
 *  3. Page 单页应用
*/
export { default as Table } from './Table/Table';
export { default as DataTable } from './Table/DataTable';
export { default as ESTable } from './Table/ESTable';
export { default as Page } from './Page/Page';
export { Panel, RowPanel } from './Page/Panel';
export { default as Row } from './Page/Row';
export { default as TableModal } from './TableModal';
export function HEIGHT(...height: number[]) {
    return 'calc(100% - ' + (_.sum(height) + 10 * height.length) + 'px)'
}

export { default as DropDownPanel } from './DropDown';

// //Radio 
// export {  Radio } from 'antd';
