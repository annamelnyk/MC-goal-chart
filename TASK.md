# Goalhub Developer test

Create an [Angular](https://angular.io/) single page application that implements this [mockup](./mockup.pdf), with the following requirements:

## Libraries and environment requirements

- Any packages will be installed and run on NodeJS LTS/Fermium and NPM 9+
- TypeScript 4+
- SCSS
- Bootstrap 4 (if needed)
- ngx-charts (if needed)

We expect to be able to install and start the application using standard commands (`npm install`, then `npm start`)

## Application logic requirements

- Data can be filtered by year, listing years from 5 years ago to this year (inclusively)
- Circle includes the total number of created goals inside it (`all`)
- The arrow and percentage reflect the increase or decrease in relation to the previous year (e.g., 2023 vs. 2022)
- When the dropdown changes, the chart should filter automatically
- The ring shows totals per category (other than `all`)
- The page is responsive (your choice of mobile layout)

## Obtaining data

- Implement any data fetching using standard angular services
- Ensure you only log in if:
  1. you don't have a token
  2. the token has expired (you will receive a 401 HTTP error)

To obtain sample data, you will need to call the following 2 Goalhub APIs in sequence:

1. Log in to your test account via a POST request:

URL: https://api.staging-goalhub.mcloud.net.au/webservices/goalhub/2.0/auth/signIn.json
Request body: `{"username":"developertestaccount@goalhub.com","password":"goalhub"}`

2. Save the token received (`.token` property in response)

3. Fetch goal data by sending a POST request:

URL: https://api.staging-goalhub.mcloud.net.au/webservices/goalhub/2.0/report/goal.json
Headers: 
```json
{
    "X-Access-Token": "YOUR_TOKEN_HERE",
    "X-Client-Id": "2DqsD3G5TUwGL9urvuB6hkxUNpNK1P10XEOrJxCOHeI4",
}
```
Request body:
```json
{
    "cohorts": {
        "goalhubs": [
            "1520"
        ]
    },
    "period": {
        "type": "year",
        "value": "YOUR_FORM_VALUE_HERE",
        "interval": "month"
    },
    "goalType": "completed"
}
```

The Client ID header, and goalhub id can be hardcoded. You should expect data like this:

```json
{
    "(YOUR_FORM_VALUE - 1)_HERE-MONTH_NUMBER_1": {
        "created": {
            "all": 4,
            "focus_area": 0,
            "attendance": 0,
            "literacy": 0,
            "numeracy": 0,
            "culture": 0,
            "wellbeing": 0,
            "other": 0
        },
        // ...
    },
    // ...
    "YOUR_FORM_VALUE_HERE-MONTH_NUMBER_1": {
        "created": {
            "all": 4,
            "focus_area": 0,
            "attendance": 0,
            "literacy": 0,
            "numeracy": 0,
            "culture": 0,
            "wellbeing": 0,
            "other": 0
        },
        // ...
    }
    // ...
    "YOUR_FORM_VALUE_HERE-MONTH_NUMBER_N": {
        "created": {
            "all": 4,
            "focus_area": 0,
            "attendance": 0,
            "literacy": 0,
            "numeracy": 0,
            "culture": 0,
            "wellbeing": 0,
            "other": 0
        },
    }
}
```

The data must then be aggregated for the whole year, before presenting any numbers.
