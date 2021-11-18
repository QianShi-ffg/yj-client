<template>
  <el-dialog
    title=""
    :visible.sync="emojiVisible"
    width="450px"
    height="366px"
    :before-close="close"
    :modal="false"
    :show-close="false"
    top="1.5vh"
  >
    <el-card class="box-card">
      <div
        class="wwxface"
        :class="`wwxface${i}`"
        style="width: 38px; height: 38px"
        v-for="(item, i) in emojiList"
        :key="i"
        :title="item"
        @click="emojiClick(item, i)"
      ></div>

      <div class="bar"></div>
    </el-card>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import emojiMap from "../util/emoji";
export default {
  props: { emojiVisible: Boolean },
  data() {
    return {
      emojiList: [],
    };
  },
  computed: {
    ...mapGetters("myClient", ["getCurrentEmoji", "getIsDisplay"]),
  },
  mounted() {
    console.log(emojiMap, 56666);
    let valueArr = [];
    let KeyArr = [];
    emojiMap.forEach((value, key) => {
      valueArr.push(value);
      KeyArr.push(key);
    });
    this.emojiList = KeyArr;
    console.log(valueArr, KeyArr);
  },
  methods: {
    ...mapActions("myClient", ["setCurrentEmoji", "setIsDisplay"]),
    close() {
      this.$emit("emojiVisibleClose", false);
    },
    emojiClick(item, i) {
      console.log(item, i, this.$parent, 222);
      this.setCurrentEmoji({
        value: item,
        id: i,
      });
      this.setIsDisplay(true);
      this.close();
      console.log(this.getIsDisplay, this.getCurrentEmoji);
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog {
  -webkit-app-region: no-drag;
  margin-left: 142px;
  border-radius: 10px;
  box-shadow: unset;
  filter: drop-shadow(0 2px 8px rgb(192, 192, 192));
  &::after {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -33px;
    margin: auto;
    display: inline-block;
    content: "";
    width: 24px;
    height: 32px;
    border-width: 16px 12px 16px 12px;
    border-color: #ffffff transparent transparent transparent;
    border-style: solid;
    box-sizing: border-box;
  }
  .el-dialog__header {
    padding: 0;
    border-radius: 10px 10px 0 0;
  }
  .el-dialog__body {
    padding: 0;
    border-radius: 0 0 10px 10px;

    .el-card {
      box-shadow: unset;
      border: none;
      position: relative;
      padding-top: 20px;
      padding-bottom: 70px;
      box-sizing: border-box;
      border-radius: 10px;
      .el-card__body {
        display: grid;
        grid-template-columns: repeat(8, 40px);
        grid-column-gap: 13px;
        grid-row-gap: 13px;
        flex-wrap: wrap;
        align-content: flex-start;
        padding: 15px 20px;
        height: 305px;
        box-sizing: border-box;
        overflow-y: scroll;
        .wwxface {
          border-radius: 5px;
          &:hover {
            background-color: rgb(240, 239, 239);
          }
        }
        &::-webkit-scrollbar {
          display: none;
        }
        .bar {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 55px;
          border-top: 1px #f2f2f2 solid;
          border-radius: 0 0 10px 10px;
        }
      }
    }
  }
}
</style>
