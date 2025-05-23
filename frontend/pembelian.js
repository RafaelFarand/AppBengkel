async function buySparepart(sparepartId) {
    const qty = parseInt(document.getElementById(`qty-${sparepartId}`).value, 10);
    if (!qty || qty < 1) return alert('Jumlah minimal 1');

    const order = { id_user: currentUserId, id_sparepart: sparepartId, jumlah: qty };

    await apiCall('post', '/pembelian', order);
    alert('Pembelian berhasil!');
    loadMyOrders();
    loadAvailableSpareparts();
}

async function loadMyOrders() {
    const response = await apiCall('get', `/pembelian/${currentUserId}`);
    const container = document.getElementById('myOrders');
    container.innerHTML = '';

    if (!response.data.length) {
        container.innerHTML = '<p>Belum ada pesanan.</p>';
        return;
    }

    const table = document.createElement('table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>No</th><th>Sparepart</th><th>Jumlah</th><th>Harga</th><th>Total</th><th>Aksi</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    const tbody = table.querySelector('tbody');

    response.data.forEach((o, i) => {
        const total = o.jumlah * o.sparepart.price;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${o.sparepart.name}</td>
            <td>${o.jumlah}</td>
            <td>Rp${o.sparepart.price}</td>
            <td>Rp${total}</td>
            <td><button onclick="cancelOrder(${o.id})">Batalkan</button></td>
        `;
        tbody.appendChild(row);
    });

    container.appendChild(table);
}

async function cancelOrder(orderId) {
    if (confirm('Batalkan pesanan ini?')) {
        await apiCall('delete', `/pembelian/${orderId}`);
        alert('Pesanan dibatalkan!');
        loadMyOrders();
        loadAvailableSpareparts();
    }
}

window.buySparepart = buySparepart;
window.cancelOrder = cancelOrder;
window.loadMyOrders = loadMyOrders;
