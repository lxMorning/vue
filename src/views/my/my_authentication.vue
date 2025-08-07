<template>
  <div>
    <navBar :navTitle="$t('my_authentication.title')" prevPath="my" />
    <van-form ref="refFormCard" class="public-form full-width92">
      <!-- 用户名输入框 -->
      <div>
        <div class="inp-label">{{ $t('my_authentication.text1') }}</div>
        <van-field v-model.trim="formCard.username" class="bg-inp" :placeholder="$t('my_authentication.placeholder1')" clearable
                   :rules="[{ required: true, message: $t('my_authentication.rule1') }]"/>
      </div>

      <!-- 身份证号码输入框 -->
      <div>
        <div class="inp-label">{{ $t('my_authentication.text2') }}</div>
        <van-field v-model.trim="formCard.name_id" class="bg-inp" :placeholder="$t('my_authentication.placeholder2')" clearable
                   :rules="[{ required: true, message: $t('my_authentication.rule2') }]"/>
      </div>

      <!-- 身份证正面上传 -->
      <div>
        <div class="inp-label">{{ $t('my_authentication.uploadFront') }}</div>
        <van-uploader
          v-model="frontIdCard"
          :after-read="onAfterReadFront"
          :max-size="5 * 1024 * 1024"
          :max-count="1"
          accept="image/*"
          show-delete="true"
        />
        <div v-if="frontIdCard.length > 0" class="image-preview">
        </div>
      </div>

      <!-- 身份证反面上传 -->
      <div>
        <div class="inp-label">{{ $t('my_authentication.uploadBack') }}</div>
        <van-uploader
          v-model="backIdCard"
          :after-read="onAfterReadBack"
          :max-size="5 * 1024 * 1024"
          :max-count="1"
          accept="image/*"
          show-delete="true"
        />
        <div v-if="backIdCard.length > 0" class="image-preview">
        </div>
      </div>

      <!-- 提交按钮 -->
      <van-button block type="info" native-type="submit" class="marTop40" @click="fnBtnSave"
      v-btn-re-click :disabled="!isFormValid">{{ $t('my_authentication.submit') }}</van-button>
    </van-form>
  </div>
</template>

<script>
import { quser_edit_api } from "@/assets/js/api";
import axios from 'axios';

export default {
  name: "myAuthentication",
  data() {
    return {
      formCard: {
        username: "",
        name_id: "",
      },
      frontIdCard: [],  // 存储身份证正面的上传图片路径
      backIdCard: [],   // 存储身份证背面的上传图片路径
    };
  },
  computed: {
    // 检查表单是否有效，确保身份证正反面图片都已上传
    isFormValid() {
      return this.frontIdCard.length > 0 && this.backIdCard.length > 0;
    }
  },
  methods: {
    // 处理身份证正面上传后
    async onAfterReadFront(file) {
      const formData = new FormData();
      formData.append("image", file.file);

      try {
        // 上传图片到服务器
        const res = await this.uploadImage(formData);
        if (res && res.data && res.data.file_path) {
          this.frontIdCard = [{
            url: res.data.file_path
          }];
        } else {
          this.$toast(this.$t('my_authentication.uploadFailed'));
        }
      } catch (error) {
        console.error('上传正面图片时发生错误：', error);
        this.$toast(this.$t('my_authentication.uploadError'));
      }
    },

    // 处理身份证背面上传后
    async onAfterReadBack(file) {
      const formData = new FormData();
      formData.append("image", file.file);

      try {
        // 上传图片到服务器
        const res = await this.uploadImage(formData);
        if (res && res.data && res.data.file_path) {
          this.backIdCard = [{
            url: res.data.file_path
          }];
        } else {
          this.$toast(this.$t('my_authentication.uploadFailed'));
        }
      } catch (error) {
        console.error('上传背面图片时发生错误：', error);
        this.$toast(this.$t('my_authentication.uploadError'));
      }
    },

    // 通用上传图片方法
    uploadImage(formData) {
      return axios.post('/index/quser/uploadImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).catch((error) => {
        console.error('上传图片时接口调用失败：', error);
        this.$toast(this.$t('my_authentication.uploadApiFailed'));
        throw error;
      });
    },

    // 保存认证数据并上传图片路径
    fnBtnSave() {
      // 确保已经上传了身份证正面和背面照片
      if (!this.isFormValid) {
        this.$toast(this.$t('my_authentication.formInvalid'));
        return;
      }

      this.$refs.refFormCard.validate().then(() => {
        // 构建表单数据
        const formData = new FormData();
        formData.append("id", localStorage.getItem("userId")); // 用户 ID
        formData.append("username", this.formCard.username);
        formData.append("name_id", this.formCard.name_id);

        // 提交图片路径
        if (this.frontIdCard.length > 0) {
          formData.append("front_id_card", this.frontIdCard[0].url);
        }
        if (this.backIdCard.length > 0) {
          formData.append("back_id_card", this.backIdCard[0].url);
        }

        // 提交到后端保存认证信息
        quser_edit_api(formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }).then((res) => {
          if (res.code == 200) {
            this.$toast(res.msg || this.$t('my_authentication.success'));
            setTimeout(() => {
              this.$router.push({
                name: 'my',
              });
            }, 1000);
          } else {
            this.$toast(res.msg || this.$t('my_authentication.failure'));
          }
        }).catch((err) => {
          console.error('提交认证数据失败：', err);
          this.$toast(this.$t('my_authentication.submitFailed'));
        });
      }).catch(() => {
        this.$toast(this.$t('my_authentication.formInvalid'));
      });
    }
  }
};
</script>

<style scoped>
.image-preview {
  margin-top: 10px;
  width: 100%;
  max-width: 300px;
  height: auto;
}
.image-preview img {
  width: 100%;
  border-radius: 8px;
}
</style>
