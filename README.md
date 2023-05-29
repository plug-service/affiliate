# Notification Service

Microservice for notification


## Notification channels

1. In app notification
2. Via Email
3. Via SMS


## For dev

```
yarn start:dev
```

Then go to `/api`


## Configuration

### Setup sending gmail using `google-apis`

The personal account is not allowed to send emails as a bot. We need to create a Google workspace, and use the feature `delegating authority`
Just follow Google instructions to create a new Google Workspace, and we need the admin role of Google Workspace to set up.

1. Create a google cloud project
2. Enable Gmail API then create a `service credential`. Add or generate a key, then save the key file as `google-service-account-key.json` in './secret'
3. Delegating domain-wide authority to the service account
Instruction: https://developers.google.com/identity/protocols/oauth2/service-account#delegatingauthority
Note: `Client ID` is supplied in the key file above and the `OAuth scopes` are:
- 'https://mail.google.com/', 
- 'https://www.googleapis.com/auth/gmail.modify',
- 'https://www.googleapis.com/auth/gmail.compose',
- 'https://www.googleapis.com/auth/gmail.send',