import type { EventHandler } from './types';

/** Composes multiple event handlers into a single handler
 * @example
 * ```ts
 * const handler = compose(
 * 	(event) => console.log('first handler', event),
 * 	(event) => console.log('second handler', event),
 * );
 * ```
 */
export function compose<const T extends Event>(...handlers: EventHandler<T>[]): EventHandler<T> {
	return function (this: HTMLElement, event: T): void {
		for (const handler of handlers) {
			handler.call(this, event);
		}
	};
}
