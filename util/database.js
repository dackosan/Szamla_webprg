import Database from "better-sqlite3";

const db = new Database('./data/database.sqlite');

db.prepare(`CREATE TABLE IF NOT EXISTS customers (id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING, address STRIN, taxNumber STRING)`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS sellers (id INTEGER PRIMARY KEY AUTOINCREMENT, name STRING, address STRIN, taxNumber STRING)`).run();
db.prepare(`CREATE TABLE IF NOT EXISTS bills (id INTEGER PRIMARY KEY AUTOINCREMENT, 
                                                sellerId INTEGER,
                                                customerId INTEGER,
                                                billNumber STRING,
                                                creationDate DATE,
                                                dateOfCompletion DATE,
                                                paymentDeadline DATE,
                                                totalAmount INTEGER,
                                                amountOfVat INTEGER,
                                                FOREIGN KEY(sellerId) REFERENCES sellers(id) ON DELETE CASCADE,
                                                FOREIGN KEY(customerId) REFERENCES customers(id) ON DELETE CASCADE)`).run();

export const getSellers = () => db.prepare('SELECT * FROM sellers').all();
export const saveSeller = (name, address, taxNumber) => db.prepare('INSERT INTO sellers (name, address, taxNumber) VALUES (?,?,?)').run(name, address, taxNumber);
export const updateSeller = (id, name, address, taxNumber) => db.prepare('UPDATE sellers SET name = ?, address = ?, taxNumber = ? WHERE id = ?').run(name, address, taxNumber, id);
export const deleteSeller = (id) => db.prepare('DELETE FROM sellers WHERE id =?').run(id);
//export const getSellerTaxNumbers = () => db.prepare('SELECT taxNumber FROM sellers').all();

export const getCustomers = () => db.prepare('SELECT * FROM customers').all();
export const saveCustomer = (name, address, taxNumber) => db.prepare('INSERT INTO customers (name, address, taxNumber) VALUES (?,?,?)').run(name, address, taxNumber);
export const updateCustomer = (id, name, address, taxNumber) => db.prepare('UPDATE customers SET name = ?, address = ?, taxNumber = ? WHERE id = ?').run(name, address, taxNumber, id);
export const deleteCustomer = (id) => db.prepare('DELETE FROM customers WHERE id =?').run(id);
//export const getBuyerTaxNumbers = () => db.prepare('SELECT taxNumber FROM buyers').all();

export const getBills = () => db.prepare('SELECT * FROM bills').all();
export const saveBill = (sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat) => db.prepare('INSERT INTO bills (sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat) VALUES (?,?,?,?,?,?,?,?)').run(sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat);
export const updateBill = (id, sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat) => db.prepare('UPDATE bills SET sellerId = ?, customerId = ?,billNumber = ?,creationDate = ?,dateOfCompletion = ?, paymentDeadline = ?, totalAmount = ?,amountOfVat = ? WHERE id = ?').run(sellerId, customerId, billNumber, creationDate, dateOfCompletion, paymentDeadline, totalAmount, amountOfVat, id);
export const deleteBill = (id) => db.prepare('DELETE FROM bills WHERE id = ?').run(id);

const sellers = [
    { name: 'Tiborcz', address: "Cím1", taxNumber: "11111111-1-11" }
];

const customers = [
    { name: 'Dani', address: "Cím2", taxNumber: "22222222-2-22" },
    { name: 'Hunor', address: "Cím3", taxNumber: "33333333-3-33" },
    { name: 'Rajmond', address: "Cím3", taxNumber: "44444444-4-44" }
];

const creationDateString = `2025-01-03`;
const dateOfCompletionString = `2025-01-10`;
const paymentDeadlineString = `2025-01-17`;

const bills = [
    { sellerId: 1, customerId: 1, billNumber: "11111111-11111111-11111111", creationDate: `${creationDateString}`, dateOfCompletion: `${dateOfCompletionString}`, paymentDeadline: `${paymentDeadlineString}`, totalAmount: 10000, amountOfVat: 27 },
    { sellerId: 1, customerId: 1, billNumber: "22222222-22222222-22222222", creationDate: `${creationDateString}`, dateOfCompletion: `${dateOfCompletionString}`, paymentDeadline: `${paymentDeadlineString}`, totalAmount: 20000, amountOfVat: 27 },
    { sellerId: 1, customerId: 1, billNumber: "33333333-33333333-33333333", creationDate: `${creationDateString}`, dateOfCompletion: `${dateOfCompletionString}`, paymentDeadline: `${paymentDeadlineString}`, totalAmount: 30000, amountOfVat: 27 },
    { sellerId: 1, customerId: 2, billNumber: "44444444-44444444-44444444", creationDate: `${creationDateString}`, dateOfCompletion: `${dateOfCompletionString}`, paymentDeadline: `${paymentDeadlineString}`, totalAmount: 40000, amountOfVat: 27 },
    { sellerId: 1, customerId: 2, billNumber: "55555555-55555555-55555555", creationDate: `${creationDateString}`, dateOfCompletion: `${dateOfCompletionString}`, paymentDeadline: `${paymentDeadlineString}`, totalAmount: 50000, amountOfVat: 27 },
    { sellerId: 1, customerId: 2, billNumber: "66666666-66666666-66666666", creationDate: `${creationDateString}`, dateOfCompletion: `${dateOfCompletionString}`, paymentDeadline: `${paymentDeadlineString}`, totalAmount: 60000, amountOfVat: 27 },
    { sellerId: 1, customerId: 3, billNumber: "77777777-77777777-77777777", creationDate: `${creationDateString}`, dateOfCompletion: `${dateOfCompletionString}`, paymentDeadline: `${paymentDeadlineString}`, totalAmount: 70000, amountOfVat: 27 },
    { sellerId: 1, customerId: 3, billNumber: "88888888-88888888-88888888", creationDate: `${creationDateString}`, dateOfCompletion: `${dateOfCompletionString}`, paymentDeadline: `${paymentDeadlineString}`, totalAmount: 18000, amountOfVat: 27 },
    { sellerId: 1, customerId: 3, billNumber: "99999999-99999999-99999999", creationDate: `${creationDateString}`, dateOfCompletion: `${dateOfCompletionString}`, paymentDeadline: `${paymentDeadlineString}`, totalAmount: 90000, amountOfVat: 27 },
];

//for (const seller of sellers) saveSeller(seller.name, seller.address, seller.taxNumber);
//for (const customer of customers) saveCustomer(customer.name, customer.address, customer.taxNumber);
//for (const bill of bills) saveBill(bill.sellerId, bill.customerId, bill.billNumber, bill.creationDate, bill.dateOfCompletion, bill.paymentDeadline, bill.totalAmount, bill.amountOfVat);