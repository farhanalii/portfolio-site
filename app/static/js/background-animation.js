// // Simple Three.js particle system that definitely works
// document.addEventListener('DOMContentLoaded', () => {
//     // Check if Three.js is available
//     if (typeof THREE === 'undefined') {
//       console.error('Three.js not loaded!');
//       return;
//     }
  
//     // 1. Create scene
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ alpha: true });
    
//     // 2. Setup renderer
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     renderer.domElement.style.position = 'fixed';
//     renderer.domElement.style.top = '0';
//     renderer.domElement.style.left = '0';
//     renderer.domElement.style.zIndex = '-1';
//     document.body.appendChild(renderer.domElement);
  
//     // 3. Create particles
//     const particlesGeometry = new THREE.BufferGeometry();
//     const particleCount = 1500;
    
//     const posArray = new Float32Array(particleCount * 3);
//     for(let i = 0; i < particleCount * 3; i++) {
//       posArray[i] = (Math.random() - 0.5) * 10;
//     }
    
//     particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
//     const particlesMaterial = new THREE.PointsMaterial({
//       size: 0.02,
//       color: 0x0c70f2, // Your primary blue color
//       transparent: true,
//       opacity: 0.8,
//       blending: THREE.AdditiveBlending
//     });
    
//     const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
//     scene.add(particlesMesh);
  
//     // 4. Camera position
//     camera.position.z = 5;
  
//     // 5. Animation loop
//     function animate() {
//       requestAnimationFrame(animate);
      
//       particlesMesh.rotation.x += 0.001;
//       particlesMesh.rotation.y += 0.0005;
      
//       renderer.render(scene, camera);
//     }
//     animate();
  
//     // 6. Handle resize
//     window.addEventListener('resize', () => {
//       camera.aspect = window.innerWidth / window.innerHeight;
//       camera.updateProjectionMatrix();
//       renderer.setSize(window.innerWidth, window.innerHeight);
//     });
//   });