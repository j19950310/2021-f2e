// https://github.com/ptxmotc/PTX_Web/blob/master/Swagger服務說明上傳參考檔案/公共運輸整合資訊平台資料服務開發實作.pdf

// 回傳特定欄位
export function select (arr) {
    if (arr.length === 0) {
        return ''
    }
    return `${arr.join(',')}`
}

// filter('test > 3 & amout < 9 | ewaf == 123') => 'test gt 3 and amout lt 9 or ewa eq 123'
export function filter (str) {
    const sign2key = {
        '==': 'eq',
        '!=': 'ne',
        '>': 'gt',
        '>=': 'ge',
        '<': 'lt',
        '<=': 'le',
        '&': 'and',
        '|': 'or',
        '!': 'not',
        '+': 'add',
        '-': 'sub',
        '*': 'mul',
        '/': 'div',
        '%': 'mod',
    }
    Object.entries(sign2key).forEach(([sign, key]) => {
        str = str.replaceAll(sign, ` ${key} `)
    })
    return str
}
