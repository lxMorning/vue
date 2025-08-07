<template>
	<div>
		<navBar :navTitle="info ? info.product_name+'Giới thiệu' : ''" />
		<viewer>
		<img :src="envUrl + info.desc" width="100%" style="margin: 20px 0;"/>
		</viewer>
		<div class="buy" @click="buy()" v-if="info.status == 1">Mua</div>
	</div>
</template>

<script>
	import {
	  index_product_info_api,
	} from "@/assets/js/api";
	import { Dialog } from "vant";
	
	export default {
	  name: "project-info",
	  components: {},
	  props: {},
	  data() {
	    return {
	      info: null,
		  id:0,
		  envUrl: process.env.VUE_APP_SERVER,
	    };
	  },
	  computed: {
	    predict_price() {
	      let money = JSON.parse(JSON.stringify(this.money)) || 0;
	      if (!this.info) return;
	      let { day_rate, day } = JSON.parse(JSON.stringify(this.info));
	      if (day_rate && money) {
	        let rate = money * (Number(day_rate) / 100) * day;
	        let num = Number(money) + rate;
	        return num.toFixed(2);
	      } else {
	        return 0;
	      }
	    },
	  },
	  methods: {
	    init() {
	      let id = this.$route.query.id;
		  this.id = id;
		  index_product_info_api({
		    product_id: id,
		  }).then((res) => {
		    if (res.code == 200) {
		      this.info = res.data;
		    }
		  });
	    },
		buy(){
			this.$router.push("/manageFinances_info?id=" + this.id);
		}
	  },
	  mounted() {
	    this.init();
	  },
	};
</script>

<style lang="scss" scoped>
	.buy{
		width: 80%;
		height: 40px;
		line-height: 40px;
		text-align: center;
		background-color: orange;
		color: #FFFFFF;
		margin: 0 auto;
		border-radius: 5px;;
	}
</style>
