# Simple SAAS billing engine

Here is a set of function to calculate service due date according to service
usage timeline, tariffs, and payments.

It's simple and it does not care about:

* currency
* taxes
* service had to be disabled because of negative balance but it was not
  (service stopped because of overdue payment continues to collect debt)


## Quick start

`npm i saas-bill --save`

```
const { getPaymentDue } = require('saas-bill')();

const timeline = [
    {action: "start", date: "2020-01-02"},
]
const tariff = [
    {action: "start", date: "2020-01-02", price: 10000, days: 30.41, creditLimit: 10000},
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
const { getPaymentDue } = require('saas-bill')();
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

## Timeline record

|Field|Meaning|
|--|--|
|`action`|"start" or "stop" ("start" can be omitted) of service work period|
|`date`|date of "start" (inclusive) or "stop" (exclusive, service does not work in stop day)|

## Tariff record

|Field|Meaning|
|--|--|
|`action`|"start" (can be omitted)|
|`date`|tariff activation day|
|`price`|price per period|
|`days`|number of days in period (`30.41` is average month length)|
|`creditLimit`|credit limit|

## Payment record
|Field|Meaning|
|--|--|
|`sum`|Sum of payment|
|`date`|date of payment|
