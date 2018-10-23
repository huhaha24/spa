import { DatePicker } from 'vap/layouts/display';
import * as React from 'react';
import * as moment from 'moment';

export default class extends React.PureComponent<{
  onChange: Function,
  format?: string,
  time?: boolean,
  split?: number,
}> {
  opend = false;
  split = 7;
  format = 'YYYY-MM-DD HH:mm:ss';
  symbol = '日期';

  state = {
    startValue: null,
    endValue: null,
    endOpen: false,
  };

  componentWillMount() {
    this.format = this.props.format ? this.props.format : (this.props.time ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD");
    this.symbol = this.props.time ? '时间' : '日期';
    this.split = this.props.split || 7;
    this.setState({
      startValue: moment().subtract(this.split, 'days'),
      endValue: moment()
    })
  }


  disabledStartDate = (startValue) => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  }

  disabledEndDate = (endValue) => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() <= startValue.valueOf();
  }

  onChange = (field, value) => {
    this.setState({
      [field]: value,
    });
  }

  onStartChange = (value) => {
    this.onChange('startValue', value);
  }

  onEndChange = (value) => {
    this.onChange('endValue', value);
  }

  handleStartOpenChange = (open) => {
    if (!open) {
      this.setState({ endOpen: true });
    } else {
      if (!this.opend) {
        this.opend = true;
      } else {
        window.setTimeout(() => {
          this.props.onChange(
            this.state.startValue ? this.state.startValue.format(this.format) : '',
            this.state.endValue ? this.state.endValue.format(this.format) : ''
          );
        }, 10)
      }
    }
  }

  handleEndOpenChange = (open) => {
    this.setState({ endOpen: open });
    if (!open) {
      this.opend = false;
      window.setTimeout(() => {
        this.props.onChange(
          this.state.startValue ? this.state.startValue.format(this.format) : '',
          this.state.endValue ? this.state.endValue.format(this.format) : ''
        );
      }, 10)
    }
  }

  render() {
    const { startValue, endValue, endOpen } = this.state;
    return (
      <div className="filter-date-group">
        <DatePicker
          size='small'
          allowClear={false}
          disabledDate={this.disabledStartDate}
          showTime={this.props.time ? true : false}
          format={this.format}
          value={startValue}
          placeholder={`开始${this.symbol}`}
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
          className={"filter-date-item"}
        />
        <span className="time-split">至</span>
        <DatePicker
          size='small'
          allowClear={false}
          disabledDate={this.disabledEndDate}
          showTime={this.props.time ? true : false}
          format={this.format}
          value={endValue}
          placeholder={`结束${this.symbol}`}
          onChange={this.onEndChange}
          open={endOpen}
          onOpenChange={this.handleEndOpenChange}
          className={"filter-date-item"}
        />
      </div>
    );
  }
}
