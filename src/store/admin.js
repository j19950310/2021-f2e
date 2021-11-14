import { getTaiwanCounty, getTownsByCountycode } from '@/api/getAdministrative'
export default {
    namespaced: true,
    state: () => ({
        county: {},
    }),
    getters: {
        getSelectedTownListByCounties: (state) => (counties) => {
            const list = {}
            counties.forEach(countyName => {
                if (state.county[countyName]) {
                    list[countyName] = state.county[countyName].towns
                }
            })
            return list
        },
    },
    mutations: {
        setCounty (state, county) {
            state.county = county
        },
        setTowns (state, { towns, countyName }) {
            if (state.county[countyName]) {
                state.county[countyName].towns = towns
            }
        },
    },
    actions: {
        init ({ commit, state }) {
            getTaiwanCounty().then(res => {
                commit('setCounty', res)
            })
        },
        getTownsByCountyName ({ commit, state }, countyName) {
            return new Promise((resolve, reject) => {
                // 防止打過重複的請求
                if (state.county[countyName] && !state.county[countyName].towns.length) {
                    const countycode = state.county[countyName].code
                    getTownsByCountycode(countycode).then(res => {
                        commit('setTowns', { countyName, towns: res })
                        resolve(res)
                    })
                } else if (state.county[countyName]) {
                    resolve(state.county[countyName].towns)
                } else {
                    // console.log(`沒有${countyName}`)
                    resolve([])
                }
            })
        },
    },
}
