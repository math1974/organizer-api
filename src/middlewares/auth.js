import { AuthUtils } from "@utils";

export default class AuthMiddleware {
	static isAuthorized(req, res, next) {
		const token = AuthUtils.getBearerToken(req);

		next();
	}
}
