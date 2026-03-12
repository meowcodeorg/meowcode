import { useFuzzyModelSearch } from "./use-fuzzy-model-search"

export const getRooCodeCloudModels = async () => {
	return []
}

export const useRooCodeCloudModels = () => {
	const { searchValue, setSearchValue, onFilter } = useFuzzyModelSearch([])

	return {
		data: [] as never[],
		isLoading: false,
		isError: false,
		error: null,
		searchValue,
		setSearchValue,
		onFilter,
	}
}
