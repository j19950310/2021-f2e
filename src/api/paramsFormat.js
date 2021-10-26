// https://github.com/ptxmotc/PTX_Web/blob/master/Swagger服務說明上傳參考檔案/公共運輸整合資訊平台資料服務開發實作.pdf

function select (arr) {
    if (arr.length === 0) {
        return ''
    }
    return `${arr.join(',')}`
}

// filter('test>3&amout<9|ewaf==123')'test gt 3 and amout lt 9 or ewa eq 123'
function filterLogic (str) {
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
    // obj x key
    const key2sign = Object.entries(sign2key).reduce((ret, entry) => {
        const [key, value] = entry
        ret[value] = key
        return ret
    }, {})

    let isSign = false
    return str.split(' ')
        .map(item => (item ? item.trim() : ''))
        .filter(Boolean)
        .map(text => (sign2key[text] || text))
        .reduce((prev, curr) => {
            if (key2sign[curr]) {
                isSign = true
                return `${prev} ${curr}`
            } else if (isSign) {
                isSign = false
                return `${prev} ${curr}`
            } else {
                return `${prev}${curr}`
            }
        })
}
