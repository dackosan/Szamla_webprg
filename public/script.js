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

function openAddPersonModal() {
    document.getElementById("personModal").classList.remove("hidden");
}

function closePersonModal() {
    document.getElementById("personModal").classList.add("hidden");
    document.getElementById("newPerson").reset();
}


document.getElementById("cancelAddPerson").addEventListener("click", () => {
    document.getElementById("personModal").classList.add("hidden");
    document.getElementById("newPerson").reset();
});

document.getElementById("newPerson").addEventListener("submit", async (e) => {
    e.preventDefault();

    const type = document.getElementById("personType").value;
    const name = document.getElementById("newPersonName").value.trim();
    const address = document.getElementById("newPersonAddress").value.trim();
    const taxNumber = document.getElementById("newPersonTaxnumber").value.trim();

    const taxNumberPattern = /^\d{8}-\d{1}-\d{2}$/;
    if (!taxNumberPattern.test(taxNumber)) {
        alert("Hibás adószám formátum! Pl.: 12345678-1-12");
        return;
    }

    const newPerson = { name, address, taxNumber };
    const endpoint = type === "customer" ? "customers" : "sellers";

    try {
        const response = await fetch(`http://localhost:3000/${endpoint}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newPerson)
        });

        if (!response.ok) {
            const errorData = await response.json();
            alert(`Hiba: ${errorData.message}`);
            return;
        }

        const data = await response.json();
        alert(`${type === "customer" ? "Vevő" : "Kiállító"} hozzáadva (ID: ${data.id})`);

        closePersonModal();
        fetchAll();
    } catch (err) {
        console.error(err);
        alert("Hálózati vagy szerverhiba.");
    }
});

async function openEditPersonModal() {
    document.getElementById("editPersonModal").classList.remove("hidden");

    const select = document.getElementById("editPersonSelect");
    select.innerHTML = '<option value="">Válassz...</option>';

    const customers = await fetch("http://localhost:3000/customers").then(res => res.json());
    const sellers = await fetch("http://localhost:3000/sellers").then(res => res.json());

    // Mindkettőt hozzáadjuk a dropdownhoz
    customers.forEach(c => {
        const opt = document.createElement("option");
        opt.value = `customer-${c.id}`;
        opt.textContent = `Vevő: ${c.name}`;
        select.appendChild(opt);
    });

    sellers.forEach(s => {
        const opt = document.createElement("option");
        opt.value = `seller-${s.id}`;
        opt.textContent = `Kiállító: ${s.name}`;
        select.appendChild(opt);
    });
}

// bezárás + reset
function closeEditPersonModal() {
    document.getElementById("editPersonModal").classList.add("hidden");
    document.getElementById("editPersonForm").reset();
}

// ha választunk valakit, automatikusan kitölti a mezőket
document.getElementById("editPersonSelect").addEventListener("change", async function () {
    const value = this.value;
    if (!value) return;

    const [type, id] = value.split("-");
    const person = await fetch(`http://localhost:3000/${type}s/${id}`).then(res => res.json());

    document.getElementById("editPersonName").value = person.name;
    document.getElementById("editPersonAddress").value = person.address;
    document.getElementById("editPersonTaxnumber").value = person.taxNumber;
});

// submit mentéshez
document.getElementById("editPersonForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const selected = document.getElementById("editPersonSelect").value;
    if (!selected) return alert("Nincs kiválasztva személy.");

    const [type, id] = selected.split("-");
    const name = document.getElementById("editPersonName").value.trim();
    const address = document.getElementById("editPersonAddress").value.trim();
    const taxNumber = document.getElementById("editPersonTaxnumber").value.trim();

    const taxNumberPattern = /^\d{8}-\d{1}-\d{2}$/;
    if (!taxNumberPattern.test(taxNumber)) {
        alert("Hibás adószám formátum! Pl.: 12345678-1-12");
        return;
    }

    const updatedPerson = { name, address, taxNumber };

    const response = await fetch(`http://localhost:3000/${type}s/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPerson)
    });

    if (response.ok) {
        alert("Sikeres módosítás!");
        closeEditPersonModal();
        fetchAll();
    } else {
        alert("Sikertelen módosítás.");
    }
});

//ember törlés
async function openDeletePersonModal() {
    document.getElementById("deletePersonModal").classList.remove("hidden");

    const select = document.getElementById("deletePersonSelect");
    select.innerHTML = '<option value="">Válassz...</option>';

    const customers = await fetch("http://localhost:3000/customers").then(res => res.json());
    const sellers = await fetch("http://localhost:3000/sellers").then(res => res.json());

    customers.forEach(c => {
        const opt = document.createElement("option");
        opt.value = `customer-${c.id}`;
        opt.textContent = `Vevő: ${c.name}`;
        select.appendChild(opt);
    });

    sellers.forEach(s => {
        const opt = document.createElement("option");
        opt.value = `seller-${s.id}`;
        opt.textContent = `Kiállító: ${s.name}`;
        select.appendChild(opt);
    });
}

function closeDeletePersonModal() {
    document.getElementById("deletePersonModal").classList.add("hidden");
    document.getElementById("deletePersonForm").reset();
}

// Submit esemény a törlésre
document.getElementById("deletePersonForm").addEventListener("submit", async function (e) {
    e.preventDefault();

    const selected = document.getElementById("deletePersonSelect").value;
    if (!selected) return alert("Nincs kiválasztva személy!");

    const [type, id] = selected.split("-");

    const confirmed = confirm("Biztosan törölni szeretnéd ezt a személyt?");
    if (!confirmed) return;

    const response = await fetch(`http://localhost:3000/${type}s/${id}`, {
        method: "DELETE"
    });

    if (response.ok) {
        alert("Sikeres törlés!");
        closeDeletePersonModal();
        fetchAll(); // ha van ilyen függvényed, frissíti a listát
    } else {
        alert("Sikertelen törlés.");
    }
});