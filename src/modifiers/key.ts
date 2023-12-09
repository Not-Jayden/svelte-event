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
		modifiers?: {
			/** Whether the Alt key needs to be pressed. */
			altKey?: boolean;
			/** Whether the Ctrl key needs to be pressed. */
			ctrlKey?: boolean;
			/** Whether the Meta key (Command key on Mac, Windows key on Windows) needs to be pressed. */
			metaKey?: boolean;
			/** Whether the Shift key needs to be pressed. */
			shiftKey?: boolean;
		};
		/** Whether the exact modifiers need to be pressed (i.e. no other modifiers can be pressed). */
		exact?: boolean;
	},
): KeyboardEventHandler<T> {
	return function (this: U, event: T): void {
		if (event.key !== key) {
			return;
		}

		// First check if the modifiers are correct, unless the exact option is set
		// otherwise if the exact option is set perform a check that the exact modifier keys are pressed (i.e. no other keys are pressed)

		const { modifiers = {}, exact = false } = options ?? {};
		const modifiersToCheck = exact
			? { altKey: false, ctrlKey: false, metaKey: false, shiftKey: false, ...modifiers }
			: modifiers;

		// Check if the modifiers are correct
		for (const [modifierKey, modifierValue] of objectToEntries(modifiersToCheck)) {
			if (typeof modifierValue !== 'undefined' && event[modifierKey] !== modifierValue) {
				return;
			}
		}

		handler.call(this, event);
	};
}
