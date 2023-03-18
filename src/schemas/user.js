import { z } from 'zod';
import * as DateUtils from '@utils/date';

const schemas = {
	create: {
		body: z.object({
			name: z.string(),
			email: z.string().email(),
			username: z.string(),
            password: z.string(),
			born: z.string().refine(value => DateUtils.isValid(value, 'YYYY-MM-DD', true)),
			profession: z.string().optional()
		})
	}
};

export default {
	create: schemas.create
}
