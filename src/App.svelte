<script lang="ts">
	import type { FileEntry } from "@tauri-apps/api/fs"
	import { readDirAsync, renameFileAsync } from "./main"
	import { appDir, appFiles, baseDirectories } from "./store"

	let files: FileEntry[] = $appFiles
	let nameInput = ""

	const filterByName = (name: string) => {
		if (name.length === 0) {
			files = $appFiles
			return
		}

		files = files.filter((file) =>
			file.name?.toLocaleLowerCase().includes(name.toLocaleLowerCase()),
		)
	}
	const renameFileBox = (name: string) => {
		const resultName = prompt("Renombra tu archivo:")
		if (!resultName) return

		renameFileAsync(name, resultName)
	}
	appDir.subscribe(async (val) => {
		files = await readDirAsync({ dir: val.dir || "", baseDir: val.baseDir || "" })
	})
	const directories = Object.keys(baseDirectories)
</script>

<main class="text-start min-h-[100vh] bg-zinc-800 text-white font-sans">
	<form on:submit|preventDefault={() => filterByName(nameInput)} class="p-[20px] w-full">
		<input
			type="text"
			bind:value={nameInput}
			placeholder="Busca un archivo..."
			class=" bg-zinc-600 rounded-[3px] px-[6px] py-[6px] w-full outline-none"
		/>
	</form>
	<div class="flex gap-[20px] px-[20px]">
		{#each directories as directory}
			<button
				on:click={() =>
					appDir.set({
						dir: baseDirectories[directory].dir || "",
						baseDir: baseDirectories[directory].baseDir || "",
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
									baseDir: "",
								})}>{file.name}</button
						>
					{:else}
						<h2>{file.name}</h2>
					{/if}
				</div>
				<div>
					<button on:click={() => renameFileBox(file.name)}>Renombrar</button>
				</div>
			</div>
		{/each}
	</div>
</main>
