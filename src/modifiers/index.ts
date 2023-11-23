// Modifier descriptions courtesy of Svelte docs: https://svelte.dev/docs/element-directives#on-eventname

import type { Modifiers } from '../types';
import { objectToEntries } from '../utils/objectToEntries';
import { pipe } from '../utils/pipe';

type EventHandler<T extends Event = Event> = (event: T) => void;

/** Calls `event.preventDefault()` before running the handler */
export function preventDefault<T extends Event, U extends HTMLElement>(
	handler: EventHandler<T>,
): (this: U, event: T) => void {
	return function (this: U, event: T) {
		event.preventDefault();
		handler.call(this, event);
	};
}

/** Calls `event.stopPropagation()`, preventing the event reaching the next element */
export function stopPropagation<T extends Event, U extends HTMLElement>(
	handler: EventHandler<T>,
): (this: U, event: T) => void {
	return function (this: U, event: T): void {
		event.stopPropagation();
		handler.call(this, event);
	};
}

/** Calls `event.stopImmediatePropagation()`, preventing other listeners of the same event from being fired. */
export function stopImmediatePropagation<T extends Event, U extends HTMLElement>(
	handler: EventHandler<T>,
): (this: U, event: T) => void {
	return function (this: U, event: T): void {
		event.stopImmediatePropagation();
		handler.call(this, event);
	};
}

/** Only triggers handler if the `event.target` is the element itself */
export function self<T extends Event, U extends HTMLElement>(handler: EventHandler<T>): (this: U, event: T) => void {
	return function (this: U, event: T): void {
		if (event.target !== event.currentTarget) {
			return;
		}
		handler.call(this, event);
	};
}

/** Only trigger handler if event.isTrusted is true. I.e. if the event is triggered by a user action. */
export function trusted<T extends Event, U extends HTMLElement>(handler: EventHandler<T>): (this: U, event: T) => void {
	return function (this: U, event: T): void {
		if (!event.isTrusted) {
			return;
		}
		handler.call(this, event);
	};
}

/** Remove the handler after the first time it runs */
export function once<T extends Event, U extends HTMLElement>(handler: EventHandler<T>): (this: U, event: T) => void {
	let hasBeenCalled = false;

	return function (this: U, event: T): void {
		if (!hasBeenCalled) {
			hasBeenCalled = true;
			handler.call(this, event);
		}
	};
}

type WrappableModifiers = Omit<Modifiers, 'passive' | 'capture'>;
type WrappableModifierKey = keyof WrappableModifiers;

const modifierFunctionsByKey = {
	preventDefault,
	stopPropagation,
	stopImmediatePropagation,
	self,
	trusted,
	once,
} satisfies Record<string, (handler: EventHandler) => EventHandler>;


export function withModifiers<T extends Event, U extends HTMLElement>(
	handler: EventHandler<T>,
	modifiers: Modifiers,
): (this: U, event: T) => void {
	const enabledModifiers = objectToEntries(modifiers).filter(([key, value]) => value);
	const modifierFunctions = enabledModifiers.map(([key]) => modifierFunctionsByKey[key as WrappableModifierKey]);

	return pipe<EventHandler<T>>(handler, ...modifierFunctions);
}
