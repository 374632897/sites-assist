import React, { Component } from 'react'
import './main.css'
import store from './store'
const qrcode = require('qrcode')
// import QRCode from './qrcode';
const inputState = {
  path: '/m/list/',
  st: 'http://service.st.example.com',
  prod: 'http://service.example.com',
  dev: 'http://service.dev.example.com',
  local: 'http://localhost:3000',
  test: 'http://service.test.example.com',
  title: '我的项目',
};
const envDesc = 'st,prod,dev,local,test'.split(',');
const pathDesc = ['path', 'title'];
const initialState = {
  input: inputState,
  pathList: [], // { path: '', title: '', }
  showQr: false,
  qrcode: '',
  qrurl: '',
};
const tbodyHeaders = pathDesc.concat(envDesc).concat('ops')

class Main extends Component {
  constructor (...args) {
    super(...args)
    this.state = initialState;
    this.handleAdd = this.handleAdd.bind(this)
    this.renderInput = this.renderInput.bind(this)
    this.renderTHeader = this.renderTHeader.bind(this)
    this.renderTBody = this.renderTBody.bind(this)
    this.generateQrCode = this.generateQrCode.bind(this)
  }
  componentDidMount () {
    this.setState({
      ...initialState,
      ...store.get(),
    });
  }
  updateState (payload) {
    console.log('updateState')
    this.setState({
      ...this.state,
      ...payload
    });
    store.set(this.state);
  }
  generateQrCode (url) {
    qrcode.toDataURL(url, (err, dataURL) => {
      this.updateState({
        qrcode: dataURL,
        showQr: true,
        qrurl: url,
      });
    });
  }
  updateInput (field, value) {
    this.updateState({
      input: {
        ...this.state.input,
        [field]: value,
      }
    });
  }

  renderInput (field) {
    return (<label key={field}>
      <span>{field}</span>
      <input value={this.state.input[field]} onChange={(e) => {
        this.updateInput(field, e.target.value);
      }} title={this.state.input[field]} />
    </label>)
  }
  renderTHeader (field) {
    return (<th key={field}>
      {field}
    </th>)
  }
  getText (item, field) {
    switch (field) {
      case 'title':
      case 'path':
        return item[field];
      default:
        if (!this.state.input[field]) return '';
        const uri = `${this.state.input[field]}${item.path}`;
        return ([
          <a
            target="_blank"
            key={1}
            href={uri}
            className="info"
          >goto</a>,
          <span
            onClick={this.generateQrCode.bind(this, uri)}
            key={2}
            className="info"
          >qrcode</span>
        ])
    }
  }

  removePath (item) {
    this.updateState({
      pathList: this.state.pathList.filter(path =>
        (path.path !== item.path) ||
        (item.title !== path.title)
      ),
    });
  }
  renderTBody (item, index) {
    return (<tr key={index}>
      {tbodyHeaders.slice(0, -1).map(field => (<td key={field}>
        {this.getText(item, field)}
      </td>))}
      <td>
        <span className="danger" onClick={this.removePath.bind(this, item)}>删除</span>
      </td>
    </tr>)
  }

  handleAdd () {
    const { path, title } = this.state.input;
    if (!path || !title) return alert('缺少 path 或者 title 参数');
    this.updateState({
      pathList: this.state.pathList.concat({ path, title }),
    });
  }
  render () {
    return (
      <div className="main">
        <header>
          <div>{envDesc.map(this.renderInput)}</div>
          <div>
            {pathDesc.map(this.renderInput)}
            <button onClick={this.handleAdd}>添加</button>
          </div>
        </header>
        <section>
          <table>
            <thead>
              <tr>
                {tbodyHeaders.map(this.renderTHeader)}
              </tr>
            </thead>
            <tbody>
              {this.state.pathList.map(this.renderTBody)}
            </tbody>
          </table>
        </section>
        {this.state.showQr && <div className="mask">
          <div className="qrcode" ref={node => (this.qrContainer = node)}>
            <img src={this.state.qrcode} alt="生成二维码出错" />
            <span
              className="close"
              onClick={() => this.updateState({
                showQr: false,
              })}
            >×</span>
            {this.state.qrurl}
          </div>
        </div>}
      </div>
    )
  }
}

export default Main;
