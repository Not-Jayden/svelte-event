import { event } from './action.js';

import {
	once,
	preventDefault,
	self,
	stopImmediatePropagation,
	stopPropagation,
	trusted,
	withModifiers,
} from './modifiers/index.js';
import { compose } from './compose.js';

export {
	event,
	once,
	preventDefault,
	self,
	stopImmediatePropagation,
	stopPropagation,
	trusted,
	withModifiers,
	compose,
};
