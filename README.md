# Simple SAAS billing engine

Here is a set of function to calculate service due date according to service
usage timeline, tariffs, and payments.

It's simple and it does not care about:

* currency
* taxes


## Quick start

`npm i saas-billing --save`

```
const { getPaymentDue } = require('saas-billing')();

const timeline = [
    {action: "start", date: "2020-01-02"},
]
const tariff = [
    {action: "start", date: "2020-01-02", price: 10000, days: 30.41, creditSum: 10000},
];
const payments = [
    {date: "2020-01-02", sum: 10000},
];
const due = getPaymentDue(
    timeline,
    tariff,
    payments
);
console.log(due) // to be "2020-03-02"
```

or

```
const { getPaymentDue } = require('saas-billing')();
const timeline = [
    {action: "start", date: "2020-01-02"},
    {action: "stop", date: "2020-01-15"},
]
const tariff = [
    {action: "start", date: "2020-01-02", price: 10000, days: 30.41},
];
const payments = [
    {date: "2020-01-02", sum: 10000},
];
const due = getPaymentDue(
    timeline,
    tariff,
    payments
);
console.log(due) // to be "2020-01-04" (service timeline stop date)
```
