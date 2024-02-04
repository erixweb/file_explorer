import { BaseDirectory, type FileEntry } from "@tauri-apps/api/fs"
import { writable } from "svelte/store"

export const appFiles = writable<FileEntry[]>([])
export const appDir = storeAppDir({ baseDir: BaseDirectory.Home })
export const baseDirectories = {
	Home: { dir: "C:/", baseDir: ""},
	Desktop: { baseDir: BaseDirectory.Desktop },
	Downloads: { baseDir: BaseDirectory.Download },
	Videos: { baseDir: BaseDirectory.Video },
	LocalData: { baseDir: BaseDirectory.LocalData },
}
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
