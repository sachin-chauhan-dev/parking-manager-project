# Parking Manager

> Parking manager using persistent db sqlite and authorization using Jwt

## Setup steps

#### 1. Update the required environment variables in ./env-variables.sh
```sh
export PORT='8081'
export BY_PASS_AUTH=false
export PARKING_MANAGER_USERNAME='admin'
export PARKING_MANAGER_PASSWORD='admin'
#Optional
export DB_NAME='parking-manager'
export DB_USER='username'
export DB_PASS='password'
export DB_HOST='localhost'
```
> BY_PASS_AUTH should be true in case you don't want to use jwt token for authorization 

```sh
$ git clone git@github.com:sachin-chauhan-dev/parking-manager-project.git
$ cd parking-manager-project
$ npm install
$ source env-variables.sh 
$ npm run create-sqlite-db
$ npm start
```

### 2. To reset DB
```sh
$ npm run drop-sqlite-db && npm run create-sqlite-db
```

### 3. Available Apis
 
Public Apis
- 'POST /admin/login'  data: {username: String, password: String}
- 'POST /park'         data: {vehnumber: String}
- 'POST /unpark'       data: {vehnumber: String}


Private Apis
- 'GET /parkingmanager/parkingdetails'  data:{}
- 'GET /parkingmanager/parkingstatus'   data:{}
- 'GET /parkingmanager/parkingstats'    data:{}
- 'POST /parkingmanager/createparking'  data:{lotsize: Number}
- 'POST /parkingmanager/maintainancestatus' data:{slotidlist: Array, status:true|false}

> **Note**: if BY_PASS_AUTH env variable is false,
> than you also have to pass authentication token received in admin/login api.
> In 'Authorization' header as 'Bearer {{token}}'

### 4. To Test apis
> Api file `parkingManager.postman_collection.json`
> Environment file `dev.postman_environment.json`

Import the Post man collection json file and environment file to test.
> **Note**: Set your `token` environment variable with the token received from admin/login api.
