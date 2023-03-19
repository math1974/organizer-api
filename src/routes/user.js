import BaseRoutes from '@routes/base';
import UserSchema from '@schemas/user';
import { UserController } from '@controllers';

import SchemaValidator from '@utils/schema-validator'

export default class UserRoutes extends BaseRoutes {
	constructor() {
        super();

		this.userController = new UserController();
    }

    setup() {
        this.router.post('/', SchemaValidator.validate(UserSchema.create), this.userController.create);
        this.router.put('/', this.AuthMiddleware.isAuthorized, SchemaValidator.validate(UserSchema.update), this.userController.update);

        return this.router;
    }
}
