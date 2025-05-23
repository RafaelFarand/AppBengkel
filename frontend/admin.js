let editingSparepartId = null;

async function apiCall(method, endpoint, data = null, formData = false) {
    try {
        const config = {
            method,
            url: `${API_URL}${endpoint}`,
            headers: { 'Authorization': `Bearer ${accessToken}` },
            data: formData ? data : JSON.stringify(data),
        };
        if (formData) {
            config.headers['Content-Type'] = 'multipart/form-data';
        }
        return await axios(config);
    } catch (error) {
        if (error.response?.status === 403) {
            const refreshed = await refreshToken();
            if (refreshed) return await apiCall(method, endpoint, data, formData);
        }
        throw error;
    }
}

function showAddForm() {
    document.getElementById('sparepartForm').classList.remove('hidden');
    document.getElementById('sparepartName').value = '';
    document.getElementById('sparepartStock').value = '';
    document.getElementById('sparepartPrice').value = '';
    document.getElementById('sparepartImage').value = '';
    editingSparepartId = null;
}

async function loadSpareparts() {
    const response = await apiCall('get', '/spareparts');
    const container = document.getElementById('sparepartsList');
    container.innerHTML = '';

    response.data.forEach(part => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            ${part.image ? `<img src="${API_URL}/uploads/${part.image}" alt="${part.name}" style="max-width:100%;">` : ''}
            <h3>${part.name}</h3>
            <p>Stok: ${part.stock}</p>
            <p>Harga: Rp${part.price}</p>
            <button onclick="editSparepart(${part.id})">Edit</button>
            <button onclick="deleteSparepart(${part.id})">Hapus</button>
        `;
        container.appendChild(card);
    });
}

async function loadAvailableSpareparts() {
    const response = await apiCall('get', '/spareparts');
    const container = document.getElementById('availableSpareparts');
    container.innerHTML = '';

    response.data.forEach(part => {
        if (part.stock > 0) {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                ${part.image ? `<img src="${API_URL}/uploads/${part.image}" alt="${part.name}" style="max-width:100%;">` : ''}
                <h3>${part.name}</h3>
                <p>Stok: ${part.stock}</p>
                <p>Harga: Rp${part.price}</p>
                <input type="number" id="qty-${part.id}" min="1" max="${part.stock}" value="1">
                <button onclick="buySparepart(${part.id})">Beli</button>
            `;
            container.appendChild(card);
        }
    });
}

async function editSparepart(id) {
    const response = await apiCall('get', '/spareparts');
    const sparepart = response.data.find(part => part.id === id);
    if (!sparepart) return alert('Sparepart tidak ditemukan!');
    document.getElementById('sparepartName').value = sparepart.name;
    document.getElementById('sparepartStock').value = sparepart.stock;
    document.getElementById('sparepartPrice').value = sparepart.price;
    editingSparepartId = id;
    document.getElementById('sparepartForm').classList.remove('hidden');
}

async function saveSparepart() {
    const name = document.getElementById('sparepartName').value;
    const stock = document.getElementById('sparepartStock').value;
    const price = document.getElementById('sparepartPrice').value;
    const image = document.getElementById('sparepartImage').files[0];

    if (!name || !stock || !price) return alert('Semua field harus diisi!');

    const formData = new FormData();
    formData.append('name', name);
    formData.append('stock', stock);
    formData.append('price', price);
    formData.append('supplierId', 1);
    if (image) formData.append('image', image);

    if (editingSparepartId) {
        await apiCall('put', `/spareparts/${editingSparepartId}`, formData, true);
        alert('Sparepart diperbarui!');
    } else {
        await apiCall('post', '/spareparts', formData, true);
        alert('Sparepart ditambahkan!');
    }

    editingSparepartId = null;
    document.getElementById('sparepartForm').classList.add('hidden');
    loadSpareparts();
}

async function deleteSparepart(id) {
    if (confirm('Yakin ingin menghapus?')) {
        await apiCall('delete', `/spareparts/${id}`);
        alert('Sparepart dihapus!');
        loadSpareparts();
    }
}

window.showAddForm = showAddForm;
window.saveSparepart = saveSparepart;
window.editSparepart = editSparepart;
window.deleteSparepart = deleteSparepart;
window.loadSpareparts = loadSpareparts;
window.loadAvailableSpareparts = loadAvailableSpareparts;
