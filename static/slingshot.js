const bullet = document.getElementById('cursor-bullet');
const cannonContainer = document.getElementById('cannon-container');
const cannonBarrel = document.getElementById('cannon-barrel');
const powerGauge = document.getElementById('power-gauge');
const guideText = document.getElementById('guide-text');

let isFlying = false;
let isCharging = false;
let chargePower = 0;
let chargeDirection = 1;
let angle = 45; 
let animationId = null;
let chargeInterval = null;

const gravity = 0.5;
let vx = 0, vy = 0, posX = 0, posY = 0;

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space') {
        if (isFlying) {
            triggerAirClick();
            e.preventDefault();
            return; 
        }
        if (!isCharging) {
            startCharging();
            e.preventDefault();
        }
    }

    if (!isFlying && !isCharging) {
        if (e.code === 'ArrowLeft') {
            angle = Math.min(angle + 5, 90);
            updateCannon();
        } else if (e.code === 'ArrowRight') {
            angle = Math.max(angle - 5, 0);
            updateCannon();
        }
    }
});

document.addEventListener('keyup', function(e) {
    if (e.code === 'Space' && isCharging) {
        launch();
    }
});

function updateCannon() {
    cannonContainer.style.transform = `rotate(${-angle}deg)`;
}

function startCharging() {
    isCharging = true;
    chargePower = 0;
    chargeDirection = 1;
    guideText.style.display = 'none';
    cannonBarrel.style.backgroundColor = '#ff4444';
    
    chargeInterval = setInterval(() => {
        chargePower += 3 * chargeDirection;
        if (chargePower >= 100 || chargePower <= 0) chargeDirection *= -1;
        powerGauge.style.width = chargePower + '%';
        powerGauge.parentElement.style.display = 'block';
    }, 20);
}

function launch() {
    isCharging = false;
    clearInterval(chargeInterval);
    isFlying = true;
    
    cannonBarrel.style.backgroundColor = '#333';
    cannonContainer.style.marginLeft = '-10px'; 
    setTimeout(() => { cannonContainer.style.marginLeft = '0px'; }, 100);
    powerGauge.parentElement.style.display = 'none';

    // 시작 좌표: 대포 위치 근처
    posX = 100;
    posY = window.innerHeight - 150;
    
    const speed = 10 + (chargePower / 5); 
    vx = speed * Math.cos(angle * Math.PI / 180);
    vy = -speed * Math.sin(angle * Math.PI / 180);

    // 가시성 강제 부여
    bullet.style.display = 'block';
    bullet.style.opacity = '1';
    bullet.style.visibility = 'visible';
    animate();
}

function animate() {
    if (!isFlying) return;

    vy += gravity;
    posX += vx;
    posY += vy;

    bullet.style.left = posX + 'px';
    bullet.style.top = posY + 'px';

    const rotation = Math.atan2(vy, vx) * 180 / Math.PI;
    bullet.style.transform = `rotate(${rotation + 45}deg)`;

    if (posX > window.innerWidth || posY > window.innerHeight || posX < 0 || posY > window.innerHeight + 100) {
        resetBullet();
    } else {
        animationId = requestAnimationFrame(animate);
    }
}

function triggerAirClick() {
    isFlying = false;
    cancelAnimationFrame(animationId);
    
    createRipple(posX, posY);

    // 1. 클릭 감지 반경 설정 (픽셀 단위)
    const clickRadius = 30; 
    let target = null;

    // 2. 중심점에서 가장 먼저 잡히는 요소 확인
    target = document.elementFromPoint(posX, posY);

    // 3. 만약 중심점에 아무것도 없거나 일반 배경(body/html)이라면 주변 탐색
    if (!target || target === document.body || target === document.documentElement) {
        // 8방향으로 범위를 넓혀가며 클릭 가능한 요소(a, button)가 있는지 확인
        const checkPoints = [
            [posX + clickRadius, posY], [posX - clickRadius, posY],
            [posX, posY + clickRadius], [posX, posY - clickRadius],
            [posX + clickRadius/1.4, posY + clickRadius/1.4],
            [posX - clickRadius/1.4, posY - clickRadius/1.4]
        ];

        for (const [px, py] of checkPoints) {
            const tempTarget = document.elementFromPoint(px, py);
            if (tempTarget && (tempTarget.closest('a') || tempTarget.closest('button'))) {
                target = tempTarget;
                break; // 클릭 가능한 요소를 찾으면 중단
            }
        }
    }

    // 4. 최종 타겟 클릭 수행
    if (target) {
        const clickable = target.closest('a') || target.closest('button') || target;
        
        // 시각적 피드백을 위해 잠시 스타일 변경 (선택 사항)
        if (clickable.style) {
            const originalBg = clickable.style.backgroundColor;
            clickable.style.backgroundColor = 'rgba(255, 255, 0, 0.5)';
            setTimeout(() => { clickable.style.backgroundColor = originalBg; }, 100);
        }

        clickable.click();
    }
    
    setTimeout(() => {
        resetBullet();
    }, 200);
}
function createRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'click-ripple';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => { ripple.remove(); }, 600);
}

function resetBullet() {
    isFlying = false;
    isCharging = false;
    cancelAnimationFrame(animationId);
    bullet.style.display = 'none';
    guideText.style.display = 'block';
    updateCannon();
}