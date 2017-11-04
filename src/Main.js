import React, { Component } from 'react'
import './main.css'
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
const headers = envDesc.concat(pathDesc);
const initialState = {
  input: inputState,
  pathList: [], // { path: '', title: '', }
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
  }
  updateInput (field, value) {
    this.setState({
      ...this.state,
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
        return (<a
          target="_blank"
          href={`${this.state.input[field]}${item.path}`}
        >{field}</a>)
    }
  }

  removePath (item) {
    this.setState({
      ...this.state,
      pathList: this.state.pathList.filter(path =>
        path.path !== item.path &&
        item.title !== path.title
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
    this.setState({
      ...this.state,
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
      </div>
    )
  }
}

export default Main;
