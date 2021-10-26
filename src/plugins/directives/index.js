import bg from './bgStyle'
import lock from './scrollLock'
import blur from './blur'

export default (Vue) => {
    Vue.directive('bg', bg)
    Vue.directive('lock', lock)
    Vue.directive('blur', blur)
}
