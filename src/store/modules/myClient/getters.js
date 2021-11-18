import state from "./state";
console.log(state);
const getters = {
  getCurrentEmoji: (state) => state.currentEmoji,
  getIsDisplay: (state) => state.isDisplay,
  getRange: (state) => state.range,
  getCleanMessage: (state) => state.cleanMessage,
};
export default getters;
