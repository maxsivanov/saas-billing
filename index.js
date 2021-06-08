const {
    getPaymentDue,
    getRangeOffset,
} = require('./lib');

module.exports = function(min, max) {
    const start = getRangeOffset(min || "2000-01-01");
    const endOffset = getRangeOffset(max || "2049-12-31", start);
    return {
        getPaymentDue: getPaymentDue.bind(null, {start, endOffset}),
    }
}
