
exports.eachFn = (obj, typeArr) => {
    let result = void 0
    const toString = Object.prototype.toString
    if (toString.call(obj) === '[object Array]') {
        result = []
        for (let i = 0; i < obj.length; i++) {
            result[i] = this.eachFn(obj[i], typeArr)
        }
    } else if (toString.call(obj) === '[object Object]') {
        result = {}

        for (let _key in obj) {
            if (obj.hasOwnProperty(_key)) {
                let flag = 0
                let _value = null
                for (let j = 0; j < typeArr.length; j++) {
                    if (typeArr[j].key === _key) {
                        flag = 1
                        _value = typeArr[j].value
                    }
                }

                if (flag) {
                    result[_value] = this.eachFn(obj[_key], typeArr)
                } else {
                    result[_key] = this.eachFn(obj[_key], typeArr)
                }
            }
        }
    } else {
        return obj
    }
    console.log('result', result)
    return result
}