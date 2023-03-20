import dotenv from 'dotenv';
import Database from '@config/database'
import server from '../app';

const resetTable = model => {
	return model.sync({
		force: true
	});
}

dotenv.config({ path: `${__dirname}/../../.env.${process.env.NODE_ENV}` });

const databaseModule = new Database();

if (Object.keys(databaseModule.models).length === 0) {
	databaseModule.connect();
}

export {
	server,
	resetTable
}
