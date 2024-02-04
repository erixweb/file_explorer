import App from "./App.svelte"
import { readDir, renameFile } from "@tauri-apps/api/fs"
import { appDir, appFiles } from "./store"
import "./styles.css"



const readDirectory = await readDirAsync({ dir: "C:/" })
appFiles.set(readDirectory)

const app = new App({
	target: document.getElementById("app")!,
})

export async function readDirAsync({ dir }: { dir: string }) {
	return readDir(dir)
}
export async function renameFileAsync (initial: string, result: string) {
	await renameFile(initial, result, { dir: appDir.get() }).catch((err) => {
		console.error(err)
	})
}

export default app