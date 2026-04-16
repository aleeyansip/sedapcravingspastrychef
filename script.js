

function trackOrder() {
    const nameInput = document.getElementById('searchName').value.toLowerCase().trim();
    let phoneInput = document.getElementById('searchPhone').value.trim();

    // PSYCHOLOGY TRICK: If they accidentally deleted the +60 and typed 011...
    // We automatically fix it to match your Excel format (6011...)
    if (phoneInput.startsWith('0')) {
        phoneInput = '6' + phoneInput; 
    }
    
    // Remove the "+" if it exists so it matches your Excel "601..."
    const cleanPhone = phoneInput.replace('+', '');

    const resultDiv = document.getElementById('orderResult');

    // Searching the data...
    const foundOrder = allOrders.find(order => 
        order.name.toLowerCase() === nameInput && 
        order.phone.toString() === cleanPhone
    );

    if (foundOrder) {
        resultDiv.innerHTML = `
            <div class="order-card">
                <h4>Hello, ${foundOrder.name}! 👋</h4>
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

// PASTE YOUR PUBLISHED CSV LINK INSIDE THE QUOTES BELOW
const sheetURL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSRhq4TH514yAQVOUYzCpuRaBht1xgX9FmewA48hL4qpb2G9euAjk7qi7FCOlES333po5ICB_uQo9NQ/pub?gid=0&single=true&output=csv";

async function loadOrderData() {
    try {
        const response = await fetch(sheetURL);
        const data = await response.text();
        
        // This splits the rows and creates your database
        const rows = data.split('\n');
        allOrders = rows.slice(1).map(row => {
            const cols = row.split(',');
            return {
                name: cols[1]?.trim(),      // Column B
                quantity: cols[2]?.trim(),  // Column C
                location: cols[3]?.trim(),  // Column D
                status: cols[4]?.trim(),    // Column E
                phone: cols[5]?.replace(/[^0-9]/g, '').trim() // Column F
            };
        });
        console.log("Live Database Connected! 🟢");
    } catch (error) {
        console.error("Connection failed:", error);
    }
}

// Keep the rest of your trackOrder() function exactly the same!
loadOrderData();