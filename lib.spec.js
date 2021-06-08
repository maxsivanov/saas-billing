const {
    createRange,
    getRangeOffset,
    getDateFromOffset,
} = require('./lib');

const { getPaymentDue } = require('./index')('2020-01-01', '2020-06-01');

it('To range offset and back', () => {
    expect(getDateFromOffset(getRangeOffset("2000-01-01"))).toBe("2000-01-01");
    expect(getDateFromOffset(getRangeOffset("2020-01-01"))).toBe("2020-01-01");
});

it('Create range (closed)', () => {
    const timeline = [
        {date: "2020-01-02"},
        {action: "stop", date: "2020-03-02"},
    ]
    const start = getRangeOffset("2000-01-01");
    const endOffset = getRangeOffset("2049-12-31", start);
    const range = createRange({
        start,
        endOffset,
    }, timeline);
    expect(range[getRangeOffset("2020-01-01", start)]).toBeUndefined();
    expect(range[getRangeOffset("2020-01-02", start)]).toBe(timeline[0]);
    expect(range[getRangeOffset("2020-03-01", start)]).toBe(timeline[0]);
    expect(range[getRangeOffset("2020-03-02", start)]).toBeUndefined();
});

it('Create range (open)', () => {
    const timeline = [
        {date: "2020-01-02"},
    ]
    const start = getRangeOffset("2000-01-01");
    const endOffset = getRangeOffset("2049-12-31", start);
    const range = createRange({
        start,
        endOffset,
    }, timeline);
    expect(range[getRangeOffset("2020-01-01", start)]).toBeUndefined();
    expect(range[getRangeOffset("2020-01-02", start)]).toBe(timeline[0]);
    expect(range[getRangeOffset("2049-12-31", start)]).toBe(timeline[0]);
});

it('Payment Due', () => {
    const timeline = [
        {date: "2020-01-02"},
    ]
    const tariff = [
        {date: "2020-01-02", price: 10000, days: 30.41},
    ];
    const payments = [
        {date: "2020-01-02", sum: 10000},
    ];
    const due = getPaymentDue(
        timeline,
        tariff,
        payments
    );
    expect(due).toBe("2020-02-01");
});

it('Payment Due (with creditSum)', () => {
    const timeline = [
        {date: "2020-01-02"},
    ]
    const tariff = [
        {date: "2020-01-02", price: 10000, days: 30.41, creditSum: 10000},
    ];
    const payments = [
        {date: "2020-01-02", sum: 10000},
    ];
    const due = getPaymentDue(
        timeline,
        tariff,
        payments
    );
    expect(due).toBe("2020-03-02");
});

it('Payment Due (stopped)', () => {
    const timeline = [
        {date: "2020-01-02"},
        {action: "stop", date: "2020-01-15"},
    ]
    const tariff = [
        {date: "2020-01-02", price: 10000, days: 30.41},
    ];
    const payments = [
        {date: "2020-01-02", sum: 10000},
    ];
    const due = getPaymentDue(
        timeline,
        tariff,
        payments
    );
    expect(due).toBe("2020-01-14");
});
