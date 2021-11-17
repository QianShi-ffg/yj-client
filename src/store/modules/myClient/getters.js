import state from './state'
console.log(state)
const getters = {
  getCurrentEmoji: state => state.currentEmoji,
  getIsDisplay: state => state.isDisplay
}
export default getters