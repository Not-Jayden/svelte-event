export type Modifiers = {
	preventDefault?: boolean;
	stopPropagation?: boolean;
	stopImmediatePropagation?: boolean;
	passive?: boolean;
	capture?: boolean;
	once?: boolean;
	self?: boolean;
	trusted?: boolean;
};

export type EventHandler<T extends Event = Event> = (event: T) => void;
