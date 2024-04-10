<script lang="ts">
	import { writeTextFile, type FileEntry, copyFile } from "@tauri-apps/api/fs"
	import { readDirAsync, removeFileAsync, renameFileAsync } from "./main"
	import { appDir, appFiles, baseDirectories } from "./store"
	import FolderIcon from "./lib/folder-icon.svelte"
	import { open } from "@tauri-apps/api/shell"
	import DeleteFile from "./lib/delete-file.svelte"
	import Rename from "./lib/rename.svelte"
	import { resolve } from "@tauri-apps/api/path"
	import Copy from "./lib/copy.svelte"

	let files: FileEntry[] = $appFiles
	let nameInput = ""
	let currentDirectory = ""
	let copiedFile = {}

	const filterByName = (name: string) => {
		if (name.length === 0) {
			files = $appFiles
			return
		}

		files = files.filter((file) =>
			file.name?.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
		)
	}
	const renameFileBox = async (name: any) => {
		const resultName = prompt("Renombra tu archivo:")
		if (!resultName) return

		await renameFileAsync(name, resultName)

		files = await readDirAsync({ dir: appDir.get().dir })
	}
	const createFile = async (/*fileName: string*/) => {
		const fileName = prompt("¿Cómo quieres llamar el archivo?")

		writeTextFile(`${appDir.get().dir}/${fileName}`, "")
		files = await readDirAsync({ dir: appDir.get().dir })

	}
	const deleteFile = async (name: any) => {
		const resultName = await confirm("¿Seguro que quieres eliminar este archivo?")
		if (!resultName) return

		await removeFileAsync(name)
		files = await readDirAsync({ dir: appDir.get().dir })
	}

	const pasteFile = async () => {
		if (!copiedFile) return

		const file = await resolve(copiedFile.path)

		await copyFile(file, `${appDir.get().dir}/${copiedFile.name}`)

		files = await readDirAsync({ dir: appDir.get().dir })

	}
	appDir.subscribe(async (val) => {
		files = await readDirAsync({ dir: val.dir })
		currentDirectory = val.dir
	})
	const directories = Object.keys(baseDirectories)
</script>

<main class="text-start min-h-[100vh] bg-zinc-900 text-white font-sans">
	<div class="p-[20px] flex flex-wrap gap-[20px]">
		<button on:click={async () => await open(appDir.get().dir)} class="flex gap-[5px] bg-slate-700 p-[8px] px-[16px] rounded-full">
			<FolderIcon />
			Open File Explorer
		</button>
		<button on:click={async () => await createFile()} class="flex gap-[5px] bg-slate-700 p-[8px] px-[16px] rounded-full">
			➕
			Crear archivo
		</button>
		<button on:click={async () => await pasteFile()} class="flex gap-[5px] bg-slate-700 p-[8px] px-[16px] rounded-full">
			<Copy />
			Pegar archivo
		</button>
	</div>
	<div class="p-[20px]">
		<form on:submit|preventDefault={() => filterByName(nameInput)} class="w-full">
			<input
				type="text"
				bind:value={currentDirectory}
				on:change={() => {console.log(currentDirectory)}}
				placeholder="Busca un archivo..."
				class=" bg-zinc-700 rounded-[3px] px-[6px] py-[6px] w-full outline-none"
			/>
		</form>
	</div>
	<div class="p-[20px] flex">
		<form on:submit|preventDefault={() => filterByName(nameInput)} class="w-full">
			<input
				type="text"
				bind:value={nameInput}
				placeholder="Busca un archivo..."
				class=" bg-zinc-700 rounded-[3px] px-[6px] py-[6px] w-full outline-none"
			/>
		</form>
	</div>
	<div class="flex gap-[20px] px-[20px]">
		{#each directories as directory}
			<button
				on:click={() =>
					appDir.set({
						dir: baseDirectories[directory].dir,
					})}>{directory}</button
			>
		{/each}
	</div>
	<div class="flex flex-col gap-[5px] p-[20px]">
		{#each files as file}
			<div class="p-[6px] hover:bg-zinc-500 rounded-[2px] flex justify-center items-center">
				<div class="w-full">
					{#if typeof file.children !== "undefined"}
						<button
							on:click={() =>
								appDir.set({
									dir: file.path,
								})}
							class="flex gap-[10px]"
						>
							<FolderIcon />
							{file.name}
						</button>
					{:else}
						<button on:dblclick={async () => await open(file.path)}>{file.name}</button>
					{/if}
				</div>
				<section class="flex gap-[20px]">
					<div>
						<button on:click={() => copiedFile = {path: file.path, name: file.name}}><Copy /></button>
					</div>
					<div>
						<button on:click={() => renameFileBox(file.name)}><Rename /></button>
					</div>
					<div>
						<button on:click={() => deleteFile(file.name)} class="text-red-600"><DeleteFile /></button>
					</div>
				</section>
			</div>
		{/each}
	</div>
</main>
