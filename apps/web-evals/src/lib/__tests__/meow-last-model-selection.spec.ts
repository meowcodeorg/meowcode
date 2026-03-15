import {
	loadMeowLastModelSelection,
	MEOW_LAST_MODEL_SELECTION_KEY,
	saveMeowLastModelSelection,
} from "../meow-last-model-selection"

class LocalStorageMock implements Storage {
	private store = new Map<string, string>()

	get length(): number {
		return this.store.size
	}

	clear(): void {
		this.store.clear()
	}

	getItem(key: string): string | null {
		return this.store.get(key) ?? null
	}

	key(index: number): string | null {
		return Array.from(this.store.keys())[index] ?? null
	}

	removeItem(key: string): void {
		this.store.delete(key)
	}

	setItem(key: string, value: string): void {
		this.store.set(key, value)
	}
}

beforeEach(() => {
	Object.defineProperty(globalThis, "localStorage", {
		value: new LocalStorageMock(),
		configurable: true,
	})
})

describe("meow-last-model-selection", () => {
	it("saves and loads (deduped + trimmed)", () => {
		saveMeowLastModelSelection([" roo/model-a ", "roo/model-a", "roo/model-b"])
		expect(loadMeowLastModelSelection()).toEqual(["roo/model-a", "roo/model-b"])
	})

	it("ignores invalid JSON", () => {
		localStorage.setItem(MEOW_LAST_MODEL_SELECTION_KEY, "{this is not json")
		expect(loadMeowLastModelSelection()).toEqual([])
	})

	it("clears when empty", () => {
		localStorage.setItem(MEOW_LAST_MODEL_SELECTION_KEY, JSON.stringify(["roo/model-a"]))
		saveMeowLastModelSelection([])
		expect(localStorage.getItem(MEOW_LAST_MODEL_SELECTION_KEY)).toBeNull()
	})

	it("does not throw if localStorage access fails", () => {
		Object.defineProperty(globalThis, "localStorage", {
			value: {
				getItem: () => {
					throw new Error("blocked")
				},
				setItem: () => {
					throw new Error("blocked")
				},
				removeItem: () => {
					throw new Error("blocked")
				},
			},
			configurable: true,
		})

		expect(() => loadMeowLastModelSelection()).not.toThrow()
		expect(() => saveMeowLastModelSelection(["roo/model-a"])).not.toThrow()
	})
})
