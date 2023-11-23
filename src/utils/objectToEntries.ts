// a typed version of object.entries
export function objectToEntries<T extends object>(obj: T): Array<[keyof T, T[keyof T]]> {
	return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}
