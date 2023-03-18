import { UserModel } from '@models';

import { Op } from 'sequelize';

import { omit } from 'lodash';

export default class UserService {
	async create(data) {
		const userExists = await UserModel.count({
			where: {
				[Op.or]: [{
					username: data.username
				}, {
					email: data.username
				}],
				is_deleted: false
			}
		});

		if (userExists) {
			throw new Error('USER_EXISTS');
		}

		const user = await UserModel.create(data);

		return omit(user.toJSON(), ['password'])
	}
}
