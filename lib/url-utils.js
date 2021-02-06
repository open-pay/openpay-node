function escapeBrackets(url) {
    url = url.replace(new RegExp('\\[', 'g'), encodeURI('['))
    url = url.replace(new RegExp('\]', 'g'), encodeURI(']'))
    console.log('3:', url)
    return url;
}

exports.escapeBrackets = escapeBrackets;
