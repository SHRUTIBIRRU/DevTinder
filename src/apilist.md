## ApiList

## AuthRouter

- Post /signup
- Post /login
- Post /forgot-pwd
- Post /logout

## UserRouter

- GET /profile/view
- PATCH /profile/edit
- PATCH /profile/password

# connectionRequestRouter

- POST /user/send/ignored/:userId
- POST /user/send/interested/:userId
- POST /request/review/accepted/:requestId
- POST /request/review/accepted/:requestId

# userRouter

- GET /user/connections
- GET /user/requests
- GET /user/feed //gets u the profile of other user

status- ignore, interested, accepted, rejected
