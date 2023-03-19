import { UserModel } from '@models';

import { Op } from 'sequelize';

export default class UserService {
	async create(data) {
		const userExists = await UserModel.count({
			where: {
				[Op.or]: [{
					username: data.username
				}, {
					email: data.username
				}]
			}
		});

		if (userExists) {
			throw new Error('USER_EXISTS');
		}

		const user = await UserModel.create(data);

		return this.find({ id: user.id });
	}

	find(filter) {
		return UserModel.findOne({
			where: {
				id: filter.id
			},
			useMaster: true
		});
	}

	async update({ changes, filter }) {
		const userExists = await UserModel.count({
			where: {
				id: filter.logged_user_id,
				is_deleted: false
			}
		});

		if (!userExists) {
			throw new Error('USER_NOT_FOUND');
		}

		await UserModel.update(changes, {
			where: {
				id: filter.logged_user_id
			}
		});

		return this.find({ id: filter.logged_user_id });
	}
}
