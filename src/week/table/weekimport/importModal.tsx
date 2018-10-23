/**
 * 弱点导入上传页面
 */
import * as React from 'react';
import { Modal, Upload, Icon, message } from 'antd';
import { Ajax } from 'vap/utils';

var userId = '', userName = '';
Ajax.SESION('/api-common/user/info');
Ajax.GET('/api-common/user/info', json => {
  userId = json.data.id;
  userName = json.data.name;
});

export default class ImportModal extends React.PureComponent<any> {
  state = {
    files: [],
    fileList: []
  }

  import = () => {
    if (this.state.files.length > 0) {
      // 上传文件
      Ajax.POST("/api-weak/weakness/vulFileImport", {
        files: this.state.files
      }, res => {
        if (res && res.data) {
          message.success("导入成功");

          this.state.files.forEach(item => {
            const { guid } = item;
            Ajax.GET(`/api-fileup/fileup/delete/${guid}`);
          });
          this.setState({
            fileList: []
          })
          this.props.onCancel();
        } else {
          message.error(res.msg || "导入失败");
        }
      });
    } else {
      message.warning("没有导入文件");
    }
  }

  onChange = ({ file, fileList, event }) => {
    const { status, percent, response } = file;
    if (status && percent && response) {
      if (status == "done" && percent == 100 && response.code == 200) {
        const { data } = response;
        const { fileName, userId, userName, fileType, guid } = data;
        const files = this.state.files;
        files.push({
          fileName, fileType, guid,
          createUserId: userId, createUser: userName
        });

      }
    }
    this.setState({
      fileList
    })

  }

  onRemove = e => {
    const { response } = e;
    if (response) {
      const { data } = response;
      const { guid } = data;
      const url = `/api-fileup/fileup/delete/${guid}`;
      Ajax.GET(url);
    }
  }

  render() {
    const { user } = this.props;

    return <Modal
      title='导入弱点'
      width={650}
      onOk={this.import}
      onCancel={this.props.onCancel}
      visible={this.props.show}
      maskClosable={false}
    >
      <Upload.Dragger
        name="file"
        action="/api-fileup/fileup/uploadFile"
        multiple={false}
        withCredentials={true}
        data={
          {
            userId: userId,
            userName: userName,
            namespace: "weakNess"
          }
        }
        onChange={this.onChange}
        onRemove={this.onRemove}
        defaultFileList={this.state.fileList}
      >
        <p className="ant-upload-drag-icon">
          <Icon type="inbox" />
        </p>
        <p className="ant-upload-text">点击或拖拽文件来上传弱点文件</p>
        <p className="ant-upload-hint">注意：一次只能上传一个弱点文件</p>
      </Upload.Dragger>

    </Modal>
  }
}

