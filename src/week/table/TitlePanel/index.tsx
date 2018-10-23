import * as React from 'react';
import * as _ from 'lodash';
import { RowPanel } from 'vap/layouts/display';

interface TitleInfo {
  title: string | React.ReactNode,
  height?: number,
}

export default class extends React.PureComponent<TitleInfo>{

  render() {
    let height = this.props.height || 40;
    return <RowPanel height={height} bordered={false} className="title-panel">
      <div className="title">
        {_.isString(this.props.title) ? <h1>{this.props.title}</h1> : this.props.title}
      </div>
      <div className="actions">
        {this.props.children}
      </div>
    </RowPanel>
  }
}
