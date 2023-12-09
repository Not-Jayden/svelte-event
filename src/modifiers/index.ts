// Modifier descriptions courtesy of Svelte docs: https://svelte.dev/docs/element-directives#on-eventname

import type { EventHandler, Modifiers } from '../types';
import { objectToEntries } from '../utils/objectToEntries.js';
import { pipe } from '../utils/pipe.js';

/** Calls `event.preventDefault()` before running the handler */
export function preventDefault<T extends Event, U extends HTMLElement>(handler: EventHandler<T>): EventHandler<T> {
	return function (this: U, event: T) {
		event.preventDefault();
		handler.call(this, event);
	};
}

/** Calls `event.stopPropagation()`, preventing the event reaching the next element */
export function stopPropagation<T extends Event, U extends HTMLElement>(handler: EventHandler<T>): EventHandler<T> {
	return function (this: U, event: T): void {
		event.stopPropagation();
		handler.call(this, event);
	};
}

/** Calls `event.stopImmediatePropagation()`, preventing other listeners of the same event from being fired. */
export function stopImmediatePropagation<T extends Event, U extends HTMLElement>(
	handler: EventHandler<T>,
): EventHandler<T> {
	return function (this: U, event: T): void {
		event.stopImmediatePropagation();
		handler.call(this, event);
	};
}

/** Only triggers handler if the `event.target` is the element itself */
export function self<T extends Event, U extends HTMLElement>(handler: EventHandler<T>): EventHandler<T> {
	return function (this: U, event: T): void {
		if (event.target !== event.currentTarget) {
			return;
		}
		handler.call(this, event);
	};
}

/** Only trigger handler if event.isTrusted is true. I.e. if the event is triggered by a user action. */
export function trusted<T extends Event, U extends HTMLElement>(handler: EventHandler<T>): EventHandler<T> {
	return function (this: U, event: T): void {
		if (!event.isTrusted) {
			return;
		}
		handler.call(this, event);
	};
}

/** Remove the handler after the first time it runs */
export function once<T extends Event, U extends HTMLElement>(handler: EventHandler<T>): EventHandler<T> {
	let hasBeenCalled = false;

	return function (this: U, event: T): void {
		if (hasBeenCalled) {
			return;
		}

		handler.call(this, event);
		hasBeenCalled = true;
	};
}

export type WrappableModifiers = Omit<Modifiers, 'passive' | 'capture'>;
type WrappableModifierKey = keyof WrappableModifiers;

const modifierFunctionsByKey = {
	preventDefault,
	stopPropagation,
	stopImmediatePropagation,
	self,
	trusted,
	once,
} satisfies Record<string, (handler: EventHandler) => EventHandler>;

/** Wraps the handler with the modifiers specified in the second argument */
export function withModifiers<T extends Event>(
	handler: EventHandler<T>,
	modifiers: WrappableModifiers,
): (event: T) => void {
	const enabledModifiers = objectToEntries(modifiers).filter(([key, value]) => value);
	const modifierFunctions = enabledModifiers.map(([key]) => modifierFunctionsByKey[key]);

	return pipe<EventHandler<T>>(handler, ...modifierFunctions);
}
