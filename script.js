let orderLog = [];

document.getElementById('order-button').addEventListener('click', () => {
  const orders = document.getElementById('orders');
  const items = [];
  const prices = [150, 150, 150, 150, 150];
  let totalPrice = 0;

  for (let i = 1; i <= 5; i++) {
    const checkbox = document.getElementById(`item${i}`);
    if (checkbox.checked) {
      let quantity = prompt(`商品${i}の個数を入力してください:`, 1);
      quantity = parseInt(quantity, 10);
      if (quantity > 0) {
        items.push({ item: `商品${i}`, quantity });
        totalPrice += prices[i - 1] * quantity;
      }
    }
  }

  if (items.length > 0) {
    const orderContent = items.map(order => `${order.item}: ${order.quantity} 個`).join(', ');
    const li = document.createElement('li');
    li.className = 'order-item';
    li.innerHTML = `${orders.childNodes.length + 1}. ${orderContent} (合計金額: ${totalPrice} 円) <button onclick="deleteOrder(${orders.childNodes.length}, true)">x</button> <button onclick="deleteOrder(${orders.childNodes.length}, false)">取消</button>`;
    orders.appendChild(li);

    // 注文ボタンの下に合計金額を表示
    const totalPriceDisplay = document.getElementById('total-price');
    totalPriceDisplay.textContent = `今回の注文の合計金額: ${totalPrice} 円`;
  }

  // Uncheck all checkboxes
  for (let i = 1; i <= 5; i++) {
    document.getElementById(`item${i}`).checked = false;
  }
});

function deleteOrder(index, logDeletion) {
  const orders = document.getElementById('orders');
  const orderText = orders.childNodes[index].textContent.split('. ')[1].split(' (')[0];
  const totalPrice = orders.childNodes[index].textContent.match(/合計金額: (\d+) 円/)[1];

  if (logDeletion) {
    orderLog.push({ order: orderText, totalPrice: parseInt(totalPrice, 10) });
  }

  orders.removeChild(orders.childNodes[index]);

  Array.from(orders.childNodes).forEach((order, newIndex) => {
    order.innerHTML = `${newIndex + 1}. ${order.textContent.split('. ')[1]} <button onclick="deleteOrder(${newIndex}, true)">x</button> <button onclick="deleteOrder(${newIndex}, false)">取消</button>`;
  });
}

document.addEventListener('keydown', (event) => {
  const key = event.key;
  if (!isNaN(key) && key > 0) {
    const orders = document.getElementById('orders');
    if (key <= orders.childNodes.length) {
      deleteOrder(key - 1, true);
    }
  }
});

document.getElementById('export-button').addEventListener('click', () => {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(orderLog);
  XLSX.utils.book_append_sheet(wb, ws, "注文ログ");

  XLSX.writeFile(wb, "order_log.xlsx");
});
