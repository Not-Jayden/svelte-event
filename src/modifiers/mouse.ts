import { objectToEntries } from '../utils/objectToEntries';

// Custom event handler type for mouse events
type MouseEventHandler<T extends MouseEvent = MouseEvent> = (event: T) => void;

type MouseOptions = {
	altKey?: boolean;
	ctrlKey?: boolean;
	metaKey?: boolean;
	shiftKey?: boolean;
	exact?: boolean;
};

function checkModifiers<T extends MouseEvent>(event: T, options?: MouseOptions): boolean {
	const { altKey = false, ctrlKey = false, metaKey = false, shiftKey = false, exact = false } = options ?? {};
	const modifiersToCheck = { altKey, ctrlKey, metaKey, shiftKey };

	for (const [modifierKey, modifierValue] of objectToEntries(modifiersToCheck)) {
		if (exact && modifierValue !== event[modifierKey]) {
			return false;
		}

		if (!exact && modifierValue && !event[modifierKey]) {
			return false;
		}
	}

	return true;
}

/** Only triggers handler if the left mouse button is clicked */
export function left<T extends MouseEvent, U extends HTMLElement>(
	handler: MouseEventHandler<T>,
	options?: MouseOptions,
): MouseEventHandler<T> {
	return function (this: U, event: T): void {
		if (event.button !== 0) {
			return;
		}
		if (!checkModifiers(event, options)) {
			return;
		}

		handler.call(this, event);
	};
}

/** Only triggers handler if the middle mouse button is clicked */
export function middle<T extends MouseEvent, U extends HTMLElement>(
	handler: MouseEventHandler<T>,
	options?: MouseOptions,
): MouseEventHandler<T> {
	return function (this: U, event: T): void {
		if (event.button !== 1) {
			return;
		}
		if (!checkModifiers(event, options)) {
			return;
		}

		handler.call(this, event);
	};
}

/** Only triggers handler if the right mouse button is clicked */
export function right<T extends MouseEvent, U extends HTMLElement>(
	handler: MouseEventHandler<T>,
	options?: MouseOptions,
): MouseEventHandler<T> {
	return function (this: U, event: T): void {
		if (event.button !== 2) {
			return;
		}
		if (!checkModifiers(event, options)) {
			return;
		}

		handler.call(this, event);
	};
}
