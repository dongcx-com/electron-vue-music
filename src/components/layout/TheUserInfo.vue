<template>
    <div class="flex items-center cursor-pointer hover-text">
        <el-avatar
            size="small"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
            class="bg-gray-200"
        />
        <span class="text-xs ml-1.5" v-if="isLogin">小明</span>
        <span class="text-xs ml-1.5 no-drag" @click="handleShowLoginDialog" v-else>点击登录</span>
    </div>
    <el-dialog v-model="showLogin" title="登录" width="330px" append-to-body>
        <div>
            <el-input size="large" placeholder="手机号码" :prefix-icon="Phone" v-model="phone" />
            <el-input
                size="large"
                class="mt-5"
                placeholder="登录密码"
                :prefix-icon="Lock"
                v-model="password"
            />

            <button
                @click="loginSubmit"
                class="button w-full mt-5 py-5"
                style="border-radius: 5px;"
            >登录</button>
        </div>
    </el-dialog>
</template>

<script>
import { useStore } from "vuex";
import { IS_LOGIN } from "@utils/getters";
import { computed, ref } from "@vue/runtime-core";
import { Phone, Lock } from "@element-plus/icons-vue";
export default {
    name: "TheUserInfo",
    setup() {
        const store = useStore();

        const showLogin = ref(false);

        const handleShowLoginDialog = () => {
            showLogin.value = !showLogin.value;
        };

        const phone = ref("");
        const password = ref("");

        const loginSubmit = () => {};

        return {
            isLogin: computed(() => store.getters[IS_LOGIN]),
            handleShowLoginDialog,
            showLogin,
            Phone,
            phone,
            Lock,
            password,
            loginSubmit,
        };
    },
};
</script>

<style>
</style>