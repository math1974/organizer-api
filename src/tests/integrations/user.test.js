import HttpStatus from "http-status";
import app from "@test-utils/server";
import supertest from "supertest";
import { UserModel } from "models";

describe("UserController", () => {
	beforeEach(async () => {
		await UserModel.sync({
			force: true
		});
	});

	describe("#create", () => {
		test("with invalid data", async () => {
			const { body } = await supertest(app)
				.post("/users")
				.expect(HttpStatus.BAD_REQUEST);

			expect(body.message).toMatchInlineSnapshot(`"INVALID_SCHEMA"`);
		});

		test("with valid data", async () => {
			const userInfo = {
				name: "test",
				username: "test",
				password: "12345678",
				born: "2022-07-09",
				email: "test@example.com",
			};

			const { body: createUserResponse } = await supertest(app)
				.post("/users")
				.send(userInfo)
				.expect(HttpStatus.OK);

			expect(createUserResponse.data).toHaveProperty("id");

			const { body: loginWithEmailResponse } = await supertest(app)
				.post("/auth/login")
				.send({
					username: userInfo.email,
					password: userInfo.password,
				})
				.expect(HttpStatus.OK);

			expect(loginWithEmailResponse.data.user).toHaveProperty(
				"id",
				createUserResponse.data.id
			);
			expect(loginWithEmailResponse.data.token).not.toBeNull();

			const { body: loginWithUsername } = await supertest(app)
				.post("/auth/login")
				.send({
					username: userInfo.username,
					password: userInfo.password,
				})
				.expect(HttpStatus.OK);

			expect(loginWithUsername.data.user).toHaveProperty(
				"id",
				createUserResponse.data.id
			);
			expect(loginWithUsername.data.token).not.toBeNull();
		});

		test("with username that exists", async () => {
			const userInfo = {
				name: "test",
				username: "test",
				password: "12345678",
				born: "2022-07-09",
				email: "test@example.com",
			};

			await supertest(app)
				.post("/users")
				.send(userInfo)
				.expect(HttpStatus.OK);

			const { body } = await supertest(app)
				.post("/users")
				.send(userInfo)
				.expect(HttpStatus.INTERNAL_SERVER_ERROR);

			expect(body.message).toMatchInlineSnapshot(`"USER_EXISTS"`);
		});
	});
});
