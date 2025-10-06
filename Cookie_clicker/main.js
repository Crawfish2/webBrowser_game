// ゲーム状態
let cookies = 0;
let cookiesPerSecond = 0;
let cookiesPerClick = 1;

// ショップアイテム
const shopItems = [
    {
        name: "カーソル",
        description: "毎秒0.5クッキーを生産",
        basePrice: 5,
        cps: 0.5,
        count: 0,
        emoji: "👆"
    },
    {
        name: "おばあちゃん",
        description: "毎秒1クッキーを生産",
        basePrice: 15,
        cps: 1,
        count: 0,
        emoji: "👵"
    },
    {
        name: "農場",
        description: "毎秒8クッキーを生産",
        basePrice: 100,
        cps: 8,
        count: 0,
        emoji: "🚜"
    },
    {
        name: "工場",
        description: "毎秒47クッキーを生産",
        basePrice: 1100,
        cps: 47,
        count: 0,
        emoji: "🏭"
    },
    {
        name: "銀行",
        description: "毎秒260クッキーを生産",
        basePrice: 12000,
        cps: 260,
        count: 0,
        emoji: "🏦"
    }
];

// DOM要素
const scoreElement = document.getElementById('score');
const perSecondElement = document.getElementById('perSecond');
const cookieButton = document.getElementById('cookieButton');
const shopItemsContainer = document.getElementById('shopItems');

// クッキーをクリック
cookieButton.addEventListener('click', (event) => {
    cookies += cookiesPerClick;
    updateDisplay();
    
    // クリック効果
    showClickEffect(event.clientX, event.clientY, cookiesPerClick);
});

// クリック効果を表示
function showClickEffect(x, y, amount) {
    const effect = document.createElement('div');
    effect.className = 'click-effect';
    effect.textContent = `+${amount}`;
    effect.style.left = x + 'px';
    effect.style.top = y + 'px';
    document.body.appendChild(effect);
    
    setTimeout(() => {
        document.body.removeChild(effect);
    }, 1000);
}

// アイテムの価格を計算
function getItemPrice(item) {
    return Math.floor(item.basePrice * Math.pow(1.15, item.count));
}

// アイテムを購入
function buyItem(index) {
    const item = shopItems[index];
    const price = getItemPrice(item);
    
    if (cookies >= price) {
        cookies -= price;
        item.count++;
        cookiesPerSecond += item.cps;
        updateDisplay();
        updateShop();
    }
}

// ショップを更新
function updateShop() {
    shopItemsContainer.innerHTML = '';
    
    shopItems.forEach((item, index) => {
        const price = getItemPrice(item);
        const canAfford = cookies >= price;
        
        const shopItem = document.createElement('div');
        shopItem.className = `shop-item ${canAfford ? '' : 'disabled'}`;
        
        shopItem.innerHTML = `
            <div class="item-info">
                <h4>${item.emoji} ${item.name}</h4>
                <div class="item-description">${item.description}</div>
            </div>
            <div class="item-purchase">
                <div class="item-price">${price} クッキー</div>
                <div class="item-count">所有数: ${item.count}</div>
                <button class="buy-button" ${canAfford ? '' : 'disabled'}>
                    購入
                </button>
            </div>
        `;
        
        // ボタンを取得してイベントリスナーを追加
        const button = shopItem.querySelector('.buy-button');
        button.addEventListener('click', () => buyItem(index));
        
        shopItemsContainer.appendChild(shopItem);
    });
}

// 表示を更新
function updateDisplay() {
    scoreElement.textContent = `${Math.floor(cookies)} クッキー`;
    perSecondElement.textContent = `毎秒 ${cookiesPerSecond.toFixed(1)} クッキー`;
}

// 数値をフォーマット
function formatNumber(num) {
    if (num >= 1000000000) return (num / 1000000000).toFixed(1) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return Math.floor(num);
}

// 毎秒の自動生産
setInterval(() => {
    if (cookiesPerSecond > 0) {
        cookies += cookiesPerSecond;
        updateDisplay();
        updateShop();
    }
}, 1000);

// 初期化
updateDisplay();
updateShop();