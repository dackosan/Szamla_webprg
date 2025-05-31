import express from 'express'
import * as db from "./util/database.js"
import cors from "cors"

const PORT = 3000;

const app = express();
app.use(express.json());
app.use(cors());

//buyer
app.get('/sellers', (req,res) =>{
    try {
        const sellers = db.getSellers();
        res.status(200).json(sellers);
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});
app.post("/sellers", (req, res) => {
    try {
        const { name, address, taxNumber } = req.body;
        if (!name || !address || !taxNumber) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const savedSeller = db.saveSeller(name, address, taxNumber);
        if (savedSeller.changes != 1) {
            return res.status(501).json({ message: "Seller save falied" });
        }

        res.status(201).json({ id: savedSeller.lastInsertRowid, name, address, taxNumber });
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});
app.put("/sellers/:id", (req, res) => {
    try {
        const { name, address, taxNumber } = req.body;
        if (!name || !address || !taxNumber) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const id = +req.params.id;
        const updatedSeller = db.updateSeller(id, name, address, taxNumber);
        if (updatedSeller.changes != 1) {
            return res.status(501).json({ message: "Seller update falied" });
        }

        res.status(200).json({ id, name, address, taxNumber });
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});
app.delete("/sellers/:id", (req, res) => {
    try {
        const id = +req.params.id;
        const deletedSeller = db.deleteSeller(id);
        if (deletedSeller.changes != 1) {
            return res.status(501).json({ message: "Seller delete falied" });
        }

        res.status(200).json({ message: "Delete succesful" });
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

//customer
app.get('/customers', (req,res) =>{
    try {
        const customers = db.getCustomers();
        res.status(200).json(customers);
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});
app.post("/customers", (req, res) => {
    try {
        const { name, address, taxNumber } = req.body;
        if (!name || !address || !taxNumber) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const savedCustomer = db.saveCustomer(name, address, taxNumber);
        if (savedCustomer.changes != 1) {
            return res.status(501).json({ message: "Customer save falied" });
        }

        res.status(201).json({ id: savedCustomer.lastInsertRowid, name, address, taxNumber });
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});
app.put("/customers/:id", (req, res) => {
    try {
        const { name, address, taxNumber } = req.body;
        if (!name || !address || !taxNumber) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const id = +req.params.id;
        const updatedCustomer = db.updateCustomer(id, name, address, taxNumber);
        if (updatedCustomer.changes != 1) {
            return res.status(501).json({ message: "Customer update falied" });
        }

        res.status(200).json({ id, name, address, taxNumber });
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});
app.delete("/customers/:id", (req, res) => {
    try {
        const id = +req.params.id;
        const deletedCustomer = db.deleteCustomer(id);
        if (deletedCustomer.changes != 1) {
            return res.status(501).json({ message: "Customer delete falied" });
        }
        
        res.status(200).json({ message: "Delete succesful" });
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

//bills
app.get("/bills", (req, res) => {
    try {
        const bills = db.getBills();
        res.status(200).json(bills);
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});
app.post("/bills", (req, res) => {
    try {
        const { sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat } = req.body;
        if (!sellerId || !customerId || !billNumber || !creationDate || !dateOfCompletion || !paymentDeadline || !totalAmount || !amountOfVat) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const savedBill = db.saveBill(sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat);

        if (savedBill.changes != 1) {
            return res.status(501).json({ message: "Bill save falied" });
        }
        res.status(201).json({ id: savedBill.lastInsertRowid, sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat });
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});
app.put("/bills/:id", (req, res) => {
    try {
        const { sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat } = req.body;
        if (!sellerId || !customerId || !billNumber || !creationDate || !dateOfCompletion || !paymentDeadline || !totalAmount || !amountOfVat) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const id = +req.params.id;
        const updatedBill = db.updateBill(id, sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat);
        if (updatedBill.changes != 1) {
            return res.status(501).json({ message: "Bill update falied" });
        }
        res.status(200).json({ id, sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat });
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});
app.delete("/bills/:id", (req, res) => {
    try {
        const id = +req.params.id;
        const deleteBill = db.deleteBill(id);
        if (deleteBill.changes != 1) {
            return res.status(501).json({ message: "Bill delete falied" });
        }
        res.status(200).json({ message: "Delete succesful" });
    }
    catch (err) {
        res.status(500).json({ message: `${err}` });
    }
});

app.listen(PORT, () =>{
    console.log(`Server runs on ${PORT}`);
});