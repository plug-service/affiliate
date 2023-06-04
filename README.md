# Affiliate Service

Microservice for affiliate

## Entities

1. referral_code
code: string // min length 1 char
status: 
uId: number
extras: {
    rate: number // percent
    productId?: string
}

2. referral_user
uId: number
referralId: 
status: 
createdAt: 
updatedAt:

3. commission
uId: number
txId: number
tx: {}
rate: 
commission
status: estimated | official 
payment: {
    status:
    detail: 
}


## For dev

```
yarn start:dev
```


## Test
```
npm run test:e2e
```

Then go to `/api`

