<template>
	<game-header />

	<div class="game-container">
		<game-figure :wrong-letters-amount="wrongLetters.length" />
		<game-wrong-letters :wrong-letters="wrongLetters" />
		<game-word :word="word" :correct-letters="correctLetters" />
	</div>

	<game-popup :word="word" ref="popup" @restart="restart" />
	<game-notification ref="notification" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import GameWord from './components/GameWord.vue';
import GameFigure from './components/GameFigure.vue';
import GameHeader from './components/GameHeader.vue';
import GameNotification from './components/GameNotification.vue';
import GamePopup from './components/GamePopup.vue';
import GameWrongLetters from './components/GameWrongLetters.vue';
import { useRandomWord } from './composables/useRandomWord'
import { useLetters } from './composables/useLetters'

const { word, getRandomWord } = useRandomWord()
const { letters, correctLetters, wrongLetters } = useLetters(word)

const notification = ref<InstanceType<typeof GameNotification> | null>(null)
const popup = ref<InstanceType<typeof GamePopup> | null>(null)
const isLose = computed(() => wrongLetters.value.length === 6)
const isWin = computed(() => [...word.value].every((el) => correctLetters.value.includes(el)))

watch(wrongLetters, () => {
	if (isLose.value) popup.value?.open('lose')
})

watch(correctLetters, () => {
	if (isWin.value) popup.value?.open('win')
})

window.addEventListener('keydown', ({ key }) => {
	if (isWin.value || isLose.value) return
	if (wrongLetters.value.includes(key)) {
		notification.value?.open()
		setTimeout(() => notification.value?.close(), 2000);
		return
	}
	if (/[а-яА-ЯёЁ]/.test(key)) letters.value.push(key.toLowerCase())
})

const restart = async () => {
	await getRandomWord()
	letters.value = []
	popup.value?.close()
}

</script>

<style scoped></style>