<template>
	<div ref="container" class="ai-model-canvas"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import * as THREE from "three";

const container = ref(null);
let scene, camera, renderer, group;

onMounted(() => {
	if (typeof window === "undefined") return;

	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
	camera.position.z = 400;

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);

	const updateSize = () => {
		const width = container.value.clientWidth || 400;
		const height = container.value.clientHeight || 400;
		renderer.setSize(width, height);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
	};

	container.value.appendChild(renderer.domElement);
	updateSize();

	group = new THREE.Group();
	scene.add(group);

	// สร้าง Neural Sphere (ตัวแทน AI)
	const geometry = new THREE.IcosahedronGeometry(150, 2);
	const pointsMat = new THREE.PointsMaterial({ color: 0x646cff, size: 4 });
	const wireMat = new THREE.MeshBasicMaterial({
		color: 0x42b883,
		wireframe: true,
		transparent: true,
		opacity: 0.3,
	});

	group.add(new THREE.Points(geometry, pointsMat));
	group.add(new THREE.Mesh(geometry, wireMat));

	const animate = () => {
		requestAnimationFrame(animate);
		group.rotation.y += 0.005;
		renderer.render(scene, camera);
	};
	animate();
	window.addEventListener("resize", updateSize);
});
</script>

<style scoped>
.ai-model-canvas {
	width: 100%;
	height: 400px;
	display: block;
	overflow: hidden;
}
</style>
