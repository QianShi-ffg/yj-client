import * as types from './mutation-types'

const actions = {
  setCurrentEmoji ({ commit }, playload) {
    commit(types.SET_CURRENTEMOJI, playload)
  },
  setIsDisplay ({ commit }, playload) {
    commit(types.SET_ISDISPLAY, playload)
  },
  setRange ({ commit }, playload) {
    commit(types.SET_RANGE, playload)
  }
}
export default actions