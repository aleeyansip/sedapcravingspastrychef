function trackOrder() {
    const nameInput = document.getElementById('searchName').value.toLowerCase().trim();
    let phoneInput = document.getElementById('searchPhone').value.trim();

    if (phoneInput.startsWith('0')) {
        phoneInput = '6' + phoneInput;
    }

    const cleanPhone = phoneInput.replace('+', '').replace(/[^0-9]/g, '');
    const resultDiv = document.getElementById('orderResult');

    const foundOrder = allOrders.find(order =>
        order.name?.toLowerCase().trim() === nameInput &&
        order.phone?.replace(/[^0-9]/g, '') === cleanPhone
    );

    if (foundOrder) {
        resultDiv.innerHTML = `
            <div class="order-card">
                <h4>Hello, ${foundOrder.name}! 👋</h4>
                <p><b>Day:</b> ${foundOrder.day}</p>
                <p><b>Status:</b> ${foundOrder.status}</p>
                <p><b>Location:</b> ${foundOrder.location}</p>
                <p><b>Quantity:</b> ${foundOrder.quantity} Cake(s)</p>
            </div>
        `;
    } else {
        resultDiv.innerHTML = `<p style="color: red;">❌ No match found. Make sure you use the same name and phone number as your order form.</p>`;
    }
}

let allOrders = [];

const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSRhq4TH514yAQVOUYzCpuRaBht1xgX9FmewA48hL4qpb2G9euAjk7qi7FCOlES333po5ICB_uQo9NQ/pub?gid=0&single=true&output=csv";

async function loadOrderData() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.text();

        const rows = data.split('\n');
        allOrders = rows.slice(1).map(row => {
            const cols = row.split(',');
            return {
                name: cols[1]?.trim(),      // Column B
                day: cols[2]?.trim(),       // Column C
                quantity: cols[3]?.trim(),  // Column D
                location: cols[4]?.trim(),  // Column E
                status: cols[5]?.trim(),    // Column F
                phone: cols[6]?.replace(/[^0-9]/g, '').trim() // Column G
            };
        });
        console.log("Live Database Connected! 🟢");
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

loadOrderData();