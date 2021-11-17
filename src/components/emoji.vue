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
        class="qqface"
        :class="`qqface${i}`"
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
import { mapGetters, mapActions } from 'vuex'
import emojiMap from '../util/emoji'
export default {
  props: { emojiVisible: Boolean },
  data() {
    return {
      emojiList: []
    }
  },
  computed: {
    ...mapGetters('myClient', ['getCurrentEmoji', 'getIsDisplay'])
  },
  mounted() {
    console.log(emojiMap, 56666)
    let valueArr = []
    let KeyArr = []
    emojiMap.forEach((value, key) => {
      valueArr.push(value)
      KeyArr.push(key)
    })
    this.emojiList = KeyArr
    console.log(valueArr, KeyArr)
  },
  methods: {
    ...mapActions('myClient', ['setCurrentEmoji', 'setIsDisplay']),
    close() {
      this.$emit('emojiVisibleClose', false)
    },
    emojiClick(item, i) {
      console.log(item, i, this.$parent, 222)
      this.setCurrentEmoji({
        value: item,
        id: i
      })
      this.setIsDisplay(true)
      this.close()
      console.log(this.getIsDisplay, this.getCurrentEmoji)
    }
  }
}
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
    content: '';
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
        .qqface {
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

.qqface {
  background: url('../assets/emoji.png');
  background-repeat: no-repeat;
}

.qqface.qqface0 {
  background-position: 0 0;
}

.qqface.qqface1 {
  background-position: -37px 0;
}

.qqface.qqface2 {
  background-position: -74px 0;
}

.qqface.qqface3 {
  background-position: -112px 0;
}

.qqface.qqface4 {
  background-position: -149px 0;
}

.qqface.qqface5 {
  background-position: -186px 0;
}

.qqface.qqface6 {
  background-position: -224px 0;
}

.qqface.qqface7 {
  background-position: -260px 0;
}

.qqface.qqface8 {
  background-position: -300px 0;
}

.qqface.qqface9 {
  background-position: -336px 0;
}

.qqface.qqface10 {
  background-position: -372px 0;
}

.qqface.qqface11 {
  background-position: -411px 0;
}

.qqface.qqface12 {
  background-position: -448px 0;
}

.qqface.qqface13 {
  background-position: -486px 0;
}

.qqface.qqface14 {
  background-position: -523px 0;
}

.qqface.qqface15 {
  background-position: 0 -37px;
}

.qqface.qqface16 {
  background-position: -37px -37px;
}

.qqface.qqface17 {
  background-position: -74px -37px;
}

.qqface.qqface18 {
  background-position: -111px -37px;
}

.qqface.qqface19 {
  background-position: -149px -37px;
}

.qqface.qqface20 {
  background-position: -186px -37px;
}

.qqface.qqface21 {
  background-position: -224px -37px;
}

.qqface.qqface22 {
  background-position: -260px -37px;
}

.qqface.qqface23 {
  background-position: -299px -37px;
}

.qqface.qqface24 {
  background-position: -336px -37px;
}

.qqface.qqface25 {
  background-position: -372px -37px;
}

.qqface.qqface26 {
  background-position: -408px -37px;
}

.qqface.qqface27 {
  background-position: -448px -37px;
}

.qqface.qqface28 {
  background-position: -485px -37px;
}

.qqface.qqface29 {
  background-position: -523px -37px;
}

.qqface.qqface30 {
  background-position: 0 -75px;
}

.qqface.qqface31 {
  background-position: -37px -75px;
}

.qqface.qqface32 {
  background-position: -74px -75px;
}

.qqface.qqface33 {
  background-position: -112px -75px;
}

.qqface.qqface34 {
  background-position: -148px -75px;
}

.qqface.qqface35 {
  background-position: -186px -75px;
}

.qqface.qqface36 {
  background-position: -223px -75px;
}

.qqface.qqface37 {
  background-position: -260px -75px;
}

.qqface.qqface38 {
  background-position: -299px -75px;
}

.qqface.qqface39 {
  background-position: -336px -75px;
}

.qqface.qqface40 {
  background-position: -374px -75px;
}

.qqface.qqface41 {
  background-position: -412px -75px;
}

.qqface.qqface42 {
  background-position: -448px -75px;
}

.qqface.qqface43 {
  background-position: -485px -75px;
}

.qqface.qqface44 {
  background-position: -522px -75px;
}

.qqface.qqface45 {
  background-position: 2px -113px;
}

.qqface.qqface46 {
  background-position: -37px -113px;
}

.qqface.qqface47 {
  background-position: -74px -113px;
}

.qqface.qqface48 {
  background-position: -112px -113px;
}

.qqface.qqface49 {
  background-position: -148px -113px;
}

.qqface.qqface50 {
  background-position: -186px -113px;
}

.qqface.qqface51 {
  background-position: -223px -113px;
}

.qqface.qqface52 {
  background-position: -259px -113px;
}

.qqface.qqface53 {
  background-position: -299px -113px;
}

.qqface.qqface54 {
  background-position: -336px -113px;
}

.qqface.qqface55 {
  background-position: -374px -113px;
}

.qqface.qqface56 {
  background-position: -410px -113px;
}

.qqface.qqface57 {
  background-position: -448px -113px;
}

.qqface.qqface58 {
  background-position: -484px -113px;
}

.qqface.qqface59 {
  background-position: -523px -113px;
}

.qqface.qqface60 {
  background-position: 2px -150px;
}

.qqface.qqface61 {
  background-position: -36px -150px;
}

.qqface.qqface62 {
  background-position: -74px -150px;
}

.qqface.qqface63 {
  background-position: -112px -150px;
}

.qqface.qqface64 {
  background-position: -148px -150px;
}

.qqface.qqface65 {
  background-position: -186px -150px;
}

.qqface.qqface66 {
  background-position: -223px -150px;
}

.qqface.qqface67 {
  background-position: -260px -150px;
}

.qqface.qqface68 {
  background-position: -298px -150px;
}

.qqface.qqface69 {
  background-position: -336px -150px;
}

.qqface.qqface70 {
  background-position: -372px -150px;
}

.qqface.qqface71 {
  background-position: -411px -150px;
}

.qqface.qqface72 {
  background-position: -448px -150px;
}

.qqface.qqface73 {
  background-position: -485px -150px;
}

.qqface.qqface74 {
  background-position: -523px -150px;
}

.qqface.qqface75 {
  background-position: 2px -187px;
}

.qqface.qqface76 {
  background-position: -36px -187px;
}

.qqface.qqface77 {
  background-position: -73px -187px;
}

.qqface.qqface78 {
  background-position: -110px -187px;
}

.qqface.qqface79 {
  background-position: -148px -187px;
}

.qqface.qqface80 {
  background-position: -185px -187px;
}

.qqface.qqface81 {
  background-position: -224px -187px;
}

.qqface.qqface82 {
  background-position: -260px -187px;
}

.qqface.qqface83 {
  background-position: -298px -187px;
}

.qqface.qqface84 {
  background-position: -336px -187px;
}

.qqface.qqface85 {
  background-position: -372px -187px;
}

.qqface.qqface86 {
  background-position: -411px -187px;
}

.qqface.qqface87 {
  background-position: -448px -187px;
}

.qqface.qqface88 {
  background-position: -484px -187px;
}

.qqface.qqface89 {
  background-position: -523px -225px;
}

.qqface.qqface90 {
  background-position: 3px -225px;
}

.qqface.qqface91 {
  background-position: -36px -225px;
}

.qqface.qqface92 {
  background-position: -73px -225px;
}

.qqface.qqface93 {
  background-position: -112px -225px;
}

.qqface.qqface94 {
  background-position: -148px -225px;
}

.qqface.qqface95 {
  background-position: -185px -225px;
}

.qqface.qqface96 {
  background-position: -223px -225px;
}

.qqface.qqface97 {
  background-position: -260px -225px;
}

.qqface.qqface98 {
  background-position: -298px -225px;
}

.qqface.qqface99 {
  background-position: -336px -225px;
}

.qqface.qqface100 {
  background-position: -373px -225px;
}

.qqface.qqface101 {
  background-position: -410px -225px;
}

.qqface.qqface102 {
  background-position: -448px -225px;
}

.qqface.qqface103 {
  background-position: -485px -225px;
}

.qqface.qqface104 {
  background-position: -522px -225px;
}
</style>
