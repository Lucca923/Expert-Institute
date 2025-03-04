# Expert-Institute
Take home for Expert Institute.
As a Node.js Project this can be run using after installing the dependencies using the npm run dev command (see package.json)

While running the endpoints are as follows:
GET /assets -> returns the assets in the api
GET /assets/:id -> returns the asset in id
POST /signup -> creates a user account and returns token
GET /login -> if password is correct, returns token
for the wallet apis the token needs to be given in the header as authorization (also how it identifies the user)
GET /wallet -> gets the user's wallet
POST /wallet/add -> adds an asset to the wallet/increases amount of asset
PUT /wallet/remove -> removes assets from the account (subtracts)
GET /wallet/value -> gets the total value of the wallet
GET /wallet/change -> gets the net gain/loss of the wallet

Note that I used a json for the 'database' this is due to time constraints as in a database (most likely an SQL one for consistency) would work.

