const getActiveUploadObj = function() {
    try {
        return new ActionXObject('TXFTNActiveX.FTNUpload')
    } catch(e) {
        return false
    }
}

const getFlashUploadObj = function() {
    if (supportFlash()) { // 未提供这个函数, 是否支持flash
        const str = `<object type="application/x-shockwave-flash"></object>`
        return $(str).appendTo($('body'))
    }
    return false
}

const getFormUploadObj = function() {
    const str = '<input name="file" type="file" />' // 表单上传
    return $(str).appendTo($('body'))
}


// 这三个函数都有同一个约定, 如果该函数里面的upload对象是可用的,则让函数返回该对象, 否则返回false, 提示迭代器继续迭代

// 1.提供一个可以被迭代的方法, 使用三个方法 依照优先级被循环迭代
// 2. 如果正在被迭代的函数返回一个函数,则表示找到了upload的对象, 反之函数返回false,则继续迭代

const iteratorUploadObj = function() {
    for(let i = 0, fn; fn = arguments[i++];) {
        const uploadObj = fn()
        if (uploadObj !== false) {
            return uploadObj
        }
    }
}

const uploadObj = iteratorUploadObj(getActiveUploadObj, getFlashUploadObj, iteratorUploadObj)

