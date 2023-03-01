import mysql from 'mysql2';
import config from '../config';

const MySql = mysql.createConnection(config.db);

export const connectMySql = (callback: VoidFunction) => {
  MySql.connect((connectionError) => {
    if (connectionError) throw new Error(connectionError.message);

    callback();
    MySql.end();
  });
};

export default MySql;
