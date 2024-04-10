import App from "./App.svelte"
import { readDir, renameFile, removeFile } from "@tauri-apps/api/fs"
import { appDir, appFiles } from "./store"
import "./styles.css"
import { resolve } from "@tauri-apps/api/path"

const toplevel = async () => {
	const readDirectory = await readDirAsync({ dir: "D:/" })
	appFiles.set(readDirectory)
}
toplevel()

const app = new App({
	target: document.getElementById("app")!,
})

export async function readDirAsync({ dir }: { dir: string }) {
	return readDir(dir)
}
export async function renameFileAsync(initial: string, result: string) {
	const currentDir = appDir.get().dir
	const file = await resolve(`${currentDir}/${initial}`)
	await renameFile(file, `${currentDir}/${result}`).catch((err) => {
		console.error(err)
	})
}
export async function removeFileAsync(fileName: string) {
	const currentDir = appDir.get().dir
	const file = await resolve(`${currentDir}/${fileName}`)

	await removeFile(file).catch((err) => {
		console.error(err)
	})
}

export default app
