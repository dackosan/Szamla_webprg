const billsContainer = document.getElementById('listOfBilss');
let currentEditBill = null;

async function fetchAll() {
    const [bills, sellers, customers] = await Promise.all([
        fetch('http://localhost:3000/bills').then(res => res.json()),
        fetch('http://localhost:3000/sellers').then(res => res.json()),
        fetch('http://localhost:3000/customers').then(res => res.json())
    ]);

    renderBills(bills, sellers, customers);
}

function getNameById(list, id) {
    const found = list.find(item => item.id === id);
    return found ? found.name : 'Ismeretlen';
}

function renderBills(bills, sellers, customers) {
    const container = document.getElementById("listOfBills");
    container.innerHTML = "";

    bills.forEach(bill => {
        const seller = sellers.find(s => s.id === bill.sellerId);
        const customer = customers.find(c => c.id === bill.customerId);

        const vatAmount = Math.round(bill.totalAmount * 0.27);

        const div = document.createElement("div");
        div.classList.add("bill-card");

        div.innerHTML = `
            <p><strong>Kiállító:</strong> ${seller?.name ?? "Ismeretlen"}</p>
            <p><strong>Vevő:</strong> ${customer?.name ?? "Ismeretlen"}</p>
            <p><strong>Kelte:</strong> ${bill.creationDate}</p>
            <p><strong>Határidő:</strong> ${bill.paymentDeadline}</p>
            <p><strong>Végösszeg:</strong> ${bill.totalAmount} Ft</p>
            <p><strong>ÁFA (27%):</strong> ${vatAmount} Ft</p>
            <button class="edit-btn">✏️</button>
            <button class="delete-btn">🗑️</button>
        `;

        div.querySelector(".delete-btn").addEventListener("click", async () => {
            const confirmed = confirm("Biztosan törölni szeretnéd ezt a számlát?");
            if (confirmed) {
                try {
                    const response = await fetch(`http://localhost:3000/bills/${bill.id}`, {
                        method: "DELETE"
                    });

                    if (!response.ok) throw new Error("Hiba történt a törlés során.");

                    fetchAll();
                } catch (err) {
                    alert("A törlés nem sikerült.");
                    console.error(err);
                }
            }
        });

        div.querySelector(".edit-btn").addEventListener("click", () => {
            editBill(bill);
        });

        container.appendChild(div);
    });
}

fetchAll();

const modal = document.getElementById("billModal");
const form = document.getElementById("billForm");
const sellerSelect = document.getElementById("sellerSelect");
const customerSelect = document.getElementById("customerSelect");
const billNumberPattern = /^\d{8}-\d{8}-\d{8}$/;

function openModal() {
    modal.classList.remove("hidden");

    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const twoWeeksLater = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    document.getElementById("creationDate").value = formattedToday;
    document.getElementById("dateOfCompletion").value = formattedToday;
    document.getElementById("paymentDeadline").value = twoWeeksLater;
}

function closeModal() {
    modal.classList.add("hidden");
    form.reset();
}

function loadSelectOptions() {
    Promise.all([
        fetch("http://localhost:3000/sellers").then(res => res.json()),
        fetch("http://localhost:3000/customers").then(res => res.json())
    ]).then(([sellers, customers]) => {
        sellerSelect.innerHTML = sellers.map(s => `<option value="${s.id}">${s.name}</option>`).join("");
        customerSelect.innerHTML = customers.map(c => `<option value="${c.id}">${c.name}</option>`).join("");
    });
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const billNumber = document.getElementById("billNumber").value.trim();

    if (!billNumberPattern.test(billNumber)) {
        alert("A számlaszám formátuma hibás! Használj ilyen formátumot: 12345678-12345678-12345678");
        return;
    }

    const newBill = {
        sellerId: +sellerSelect.value,
        customerId: +customerSelect.value,
        billNumber: billNumber,
        creationDate: document.getElementById("creationDate").value,
        dateOfCompletion: document.getElementById("dateOfCompletion").value,
        paymentDeadline: document.getElementById("paymentDeadline").value,
        totalAmount: +document.getElementById("totalAmount").value,
        amountOfVat: 27
    };

    await fetch("http://localhost:3000/bills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newBill)
    });

    closeModal();
    fetchAll();
});

window.addEventListener("DOMContentLoaded", () => {
    loadSelectOptions();
});

function editBill(bill) {
    currentEditBill = bill;  // egész objektum
    currentEditBillId = bill.id; // opcionális, ha kell az id külön is

    const editModal = document.getElementById("editModal");
    editModal.classList.remove("hidden");

    document.getElementById("editBillNumber").value = bill.billNumber;
    document.getElementById("editDateOfCompletion").value = bill.dateOfCompletion;
    document.getElementById("editPaymentDeadline").value = bill.paymentDeadline;
    document.getElementById("editTotalAmount").value = bill.totalAmount;
}

document.getElementById("editBillForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!currentEditBill) {
        alert("Nincs szerkesztésre kijelölt számla!");
        return;
    }

    const sellerId = currentEditBill.sellerId;
    const customerId = currentEditBill.customerId;
    const vat = currentEditBill.amountOfVat;

    const billNumber = document.getElementById("editBillNumber").value.trim();
    const dateOfCompletion = document.getElementById("editDateOfCompletion").value;
    const paymentDeadline = document.getElementById("editPaymentDeadline").value;
    const totalAmount = +document.getElementById("editTotalAmount").value;

    if (!billNumberPattern.test(billNumber)) {
        alert("A számlaszám formátuma hibás! Használj ilyen formátumot: 12345678-12345678-12345678");
        return;
    }

    const updatedBill = {
        sellerId,
        customerId,
        billNumber,
        creationDate: currentEditBill.creationDate, // ha szerkesztéskor ez nem változik
        dateOfCompletion,
        paymentDeadline,
        totalAmount,
        amountOfVat: vat
    };

    try {
        const response = await fetch(`http://localhost:3000/bills/${currentEditBill.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedBill)
        });

        if (!response.ok) {
            throw new Error("Sikertelen módosítás");
        }

        document.getElementById("editModal").classList.add("hidden");
        fetchAll();

    } catch (error) {
        alert("Hiba történt a módosítás során");
        console.error(error);
    }
});

document.getElementById("cancelEdit").addEventListener("click", () => {
    document.getElementById("editModal").classList.add("hidden");
});
