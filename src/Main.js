import React, { Component } from 'react'

const inputState = {
  path: '/m/list/',
  st: 'http://bddeal.meishi.st.sankuai.com',
  prod: 'http://bddeal.sankuai.com',
  dev: 'http://bddeal.meishi.dev.sankuai.com',
  local: 'http://localhost:8080',
  test: 'http://bddeal.meishi.st.sankuai.com',
  title: '我的项目',
};
const headers = Object.keys(inputState);
const initialState = {
  input: inputState,
  pathList: [], // { path: '', title: '', }
};


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
      }} />
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
        return <a href={`${this.state.input[field]}${item.path}`}>{field}</a>
    }
  }
  renderTBody (item, index) {
    return (<tr key={index}>
      {headers.map(field => (<td key={field}>
        {this.getText(item, field)}
      </td>))}
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
          {headers.map(this.renderInput)}
          <button onClick={this.handleAdd}>添加</button>
        </header>
        <section>
          <table>
            <thead>
              <tr>
                {headers.map(this.renderTHeader)}
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
