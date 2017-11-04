const KEY = '@@sites-assistant';
const localStorage = window.localStorage;
export default new class {
  get () {
    const data = localStorage[KEY];
    if (!data) return {};
    return JSON.parse(data);
  }
  set (rawdata) {
    const data = {
      input: rawdata.input,
      pathList: rawdata.pathList,
    };
    localStorage[KEY] = JSON.stringify(data);
  }
}()
