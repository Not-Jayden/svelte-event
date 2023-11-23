export function pipe<T>(value: T, ...fns: Array<(value: T) => T>): T {
	return fns.reduce((acc, fn) => fn(acc), value);
}
