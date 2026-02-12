export const state = {
	selectedFilesMap: new Map(),
	deletedLineMap: new Map(),
	deletedFilesMap: new Map(),
};

export function setSelectedFilesMap(id, data) {
	state.selectedFilesMap.set(id, data);
}

export function setDeletedLineMap(id, data) {
	state.deletedLineMap.set(id, data);
}

export function setDeletedFilesMap(id, data) {
	state.deletedFilesMap.set(id, data);
}
