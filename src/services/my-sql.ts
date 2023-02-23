import mysql from 'mysql';
import config from '../config';

const connection = mysql.createConnection(config.db);

export const connectMySql = (callback: VoidFunction) => {
  connection.connect((connectionError) => {
    if (connectionError) throw new Error(connectionError.message);

    callback();
    connection.end();
  });
};

export default connection;
