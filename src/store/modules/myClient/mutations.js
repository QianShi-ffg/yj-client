import * as types from './mutation-types'

const mutations = {
  [types.SET_CURRENTEMOJI] (state, playload) {
    state.currentEmoji = playload
  },
  [types.SET_ISDISPLAY] (state, playload) {
    state.isDisplay = playload
  },
  [types.SET_RANGE] (state, playload) {
    state.range = playload
  }
}

export default mutations