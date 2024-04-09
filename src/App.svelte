<script lang="ts">
	import type { FileEntry } from "@tauri-apps/api/fs"
	import app, { readDirAsync, removeFileAsync, renameFileAsync } from "./main"
	import { appDir, appFiles, baseDirectories } from "./store"
	import FolderIcon from "./lib/folder-icon.svelte"
	import { open } from "@tauri-apps/api/shell"
	import { ask } from "@tauri-apps/api/dialog"

	let files: FileEntry[] = $appFiles
	let nameInput = ""
	let currentDirectory = ""

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
		console.log(files)
	}
	const deleteFile = (name: any) => {
		const resultName = confirm("Desea eliminar este archivo?")
		if (!resultName) return

		removeFileAsync(name)
	}
	appDir.subscribe(async (val) => {
		files = await readDirAsync({ dir: val.dir })
		currentDirectory = val.dir
	})
	const directories = Object.keys(baseDirectories)
</script>

<main class="text-start min-h-[100vh] bg-zinc-800 text-white font-sans">
	<div class="p-[20px]">
		<button on:click={async () => await open(appDir.get().dir)} class="flex gap-[5px]">
			<FolderIcon />
			Open File Explorer
		</button>
	</div>
	<div class="p-[20px]">
		<form on:submit|preventDefault={() => filterByName(nameInput)} class="w-full">
			<input
				type="text"
				bind:value={currentDirectory}
				placeholder="Busca un archivo..."
				class=" bg-zinc-600 rounded-[3px] px-[6px] py-[6px] w-full outline-none"
			/>
		</form>
	</div>
	<div class="p-[20px] flex">
		<form on:submit|preventDefault={() => filterByName(nameInput)} class="w-full">
			<input
				type="text"
				bind:value={nameInput}
				placeholder="Busca un archivo..."
				class=" bg-zinc-600 rounded-[3px] px-[6px] py-[6px] w-full outline-none"
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
			<div class="p-[5px] hover:bg-zinc-500 rounded-[2px] flex">
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
						<button on:click={() => renameFileBox(file.name)}>Renombrar</button>
					</div>
					<div>
						<button on:click={() => deleteFile(file.name)}>Delete</button>
					</div>
				</section>
			</div>
		{/each}
	</div>
</main>
