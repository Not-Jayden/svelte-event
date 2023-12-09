// Custom event handler type for mouse events
type MouseEventHandler<T extends MouseEvent = MouseEvent> = (event: T) => void;

/** Only triggers handler if the left mouse button is clicked */
export function left<T extends MouseEvent, U extends HTMLElement>(handler: MouseEventHandler<T>): MouseEventHandler<T> {
	return function (this: U, event: T): void {
		if (event.button !== 0) {
			return;
		}

		handler.call(this, event);
	};
}

/** Only triggers handler if the middle mouse button is clicked */
export function middle<T extends MouseEvent, U extends HTMLElement>(
	handler: MouseEventHandler<T>,
): MouseEventHandler<T> {
	return function (this: U, event: T): void {
		if (event.button !== 1) {
			return;
		}

		handler.call(this, event);
	};
}

/** Only triggers handler if the right mouse button is clicked */
export function right<T extends MouseEvent, U extends HTMLElement>(
	handler: MouseEventHandler<T>,
): MouseEventHandler<T> {
	return function (this: U, event: T): void {
		if (event.button !== 2) {
			return;
		}

		handler.call(this, event);
	};
}
