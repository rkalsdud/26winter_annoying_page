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
    const active = document.activeElement;
    
    // 입력창 활성화 상태일 때의 예외 처리
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        if (e.key === 'Escape') {
            active.blur();
        }
        return; 
    }

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
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
        return;
    }

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

    posX = 60;
    posY = window.innerHeight - 80;
    
    const speed = 15 + (chargePower / 4); 
    vx = speed * Math.cos(angle * Math.PI / 180);
    vy = -speed * Math.sin(angle * Math.PI / 180);

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

// === 클릭 판정 범위가 엄격해진 트리거 함수 ===
function triggerAirClick() {
    isFlying = false;
    cancelAnimationFrame(animationId);
    
    const hitX = posX + 15;
    const hitY = posY + 15;
    
    createRipple(hitX, hitY);

    const shield = document.getElementById('mouse-shield');
    if (shield) shield.style.display = 'none';

    const target = document.elementFromPoint(hitX, hitY);
    if (target) {
        // 1. 맞춘 위치 자체가 링크/버튼이거나, 바로 위 부모가 링크/버튼인지 확인
        let link = target.closest('a') || target.closest('button');
        
        // 2. 만약 표의 칸(TD)이나 리스트(LI) 같은 '좁은 영역'을 맞췄을 때만 그 내부의 링크를 검색
        if (!link && ['TD', 'TH', 'LI', 'SPAN'].includes(target.tagName)) {
            link = target.querySelector('a') || target.querySelector('button');
        }
        
        // 3. 요소 판별 및 실행
        if (link) {
            // 링크나 버튼을 찾았다면 해당 요소를 클릭
            link.click();
        } else if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
            // 입력창을 맞췄다면 타이핑 가능하게 포커스
            target.focus();
        } else {
            // 빈 공간이나 일반 텍스트 등을 맞췄을 때
            // 활성화된 입력창이 있다면 빠져나오게(blur)만 처리하고 아무것도 클릭하지 않음
            const active = document.activeElement;
            if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA')) {
                active.blur();
            }
        }
    }
    
    if (shield) shield.style.display = 'block';

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

updateCannon();