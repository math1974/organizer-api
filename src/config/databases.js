import fs from 'fs';
import Sequelize from 'sequelize';

export default class Databases {
    constructor() {
        this.models = {};

        this._instance = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: 'postgres',
			logging: false,
			query: {
				raw: true
			},
			define: {
				underscored: true
			}
        });
    }

    _authenticate() {
        return this._instance.authenticate()
            .then(() => {
				if (process.env.NODE_ENV !== 'test') {
					console.log('Database connected')
				}
			})
            .catch(error => {
				if (process.env.NODE_ENV !== 'test') {
					console.log('Database connection error: ', error.message)
				}
			})
    }


	_loadModels() {
		fs.readdirSync(`${__dirname}/../models`, { withFileTypes: true })
			.filter(entry => fs.statSync(`${__dirname}/../models/${entry.name}`).isFile())
			.map(entry => `${__dirname}/../models/${entry.name}`)
			.forEach(filePath => {
				const Model = require(filePath).default;

				if (!Model) {
					return;
				}

				const modelName = Model.name.toLowerCase();

				this.models[modelName] = Model.load(this._instance, Sequelize);
			});
	}

	_instantiateModels() {
		Object.values(this.models)
			.filter(model => typeof model.associate === 'function')
			.forEach(model => {
				model.models = this.models;
				model.sequelize = this._instance;
				model.associate(this.models);
			});
	}

    async connect() {
        await this._loadModels();
        await this._instantiateModels();

        return this._authenticate();
    }

    close() {
        return this._instance.close();
    }
}
