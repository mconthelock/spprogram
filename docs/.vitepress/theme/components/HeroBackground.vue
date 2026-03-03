<template>
	<div ref="container" class="three-container"></div>
</template>

<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import * as THREE from "three";

const container = ref(null);
let scene, camera, renderer, points;

onMounted(() => {
	if (typeof window === "undefined") return;

	// 1. Setup Scene
	scene = new THREE.Scene();
	camera = new THREE.PerspectiveCamera(
		100,
		window.innerWidth / window.innerHeight,
		0.1,
		1000,
	);
	camera.position.z = 5;

	renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.value.appendChild(renderer.domElement);

	// 2. Create Particles (เพิ่มความน่าสนใจ)
	const geometry = new THREE.BufferGeometry();
	const vertices = [];
	for (let i = 0; i < 5000; i++) {
		vertices.push(THREE.MathUtils.randFloatSpread(2000)); // x
		vertices.push(THREE.MathUtils.randFloatSpread(2000)); // y
		vertices.push(THREE.MathUtils.randFloatSpread(2000)); // z
	}
	geometry.setAttribute(
		"position",
		new THREE.Float32BufferAttribute(vertices, 3),
	);
	const material = new THREE.PointsMaterial({ color: 0x3eaf7c, size: 2 });
	points = new THREE.Points(geometry, material);
	scene.add(points);

	// 3. Animation Loop
	const animate = () => {
		requestAnimationFrame(animate);
		points.rotation.x += 0.001;
		points.rotation.y += 0.001;
		renderer.render(scene, camera);
	};
	animate();

	// Handle Resize
	window.addEventListener("resize", onWindowResize);
});

const onWindowResize = () => {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
};

onBeforeUnmount(() => {
	window.removeEventListener("resize", onWindowResize);
});
</script>

<style scoped>
.three-container {
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: -1; /* ให้อยู่หลังเนื้อหา */
	pointer-events: none; /* ไม่ให้ทับการคลิกปุ่ม */
	opacity: 0.4;
}
</style>
