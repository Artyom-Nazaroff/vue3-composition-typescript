import { ref, computed, type Ref } from "vue"

export const useLetters = (word: Ref<string>) => {
	const letters = ref<string[]>([])
	const correctLetters = computed(() => letters.value.filter((el) => word.value.includes(el)))
	const wrongLetters = computed(() => letters.value.filter((el) => !word.value.includes(el)))

	return {
		letters, correctLetters, wrongLetters
	}
}