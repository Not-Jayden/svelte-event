import type { Modifiers } from './types';

import { objectToEntries } from './utils/objectToEntries';

type EventType = keyof HTMLElementEventMap;
type CustomEventType = string & {};
type BaseEventObjectParams = {
	modifiers?: Modifiers;
};

type EventHandler<T extends EventType | CustomEventType> = (
	event: T extends EventType ? HTMLElementEventMap[T] : Event,
) => void;

type EventObjectParams<T extends EventType | CustomEventType> = BaseEventObjectParams &
	(
		| {
				handler: EventHandler<T>;
				handlers?: never;
		  }
		| {
				handlers: Array<EventHandler<T>>;
				handler?: never;
		  }
		| {
				handler?: never;
				handlers?: never;
				modifiers: Modifiers;
		  }
	);

type EventParams<T extends EventType | CustomEventType> =
	| ((e: T extends EventType ? HTMLElementEventMap[T] : Event) => void)
	| EventObjectParams<T>;

function extractHandlersAndModifiers<T extends EventType | CustomEventType>(
	eventParam: EventParams<T>,
): { handlers: Array<EventListener>; modifiers: Modifiers | undefined } {
	if (typeof eventParam === 'function') {
		return {
			handlers: [eventParam as EventListener],
			modifiers: undefined,
		};
	}

	if ('handler' in eventParam && eventParam.handler) {
		return {
			handlers: [eventParam.handler as EventListener],
			modifiers: eventParam.modifiers,
		};
	}

	if ('handlers' in eventParam && eventParam.handlers) {
		return {
			handlers: eventParam.handlers as Array<EventListener>,
			modifiers: eventParam.modifiers,
		};
	}

	// Handle the case for only modifiers
	if ('modifiers' in eventParam && eventParam.modifiers) {
		return {
			handlers: [(e: Event) => {}], // need a handler to apply the modifiers
			modifiers: eventParam.modifiers,
		};
	}

	return {
		handlers: [],
		modifiers: undefined,
	};
}

function applyModifiers(node: HTMLElement, e: Event, modifiers?: Modifiers) {
	if (!modifiers) {
		return;
	}

	if (modifiers.preventDefault) {
		e.preventDefault();
	}

	if (modifiers.stopPropagation) {
		e.stopPropagation();
	}

	if (modifiers.stopImmediatePropagation) {
		e.stopImmediatePropagation();
	}

	if (modifiers.self && e.target !== node) {
		return;
	}

	if (modifiers.trusted && !e.isTrusted) {
		return;
	}
}

/**
 * `event` is a Svelte action that can be used to attach event listeners to DOM elements with support for various modifiers.
 * This action simplifies adding event listeners with additional control over event behavior such as propagation, default actions, and phases.
 *
 * @param node - The HTMLElement to which the event listeners will be attached.
 * @param params - An object where keys are event types and values are event parameters. The parameters can be either a function (event handler) or an object providing more detailed configuration.
 *
 * The detailed configuration object can include:
 * - `handler`: A function to be called when the event occurs. Only one handler can be specified.
 * - `handlers`: An array of functions to be called when the event occurs. Multiple handlers can be specified.
 * - `modifiers`: An object containing modifier flags that alter the behavior of the event:
 *    - `preventDefault`: If `true`, prevents the default action of the event.
 *    - `stopPropagation`: If `true`, stops the propagation of the event in the bubbling phase.
 *    - `stopImmediatePropagation`: If `true`, prevents other listeners of the same event from being called.
 *    - `self`: If `true`, ensures the event handler is invoked only when the event originated from the node itself, not from its children.
 *    - `trusted`: If `true`, the handler will only be invoked for events that are dispatched by the user agent, not by script.
 *    - `passive`: If `true`, indicates the event listener will not call `preventDefault()`. Useful for touch and wheel events to improve scrolling performance.
 *    - `capture`: If `true`, the event handler is executed during the capture phase instead of the bubbling phase.
 *
 * @returns An object with a `destroy` function that can be called to remove the attached event listeners.
 *
 * @example
 * ```svelte
 * // Using a single handler
 * <div use:event={{ click: handleClick }}></div>
 *
 * // Using multiple handlers for the same event
 * <div use:event={{ click: { handlers: [handleClick1, handleClick2] }}}></div>
 *
 * // Using modifiers
 * <div use:event={{ click: { handler: handleClick, modifiers: { preventDefault: true } }}}></div>
 *
 * // Using the `passive` modifier for performance optimization
 * <div use:event={{ wheel: { modifiers: { passive: true } }}}></div>
 *
 * // Attaching an event listener in the capture phase
 * <div use:event={{ click: { modifiers: { capture: true } }}}></div>
 * ```
 */
export function event<T extends EventType | CustomEventType>(
	node: HTMLElement,
	params: { [K in T]: EventParams<K> },
): { destroy: () => void } {
	// Attach the event listeners
	const eventListeners: Array<{ type: string; listener: EventListener }> = [];
	const paramEntries = objectToEntries(params);

	for (const [eventType, eventParam] of paramEntries) {
		const { handlers, modifiers } = extractHandlersAndModifiers(eventParam);

		for (const handler of handlers) {
			const wrappedHandler: EventListener = (e: Event) => {
				applyModifiers(node, e, modifiers);

				handler(e as any); // Cast to any to satisfy the compiler
			};

			const options = {
				passive: modifiers?.passive,
				capture: modifiers?.capture,
				once: modifiers?.once,
			};

			node.addEventListener(eventType, wrappedHandler, options);

			eventListeners.push({
				type: eventType,
				listener: wrappedHandler,
			});
		}
	}

	// Return the destroy function to remove the event listeners
	return {
		destroy() {
			for (const { type, listener } of eventListeners) {
				node.removeEventListener(type, listener);
			}
		},
	};
}
