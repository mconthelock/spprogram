<template>
	<button
		type="button"
		class="image-popup"
		:aria-label="alt"
		@click="openPopup"
	>
		<img :src="src" :alt="alt" loading="lazy" />
	</button>
</template>

<script setup>
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const props = defineProps({
	src: {
		type: String,
		required: true,
	},
	alt: {
		type: String,
		default: "Image",
	},
	caption: {
		type: String,
		default: "",
	},
});

const openPopup = () => {
	Fancybox.show(
		[
			{
				src: props.src,
				type: "image",
				caption: props.caption || props.alt,
			},
		],
		{
			groupAll: false,
		},
	);
};
</script>

<style scoped>
.image-popup {
	display: block;
	padding: 0;
	border: 0;
	background: transparent;
	cursor: zoom-in;
	width: 100%;
}

.image-popup img {
	display: block;
	max-width: 100%;
	height: auto;
	margin: 0 auto;
}

.image-popup:focus-visible {
	outline: 2px solid var(--vp-c-brand-1);
	outline-offset: 4px;
}
</style>