import "./styles.css"
import App from "./App.svelte"
import { readDir, BaseDirectory, renameFile } from "@tauri-apps/api/fs"
import { appDir, appFiles } from "./store"

const readDirectory = await readDirAsync({dir: "", baseDir: appDir.get().baseDir})
appFiles.set(readDirectory)

export async function readDirAsync({ dir, baseDir }: { dir: string; baseDir: BaseDirectory }) {
  if (baseDir) return readDir(dir || "", { dir: baseDir })

  
	return readDir(dir)
}
export const renameFileAsync = async (initial: string, result: string) => {
	await renameFile(initial, result, { dir: appDir.get() }).catch((err) => {
		console.error(err)
	})
}

const app = new App({
	target: document.getElementById("app")!,
})

export default app
