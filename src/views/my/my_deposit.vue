<template>
  <div>
    <navBar navTitle="Nạp tiền" prevPath="my" />
    <main class="full-width92">
      <van-form ref="refFormPassword" class="public-form">
        <b>{{ $t('my_deposit.text1') }}</b>
        <van-field class="bg-inp" v-model="formattedMoney" type="text" placeholder="Nhập số tiền cần nạp"
                   :rules="[{validator: checkMoney, message: errMsg }]" @input="handleMoneyInput"/>
        <!-- <div class="deposit-note">{{ $t('my_deposit.text2') }}</div> -->
      </van-form>

      <van-row class="money-box" gutter="10">
        <van-col span="8" v-for="(item, index) in priceArr" :key="index"
                 @click="fnBtnChangeVan(item, index)" >
          <div class="money-num"  :class="index == activeMoney ? 'van-active' : '' ">{{ item }}</div>
        </van-col>
      </van-row>

      <van-button block type="info" class="btn-save" @click="fnGoPassageway" v-btn-re-click>{{ $t('my_deposit.text3') }}</van-button>
    </main>
  </div>
</template>

<script>
export default {
  name: "myDeposit",
  data() {
    return {
      money: "",
      formattedMoney: "",
      priceArr:['20.000.000', '50.000.000', '100.000.000 ', '200.000.000 ', '300.000.000 ', '500.000.000'],
      activeMoney: -1,  /* 选中 */
      errMsg:"Giá trị được lưu trữ không được 0",
    }
  },
  methods: {
    // 将输入的数字格式化为千分位格式
    formatNumberWithDots(num) {
      if (!num) return '';
      // 移除所有现有的分隔符
      let cleanNum = num.toString().replace(/\./g, '');
      // 添加千分位分隔符
      return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    // 处理输入事件
    handleMoneyInput(value) {
      // 移除所有非数字字符，除了我们允许的点号
      const cleanValue = value.replace(/[^0-9.]/g, '');

      // 移除所有点号以获取纯数字
      const numericValue = cleanValue.replace(/\./g, '');

      // 更新原始数字值
      this.money = numericValue;

      // 格式化显示值
      this.formattedMoney = this.formatNumberWithDots(numericValue);
    },

    checkMoney(val){
      console.log(val);
      if(val == 0){
        this.errMsg = "Giá trị được lưu trữ không được 0！"
        return false
      }
      if(val < 0){
        this.errMsg = "Số lượng giá trị được lưu trữ không được nhỏ hơn 0！"
        return false
      }
    },
    /*去儲值通道*/
    fnGoPassageway(){
      this.$refs.refFormPassword.validate().then(()=>{
        this.$router.push({
          name:"my_deposit_passageway",
          query:{
            money:this.money,
          }
        })
      }).catch(res=>{})
      //this.$toast('Kênh giá trị được lưu trữ đã đầy, vui lòng liên hệ với bộ phận chăm sóc khách hàng！');
      //this.errMsg = "振瀚私募儲值通道已滿，請聯絡客服！"
      return false
    },

    /*选中*/
    fnBtnChangeVan(item, index){
      const numericValue = parseInt(item.replaceAll('.',''));
      this.money = numericValue;
      this.formattedMoney = item;
      this.activeMoney = index;
    }
  },
  created() {

  },
}
</script>

<style lang="scss" scoped>
.deposit-note {
  font-size: 12px;
  margin: 6px 0;
}

.money-box {
  .money-num {
    background-color: #f1eff0;
    border-radius: 6px;
    margin-bottom: 10px;
    text-align: center;
    height: 42px;
    line-height: 42px;
    font-size: 16px;
    //font-weight: bold;
  }

  .van-active {
    background-color: #3365e3;
    color: #fff;
  }
}

.btn-save {
  margin: 30px auto 10px;
}
</style>