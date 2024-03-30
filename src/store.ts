import { BaseDirectory, type FileEntry } from "@tauri-apps/api/fs"
import { writable } from "svelte/store"

export const baseDirectories: BaseDirectories = {
	Home: { dir: "C:/" },
	Users: { dir: "C:/Users/" },
}

type BaseDirectories = {
	Home: {
		dir: string
	},
	Users: {
		dir: string
	}
}
export const appFiles = writable<FileEntry[]>([])
export const appDir = storeAppDir({ dir: baseDirectories.Home.dir })

export function storeAppDir(value: any) {
	let originalWritable = writable(value)

	function set(newValue: any) {
		return originalWritable.set((value = newValue))
	}
	function update(fn: any) {
		originalWritable.update((oldValue) => (value = fn(oldValue)))
	}
	function get() {
		return value
	}
	return { set, update, subscribe: originalWritable.subscribe, get }
}
