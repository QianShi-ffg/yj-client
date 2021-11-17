import * as types from './mutation-types'

const actions = {
  setCurrentEmoji ({ commit }, playload) {
    commit(types.SET_CURRENTEMOJI, playload)
  },
  setIsDisplay ({ commit }, playload) {
    commit(types.SET_ISDISPLAY, playload)
  }
}
export default actions