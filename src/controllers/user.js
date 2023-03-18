import { UserService } from '@services';

import BaseController from './base';

export default class UserController extends BaseController {
	constructor() {
		super();

		this.userService = new UserService();
	}

	async create(req, res) {
		try {
			const response = await this.userService.create(req.data);

			this.sendSuccess({
				data: response,
				res
			});
		} catch (error) {
			this.sendError({ error, res });
		}
	}
}
