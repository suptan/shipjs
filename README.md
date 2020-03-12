# SHIPJS
Based on the game Battleship. Game rules and explanation at https://en.wikipedia.org/wiki/Battleship_(game)

## Table of contents
[Project structure](#project-structure)

[Installation](#installation)

[Test](#test)

[Usage](#usage)

[Configuration](#configuration)

[Technologies used](#technologies-used)


## Project structure
TBD
````
src/
|- constants
|- controllers _______________________________ # Available endpoints
  |- latest __________________________________ # API versioning
|- domains
|- exceptions
|- middlewares
|- migrations
|- models ____________________________________ # Database models
|- seeders
|- serializers
|- services __________________________________ # Business logic goes here
|- utils
````

## Installation
1) Ensure that [Docker](https://docs.docker.com/install/) and [NodeJS](https://nodejs.org/en/download/) are running on your machine.

2) Use terminal and in your project path type `npm i` to install modules

3) `docker-compose up shipjs` to build the image and start api via http://localhost:9008

4) Type `npx sequelize-cli db:seed:all` to seed data to database

## Test

* Unit testing will watch all your changes in the test files as well as create coverage folder for you.
`docker-compose up test`

## Usage
1) start the API by `docker-compose up shipjs` which run on http://localhost:9008

2) Access Swagger on http://localhost:9008/api/latest/docs/ or use API at http://localhost:9008/api/latest

3) Create new game session
    * by using POST /api/latest/gameplay in Swagger
    * or using http://localhost:9008/api/latest/gameplay
    * We have map level (levelId: 1) and players (id: 1, id: 2) available for demo
    * get attacker and defender id via response

4) Place a ship for defender
    * by using POST /api/latest/player-fleet in Swagger
    * or using http://localhost:9008/api/latest/player-fleet
    * We have ship available for demo
        * Battleship `shipId: 1`
        * Cruiser `shipId: 2`
        * Destroyer `shipId: 3`
        * Submarine `shipId: 4`
        * Retrieve all ships data via GET /api/latest/ship in Swagger or http://localhost:9008/api/latest/ship
    * The coordinations, for place a ship, are range from 0 <= N < 10

5) Once ready to play, attacker can start the game
    * by using POST /api/latest/player-map in Swagger
    * or using http://localhost:9008/api/latest/player-map
    * The coordinations, for attack, are range from 0 <= N < 10
    * Try to hit the defender fleets as fast as you can

6) If attacker can sank all defender fleets then game will end

## Configuration
TBD

### Technologies used
TBD
