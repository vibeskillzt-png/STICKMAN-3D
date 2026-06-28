// ===== BASIC SETUP =====
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// ===== LIGHT =====
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);

// ===== GROUND =====
const groundGeo = new THREE.PlaneGeometry(50, 50);
const groundMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// ===== PLAYER (stickman simple 3D) =====
const player = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 2),
    new THREE.MeshStandardMaterial({ color: 0x00ffff })
);
player.position.set(-2, 1, 0);
scene.add(player);

// ===== ENEMY =====
const enemy = new THREE.Mesh(
    new THREE.CylinderGeometry(0.5, 0.5, 2),
    new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
enemy.position.set(2, 1, 0);
scene.add(enemy);

// ===== CAMERA =====
camera.position.set(0, 5, 8);
camera.lookAt(0, 0, 0);

// ===== GAME VARIABLES =====
let pHealth = 100;
let eHealth = 100;

let keys = {};

// ===== CONTROLS =====
document.addEventListener("keydown", (e) => keys[e.key.toLowerCase()] = true);
document.addEventListener("keyup", (e) => keys[e.key.toLowerCase()] = false);

// ===== ATTACK FUNCTION =====
function attack() {
    const dist = player.position.distanceTo(enemy.position);

    if (dist < 2) {
        eHealth -= 10;
        document.getElementById("eHealth").innerText = eHealth;

        if (eHealth <= 0) {
            alert("You Win!");
            location.reload();
        }
    }
}

// ===== ENEMY AI =====
function enemyAI() {
    const dist = player.position.distanceTo(enemy.position);

    if (dist > 1.5) {
        enemy.position.x += (player.position.x > enemy.position.x) ? 0.02 : -0.02;
    } else {
        if (Math.random() < 0.02) {
            pHealth -= 5;
            document.getElementById("pHealth").innerText = pHealth;

            if (pHealth <= 0) {
                alert("Enemy Wins!");
                location.reload();
            }
        }
    }
}

// ===== GAME LOOP =====
function animate() {
    requestAnimationFrame(animate);

    // movement
    if (keys["a"]) player.position.x -= 0.05;
    if (keys["d"]) player.position.x += 0.05;
    if (keys["w"]) player.position.z -= 0.05;
    if (keys["s"]) player.position.z += 0.05;

    // attack
    if (keys["f"]) attack();

    enemyAI();

    renderer.render(scene, camera);
}

animate();

// ===== RESIZE =====
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});