
# WayFarer API
> WayFarer is a public bus transportation booking server.

[![Build Status](https://travis-ci.org/dinorhythms/WayFarer.svg?branch=develop)](https://travis-ci.org/dinorhythms/WayFarer)
[![Coverage Status](https://coveralls.io/repos/github/dinorhythms/WayFarer/badge.svg?branch=develop)](https://coveralls.io/github/dinorhythms/WayFarer?branch=develop)

This is an api backend for public bus transportation booking. It is created to give free and open access to the public to have a good and well managed transport system. The backend server is persist with a postgreSQL database.
The endpoints are to be secured with JSON Web Token (JWT).

[Documentation](https://dinorhythms-wayfarer.herokuapp.com)_

Here's are the available features:
* User can sign up.
* User can sign in.
* Admin can create a trip.
* Both Admin and Users can see all trips.
* Users can book a seat on a trip.
* View all bookings. An Admin can see all bookings, while user can see all of his/her
bookings.
* Users can delete their booking.
* Admin can cancel a trip.
* User can get and filter trips using trip destination.
* User can get and filter trips using trip origin.
* User can change seats after booking.


The API endpoints respond with a JSON object specifying the HTTP status code, and either a data property (on success) or an error property (on failure). When present, the data property is always an object or an array .

A list of commonly used resources that I find helpful are listed in the acknowledgements.

### Built With
listed below are major frameworks that i used to build the project. Add-ons/plugins are in the acknowledgements section.
* [Node](https://nodejs.org/en/)
* [Expressjs](https://expressjs.com)
* [jsonwebtoken](https://jwt.io)
* [PostgreSQL](https://www.postgresql.org)

## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

You will need to install some necessary tools before you can use this project.
* npm
```sh
npm install npm@latest -g
```
* postgresql
```sh
https://www.postgresql.org/download
```

### Installation

1. If you dont want local databse, you can get a free plan postgresql server at [https://elephantsql.com](https://elephantsql.com)
2. Clone the repo
```sh
git clone https://github.com/dinorhythms/WayFarer.git
```
3. Install NPM packages
```sh
npm install
```
4. create .env in the root folder then add DB_URL & TOKEN_SECRET `.env`
```JS
DB_URL = 'ENTER YOUR DB CONNECT STRING FROM ELEPHANTSQL.COM';
```
```JS
TOKEN_SECRET = 'ENTER YOUR SECRET FOR JWT TOKEN';
```

## Usage

* Signup
```sh
POST /api/v1/auth/signup
```
* Signin
```sh
POST /api/v1/auth/signin
```

_For more examples, please refer to the [Documentation](https://dinorhythms-wayfarer.herokuapp.com)_

## Roadmap

See the [open issues](https://github.com/dinorhythms/WayFarer/issues) for a list of proposed features (and known issues).

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

Please make sure to update tests as appropriate.

## License

Distributed under the MIT License. See `LICENSE` for more information.


## Contact

Oladehinde Kazeem - [@dinorhythms](https://twitter.com/dinorhythms) - larrysnet2001@gmail.com.com

Project Link: [https://github.com/dinorhythms/WayFarer](https://github.com/dinorhythms/WayFarer)



## Acknowledgements

* [Babel](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [bcryptjs](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [pg](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [mocha](https://www.webpagefx.com/tools/emoji-cheat-sheet)
* [eslint](https://www.webpagefx.com/tools/emoji-cheat-sheet)