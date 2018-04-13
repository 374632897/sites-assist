import React, { Component } from 'react'
import './main.css'
import store from './store'
import uuid from 'uuid/v1'
const qrcode = require('qrcode')
const inputState = {
  path: '/m/list/',
  st: '',
  prod: '',
  dev: '',
  local: 'http://localhost:3000',
  test: 'http://service.test.example.com',
  title: '我的项目',
};
const envDesc = 'st,prod,dev,local,test'.split(',');
const pathDesc = ['title', 'path'];
const initialState = {
  input: inputState,
  pathList: [], // { path: '', title: '', }
  showQr: false,
  qrcode: '',
  qrurl: '',
};
const tbodyHeaders = pathDesc.concat(envDesc).concat('operate')

const sortFunc = (a, b) => b.time - (a.time || 0);

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
    const { pathList, input } = store.get();
    this.setState({
      ...initialState,
      input,
      pathList: pathList.sort(sortFunc)
    });
  }
  updateState (payload) {
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
    return (
      <label key={field}>
        <span>{field}</span>
        <input
          value={this.state.input[field]}
          title={this.state.input[field]}
          onChange={(e) => {
            this.updateInput(field, e.target.value);
          }}
        />
      </label>
    )
  }
  renderTHeader (field) {
    return (<th key={field}>{field}</th>)
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
      pathList: this.state.pathList.filter(path => {
        if (item.hasOwnProperty('uuid')) {
          return path.uuid !== item.uuid
        };
        return (path.path !== item.path) ||
        (item.title !== path.title)
      }),
    });
  }
  renderTBody (item, index) {
    return (<tr key={index}>
      {tbodyHeaders.slice(0, -1).filter(item => this.state.input[item]).map(field => {
        const text = this.getText(item, field);
        return (
          <td key={field} title={text}>{text}</td>
        )
      })}
      <td>
        <span className="danger" onClick={this.removePath.bind(this, item)}>删除</span>
      </td>
    </tr>)
  }

  handleAdd () {
    const { path, title } = this.state.input;
    if (!path || !title) return alert('缺少 path 或者 title 参数');
    this.updateState({
      pathList: this.state.pathList.concat({
        path,
        title,
        time: Date.now(),
        uuid: uuid(),
      }).sort(sortFunc),
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
                {tbodyHeaders.filter(item => this.state.input[item]).concat('operate').map(this.renderTHeader)}
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
