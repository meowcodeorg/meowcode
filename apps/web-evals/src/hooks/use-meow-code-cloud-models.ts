import { useFuzzyModelSearch } from "./use-fuzzy-model-search"

export const getMeowCodeCloudModels = async () => {
	return []
}

export const useMeowCodeCloudModels = () => {
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
