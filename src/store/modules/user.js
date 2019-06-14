import { login, logout } from '@/api/users';
import { setUserInfo, getUserInfo } from '@/utils/auth';

const state = {
  userInfo: getUserInfo(),
};

// getters
const getters = {
  cartProducts: (state, rootState) => state.items.map(({ id, quantity }) => {
    const product = rootState.products.all.find(item => item.id === id);
    return {
      title: product.title,
      price: product.price,
      quantity,
    };
  }),
  cartTotalPrice: cart => cart.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0),
};

// actions
const actions = {
  // 登录
  login({ commit }, userInfo) {
    const { username, psd } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username, psd }).then((response) => {
        const { data } = response;
        const users = { accessToken: data.accessToken, userName: data.userName };
        commit('SET_USERINFO', { userInfo: users });
        setUserInfo(users);
        resolve(response);
      }).catch((error) => {
        reject(error);
      });
    });
  },

  // 登出
  LogOut({ commit }) {
    return new Promise((resolve, reject) => {
      logout().then((response) => {
        sessionStorage.clear();
        commit('CLEAR_USERINFO');
        resolve(response);
      }).catch(error => reject(error));
    });
  },
};

// mutations
const mutations = {
  SET_USERINFO: (state, { userInfo }) => {
    state.userInfo = userInfo;
  },
  CLEAR_USERINFO: (state) => {
    state.userInfo = {};
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
