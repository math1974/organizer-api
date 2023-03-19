const buildReq = (overrides = {}) => {
	return {
		body: {},
		params: {},
		headers: {},
		...overrides
	};
}

const buildRes = (overrides = {}) => {
	const res = {
		json: jest.fn(() => res).mockName('json'),
		status: jest.fn(() => res).mockName('status'),
		...overrides,
	};

	return res;
};

const buildNext = impl => {
	return jest.fn(impl).mockName('next')
}

const buildError = error => {
	return error;
}

export default {
	buildReq,
	buildRes,
	buildNext,
	buildError
}
