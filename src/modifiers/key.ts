import { objectToEntries } from '../utils/objectToEntries';

// Custom event handler type for keyboard events
type KeyboardEventHandler<T extends KeyboardEvent = KeyboardEvent> = (event: T) => void;

/**
 * Creates a modifier that only triggers the handler if a specific key is pressed.
 */
export function key<T extends KeyboardEvent, U extends HTMLElement>(
	/** The original event handler. */
	handler: KeyboardEventHandler<T>,
	/** The key to check for (e.g., 'Enter', 'Shift', 'a'). Must be a valid KeyboardEvent.key value.
	 * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values
	 */
	key: string,
	options?: {
		/** The modifiers that need to be pressed for the handler to be triggered. */
		/** Whether the Alt key needs to be pressed. */
		altKey?: boolean;
		/** Whether the Ctrl key needs to be pressed. */
		ctrlKey?: boolean;
		/** Whether the Meta key (Command key on Mac, Windows key on Windows) needs to be pressed. */
		metaKey?: boolean;
		/** Whether the Shift key needs to be pressed. */
		shiftKey?: boolean;
		/** Whether the exact modifiers need to be pressed (i.e. no other modifiers can be pressed). */
		exact?: boolean;
	},
): KeyboardEventHandler<T> {
	return function (this: U, event: T): void {
		if (event.key !== key) {
			return;
		}

		const { altKey = false, ctrlKey = false, metaKey = false, shiftKey = false, exact = false } = options ?? {};
		const modifiersToCheck = { altKey, ctrlKey, metaKey, shiftKey };

		for (const [modifierKey, modifierValue] of objectToEntries(modifiersToCheck)) {
			if (exact && modifierValue !== event[modifierKey]) {
				return;
			}

			if (!exact && modifierValue && !event[modifierKey]) {
				return;
			}
		}

		handler.call(this, event);
	};
}
