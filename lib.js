function getRangeOffset(str, start) {
    return (new Date(`${str}T00:00:00Z`)).getTime() / 1000 / 86400 -
        (start || 0);
}

function getDateFromOffset(offset, start) {
    const date = new Date((offset + (start || 0)) * 86400 * 1000);
    return date.toISOString().split('T')[0];
}

function arrayRange(from, to) {
    return [...(new Array(to - from + 1)).keys()].map(item => item + from);
}

function applyOperation(range, op) {
    return arrayRange(op.offset, range.length).reduce((sum, index) => {
        const item = op.item;
        if (item.action === "start" || typeof item.action === "undefined") {
            sum[index] = op.item;
        }
        if (item.action === "stop") {
            sum[index] = undefined;
        }
            return sum;
    }, range);
}

function createRange({start, endOffset}, list) {
    const opsList = list.map(item => ({
        item,
        offset: getRangeOffset(item.date, start),
    }));
    const sortedOpsList = opsList.sort((a, b) => a - b);
    const emptyRange = new Array(endOffset + 1);
    return sortedOpsList.reduce(applyOperation, emptyRange);
}

function getPaymentDue(
    options,
    timeline,
    tariff,
    payments
) {
    const timelineRange = createRange(options, timeline);
    const tariffRange = createRange(options, tariff);
    const allPayments = payments.reduce((sum, payment) => {
        sum += payment.sum;
        return sum;
    }, 0);
    const [allUsage] = timelineRange.reduce((sum, item, index) => {
        const [foundIndex, rest, creditApplied] = sum;
        if (!item) {
            return sum;
        }
        const dayTariff = tariffRange[index];
        const { price, days, creditSum } = dayTariff;
        if (rest <= 0) {
            if (creditSum && !creditApplied) {
                return [index, rest + creditSum - price / days, true];
            }
            return [foundIndex, 0, creditApplied];
        }
        return [index, rest - price / days, creditApplied];
    }, [0, allPayments, false]);
    return getDateFromOffset(allUsage, options.start);
}

module.exports = {
    getRangeOffset,
    createRange,
    getPaymentDue,
    getDateFromOffset,
}
