# abcat 
Sample cat AB testing app

## Development

### backend

Required env variables:
- `MONGO_URL`
- `MONGO_DB_NAME`

`npm run dev`


### ui
Expects API to be running at `http://localhost:4200` (proxy Webpack/CRA config).

`npm start`


### Docker
On the first start `rs.initiate()` needs to be issued for Mongo to join replicaset (needed for ACID tx support).
