import faker from 'faker'

const getUsername = faker.internet.userName
const getEmail = faker.internet.email;
const getId = faker.datatype.uuid
const getSynopsis = faker.lorem.paragraph
const getNotes = faker.lorem.paragraph

function buildUser(data) {
  return {
    username: getUsername(),
	email: getEmail(),
    ...data
  }
}

function buildReq({user = buildUser(), ...overrides} = {}) {
  const req = {user, body: {}, params: {}, ...overrides}
  return req
}

function buildRes(overrides = {}) {
  const res = {
    json: jest.fn(() => res).mockName('json'),
    status: jest.fn(() => res).mockName('status'),
    ...overrides,
  }
  return res
}

function buildNext(impl) {
  return jest.fn(impl).mockName('next')
}

function buildError(error) {
  return error;
}

export {
  buildReq,
  buildRes,
  buildNext,
  buildError,
  buildUser,
  buildListItem,
  buildBook,
  token,
  loginForm,
  getPassword as password,
  getUsername as username,
  getId as id,
  getSynopsis as synopsis,
  getNotes as notes,
}
