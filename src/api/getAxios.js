import axios from 'axios'
import JsSHA from 'jssha'

/**
 * 取得該主題前綴網址的 axios ，並設定請求標頭
 */
export default (theme) => {
    // ex.GET /v2/Tourism
    const baseURL = `https://ptx.transportdata.tw/MOTC/v2/${theme}`
    const headers = { ...getAuthorizationHeader() }
    const themAxios = axios.create({ baseURL })
    Object.assign(themAxios.defaults.headers.common, headers)
    return {
        axios: themAxios,
        refreshHeader: () => {
            themAxios.defaults.headers.common = { ...getAuthorizationHeader() }
        },
    }
}

// --header 'Authorization: hmac username="FFFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF", algorithm="hmac-sha1", headers="x-date", signature="b1hM9sTd9pngCi92D4wUrucjteE="'
// --header 'x-date: Sat, 30 Oct 2021 06:47:11 GMT' --header 'Accept-Encoding: gzip' --compressed
// https://codepen.io/hexschool/pen/RwgvZEZ
/**
 * 取得 PTX 驗證標頭
 * @returns {Object} 請求標頭
 */
function getAuthorizationHeader () {
    const AppID = import.meta.env.VITE_APP_API_ID
    const AppKey = import.meta.env.VITE_APP_API_KEY
    const GMTString = new Date().toGMTString()
    const ShaObj = new JsSHA('SHA-1', 'TEXT')
    ShaObj.setHMACKey(AppKey, 'TEXT')
    ShaObj.update('x-date: ' + GMTString)
    const HMAC = ShaObj.getHMAC('B64')
    const Authorization = `hmac username="${AppID}", algorithm="hmac-sha1", headers="x-date", signature="${HMAC}"`
    return { Authorization: Authorization, 'X-Date': GMTString, 'Content-Type': 'application/json' }
}
