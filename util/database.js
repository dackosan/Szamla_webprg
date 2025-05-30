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

export const getUsers = () => db.prepare(`SELECT * FROM users`).all();
export const getUser = (id) => db.prepare(`SELECT * FROM users WHERE id = ?`).get(id);
export const saveUser = (name) => db.prepare(`INSERT INTO users (name) VALUES (?)`).run(name);
export const updateUser = (id, name) => db.prepare(`UPDATE users SET name = ? WHERE id = ?`).run(name, id);
export const deleteUser = (id) => db.prepare(`DELETE FROM users WHERE id = ?`).run(id);

export const getBlogs = () => db.prepare(`SELECT * FROM blogs`).all();
export const getBlog = (id) => db.prepare(`SELECT * FROM blogs WHERE id = ?`).get(id);
export const saveBlog = (userId, title, category, content, creationDate, lastModifiedDate) => 
    db.prepare(`INSERT INTO blogs (userId, title, category, content, creationDate, lastModifiedDate) VALUES (?,?,?,?,?,?)`).run(userId, title, category, content, creationDate, lastModifiedDate);
export const updateBlog = (id, userId, title, category, content, creationDate, lastModifiedDate) => 
    db.prepare(`UPDATE blogs SET userId = ?, title = ?, category = ?, content = ?, creationDate = ?, lastModifiedDate = ? WHERE id = ?`).run(userId, title, category, content, creationDate, lastModifiedDate, id);
export const deleteBlog = (id) => db.prepare(`DELETE FROM blogs WHERE id = ?`).run(id);

const users = [
    {name: 'Tas'},
    {name: 'Bajó'},
    {name: 'Sziszi'}
];

const modifyDateString = new Date().toLocaleString('hu-HU');

const blogs = [
    {userId: 1, title: 'Életrajz', category: 'CV', content: 'Tas élete', creationDate: `${new Date("2025-05-23T14:30:00.000Z").toLocaleString('hu-HU')}`, lastModifiedDate: modifyDateString},
    {userId: 1, title: 'Motivációs Levél', category: 'CV', content: 'Tas motivációs levele', creationDate: `${new Date("2025-05-23T14:30:00.000Z").toLocaleString('hu-HU')}`, lastModifiedDate: modifyDateString},
    {userId: 2, title: 'Liberalizmus', category: 'Esszé', content: 'Bajó rövid esszéje', creationDate: `${new Date("2025-05-23T14:30:00.000Z").toLocaleString('hu-HU')}`, lastModifiedDate: modifyDateString},
    {userId: 2, title: 'A bethleni konszolidáció', category: 'Esszé', content: 'Bajó hosszú esszéje', creationDate: `${new Date("2025-05-23T14:30:00.000Z").toLocaleString('hu-HU')}`, lastModifiedDate: modifyDateString},
    {userId: 3, title: 'Góg és Magóg...', category: 'Vers', content: 'Memoriter', creationDate: `${new Date("2025-05-23T14:30:00.000Z").toLocaleString('hu-HU')}`, lastModifiedDate: modifyDateString},
    {userId: 3, title: 'Az a fekete folt', category: ' Novella', content: 'Kötelező olvasmány', creationDate: `${new Date("2025-05-23T14:30:00.000Z").toLocaleString('hu-HU')}`, lastModifiedDate: modifyDateString},
];

//for(const user of users) saveUser(user.name);
//for(const blog of blogs) saveBlog(blog.userId, blog.title, blog.category, blog.content, blog.creationDate, blog.lastModifiedDate);