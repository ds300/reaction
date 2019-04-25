class RelayModernFragmentSpecResolver {
  _fragments: any
  _context: any
  _props: any
  constructor(context, fragments, props, callback) {
    this._fragments = fragments
    this._context = context
    this._props = props
  }
  dispose() {}
  setProps() {}
  isLoading() {
    return false
  }
  resolve() {
    const result = {}
    for (const key of Object.keys(this._fragments)) {
      const data = this._props[key]
      const fragmentName = this._fragments[key].name
      result[key] = data[`__fragment_${fragmentName}`]
      if (!result[key]) {
        throw new Error(`Can't find data for fragment ${fragmentName}`)
      }
    }
    return result
  }
}

module.exports = RelayModernFragmentSpecResolver
