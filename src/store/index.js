import { createStore } from 'vuex'

const state = () => ({
  data: {},
  total: 0,
  totals: {},
  activeBirds: []
});

const mutations = {
  setData(state, payload) {
    state.data = payload;
  },
  setTotal(state, payload) {
    state.total = payload;
  },
  setTotals(state, payload) {
    state.totals = payload;
  },
  setActiveBirds(state, payload) {
    state.activeBirds = payload;
  }
};

const actions = {
  updateData(context, payload) {
    context.commit('setData', payload);
  },
  updateTotal(context, payload) {
    context.commit('setTotal', payload)
  },
  updateTotals(context, payload) {
    context.commit('setTotals', payload)
  },
  updateActiveBirds(context, payload) {
    context.commit('setActiveBirds', payload)
  }
};

const getters = {
  getData(state) {
    return state.data;
  },
  getTotal: (state) => state.total,
  getTotals: (state) => state.totals,
  getActiveBirds: (state) => state.activeBirds
};

export default createStore({
  state,
  getters,
  mutations,
  actions,
  namespaced: false
})
