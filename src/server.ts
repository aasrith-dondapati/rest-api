// import express from 'express';
import * as express from 'express';
import { createConnection, Connection } from 'typeorm';
import { AppDataSource }from './data-source';
import {User} from './entity/User';

console.log(AppDataSource, '>><<')
const app = express();

createConnection( {
  type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "DAC143dac@",
    database: "postgres",
    synchronize: true,
    logging: false,
    entities: [User],
    migrations: [],
    subscribers: [],
})
  .then(() => {
    console.log('Connected to database');
  })
  .catch((error) => {
    console.log('Error connecting to database:', error);
  });

// const connection = createConnection({ type: 'postgres', 
//      url: 'localhost:5432/postgres' 
// })

app.get('/', (req, res) => {
  res.send('Hello, world!');
});

app.listen(3000, () => {
  console.log('Server is listening on port 8080');
});