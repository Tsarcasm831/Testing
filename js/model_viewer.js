import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { app } from './app.js';

(function(ns) {
    'use strict';
    let camera, scene, renderer, controls, clock, mixer, animationFrameId, resizeObserver;
    const CACHE_NAME = 'glb-model-cache-v1';

    async function fetchWithProgress(url, onProgress) {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        if (!response.body) {
            throw new Error('Response body is null');
        }
        const reader = response.body.getReader();
        const contentLength = +response.headers.get('Content-Length');
        let receivedLength = 0;
        const chunks = [];
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            chunks.push(value);
            receivedLength += value.length;
            if (onProgress) {
                onProgress(receivedLength, contentLength);
            }
        }
        const blob = new Blob(chunks);
        return blob;
    }

    async function loadModelWithCache(url, onProgress) {
        if (!url.endsWith('.glb') || !url.startsWith('https://file.garden')) {
            const blob = await fetchWithProgress(url, onProgress);
            return blob.arrayBuffer();
        }
        try {
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(url);
            if (cachedResponse) {
                console.log('Model found in cache:', url);
                const blob = await cachedResponse.blob();
                if (onProgress) {
                    onProgress(blob.size, blob.size);
                }
                return blob.arrayBuffer();
            }
            console.log('Model not in cache, fetching from network:', url);
            const blob = await fetchWithProgress(url, onProgress);
            await cache.put(url, new Response(blob));
            console.log('Model cached:', url);
            return blob.arrayBuffer();
        } catch (error) {
            console.error('Cache API or fetch error:', error);
            throw error;
        }
    }

    const initModelViewer = async (canvas, modelUrl, loaderElement, modelData = {}) => {
        if (!canvas) return;
        destroyModelViewer();
        const container = canvas.parentElement;
        clock = new THREE.Clock();
        scene = new THREE.Scene();
        scene.background = new THREE.Color(0x05080a);
        scene.fog = new THREE.Fog(0x05080a, 10, 50);
        camera = new THREE.PerspectiveCamera(50, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 4);
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.shadowMap.enabled = true;
        controls = new OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.target.set(0, 1, 0);
        scene.add(new THREE.AmbientLight(0x404040, 2));
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        scene.add(directionalLight);
        const pointLight = new THREE.PointLight(0x3a7bd5, 2, 100);
        pointLight.position.set(-5, 3, 2);
        scene.add(pointLight);
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(100, 100),
            new THREE.MeshStandardMaterial({ color: 0x080c10, metalness: 0.2, roughness: 0.8 })
        );
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        scene.add(ground);
        resizeObserver = new ResizeObserver(entries => {
            for (const entry of entries) {
                if (entry.target === container) {
                    const { width, height } = entry.contentRect;
                    if (renderer && camera && width > 0 && height > 0) {
                        camera.aspect = width / height;
                        camera.updateProjectionMatrix();
                        renderer.setSize(width, height);
                    }
                }
            }
        });
        resizeObserver.observe(container);
        animate();
        const loaderP = loaderElement?.querySelector('p');
        if (loaderP) {
            if (modelData.fileSizeMB && modelData.fileSizeMB > 10) {
                loaderP.innerHTML = `ANCHORING LARGE SPECIMEN (${modelData.fileSizeMB} MB)...<br><small>THIS MAY TAKE A MOMENT.</small>`;
            } else {
                loaderP.textContent = "LOADING SPECIMEN...";
            }
        }
        const onProgress = (loaded, total) => {
            if (loaderElement && loaderP) {
                let baseText = "LOADING SPECIMEN";
                let note = "";
                if (modelData.fileSizeMB && modelData.fileSizeMB > 10) {
                    baseText = `ANCHORING LARGE SPECIMEN (${modelData.fileSizeMB} MB)`;
                    note = `<br><small>THIS MAY TAKE A MOMENT.</small>`;
                }
                if (total) {
                    const percentComplete = (loaded / total) * 100;
                    loaderP.innerHTML = `${baseText}... ${Math.round(percentComplete)}%${note}`;
                } else {
                    const loadedMB = (loaded / 1024 / 1024).toFixed(2);
                    loaderP.innerHTML = `${baseText}... ${loadedMB} MB${note}`;
                }
            }
        };
        try {
            const modelBuffer = await loadModelWithCache(modelUrl, onProgress);
            const loader = new GLTFLoader();
            loader.parse(modelBuffer, '', (gltf) => {
                const model = gltf.scene;
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3()).length();
                const center = box.getCenter(new THREE.Vector3());
                model.position.x += (model.position.x - center.x);
                model.position.y += (model.position.y - center.y);
                model.position.z += (model.position.z - center.z);
                const scale = 2.5 / size;
                model.scale.set(scale, scale, scale);
                model.traverse((node) => {
                    if (node.isMesh) {
                        node.castShadow = true;
                        node.receiveShadow = true;
                    }
                });
                scene.add(model);
                if (gltf.animations && gltf.animations.length) {
                    mixer = new THREE.AnimationMixer(model);
                    mixer.clipAction(gltf.animations[0]).play();
                }
                if (loaderElement) loaderElement.classList.add('hidden');
            }, (error) => {
                console.error('An error happened during model parsing:', error);
                if (loaderElement) {
                    loaderElement.querySelector('p').textContent = "ERROR: FAILED TO PARSE SPECIMEN.";
                    const spinner = loaderElement.querySelector('.spinner');
                    if (spinner) spinner.style.display = 'none';
                }
            });
        } catch (error) {
            console.error('An error happened while loading the model:', error);
            if (loaderElement) {
                loaderElement.querySelector('p').textContent = "ERROR: UNABLE TO ANCHOR SPECIMEN.";
                const spinner = loaderElement.querySelector('.spinner');
                if (spinner) spinner.style.display = 'none';
            }
        }
    };

    const animate = () => {
        if (!renderer) return;
        animationFrameId = requestAnimationFrame(animate);
        const delta = clock.getDelta();
        if (mixer) mixer.update(delta);
        controls.update();
        renderer.render(scene, camera);
    };

    const destroyModelViewer = () => {
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (resizeObserver) resizeObserver.disconnect();
        if (renderer) renderer.dispose();
        if (scene) {
            while(scene.children.length > 0){
                const obj = scene.children[0];
                scene.remove(obj);
                if(obj.geometry) obj.geometry.dispose();
                if(obj.material) {
                    if (Array.isArray(obj.material)) {
                        obj.material.forEach(material => material.dispose());
                    } else {
                        obj.material.dispose();
                    }
                }
            }
        }
        if (controls) controls.dispose();
        camera = scene = renderer = controls = clock = mixer = animationFrameId = resizeObserver = null;
    };

    ns.modelViewer = { initModelViewer, destroyModelViewer };

})(app);
