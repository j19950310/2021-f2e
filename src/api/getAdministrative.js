import axios from 'axios'
import xml2json from '@/plugins/xml2json'
import getZipcode from '@/api/getZipcode'

const baseUrl = 'https://api.nlsc.gov.tw/other'

export async function getTaiwanCounty () {
    const res = await axios.get(`${baseUrl}/ListCounty`)
    const convertData = {}
    const XmlNode = new DOMParser().parseFromString(res.data, 'text/xml') // 回傳xml格式
    const { countyItems: { countyItem: cities } } = xml2json(XmlNode)
    cities.forEach((city) => {
        convertData[city.countyname] = convertXMLCounty(city)
    })
    return convertData
}

export async function getTownsByCountycode (countycode) {
    const { data } = await axios.get(`${baseUrl}/ListTown1/${countycode}`)

    return data.map(convertXMLTown)
}

// https://api.nlsc.gov.tw/other/TownVillagePointQuery/120.698659/24.156250

export async function getCityByPosition (position) {
    const { lat, lng } = position
    const { data: { ctyName } } = await axios.get(`${baseUrl}/TownVillagePointQuery/${lng}/${lat}`)
    return ctyName
}

function convertXMLCounty (county) {
    return {
        code: county.countycode,
        name: county.countyname,
        towns: [], // 地區鄉鎮
    }
}

function convertXMLTown (town) {
    return {
        code: town.towncode,
        code01: town.towncode01,
        name: town.townname,
        zip: getZipcode(town.townname),
        id: 'towncode' + town.towncode,
    }
}
