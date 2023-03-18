import { UserModel } from "@models";

import { UserService } from "@services";

import { omit } from "lodash";

describe("UserService", () => {
	let service;

	beforeAll(() => {
		service = new UserService();
	});

	beforeEach(async () => {
		await UserModel.sync({
			force: true,
		});
	});

	describe("#create", () => {
		describe("with valid username", () => {
			test("it should return the user and token", async () => {
				const userInfo = {
					name: "John Doe",
					username: "John1923",
					password: "12345678",
				};

				const userCreatedResponse = await service.create(userInfo);

				expect(userCreatedResponse).toMatchObject(
					omit(userInfo, ["password"])
				);
			});
		});

		describe("with username that exists", () => {
			test("it should return USER_EXISTS error", async () => {
				await UserModel.create({
					name: "John Doe",
					username: "user1234",
					password: "12345678",
				});

				const errorResponse = await service
					.create({
						name: "New User",
						username: "user1234",
						password: "123456",
					})
					.catch((r) => r);

				expect(errorResponse).toMatchInlineSnapshot(
					`[Error: USER_EXISTS]`
				);
			});
		});
	});
});
