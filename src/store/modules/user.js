import { login, logout } from '@/api/user';
import { setUserInfo } from '@/utils/auth';

const state = {
  userInfo: {},
};

// getters
const getters = {
  cartProducts: (state, getters, rootState) => state.items.map(({ id, quantity }) => {
    const product = rootState.products.all.find(product => product.id === id);
    return {
      title: product.title,
      price: product.price,
      quantity,
    };
  }),

  cartTotalPrice: (state, getters) => getters.cartProducts.reduce((total, product) => total + product.price * product.quantity, 0),
};

// actions
const actions = {
  // 登录
  login({ commit }, userInfo) {
    console.log(userInfo);
    const { username, password } = userInfo;
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), psd: password }).then((response) => {
        const { data } = response;
        const users = { accessToken: data.accessToken, userName: data.userName };
        commit('SET_USERINFO', { userInfo: users });
        setUserInfo(users);
        resolve();
      }).catch((error) => {
        reject(error);
      });
    });
  },

  // 登出
  LogOut({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout().then((response) => {
        clearStorage();
        commit('CLEAR_USERINFO');
        resolve(response);
      });
    }).catch((error) => {
      reject(error);
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
