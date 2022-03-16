const db = require('better-sqlite3')('./db.sqlite');
const Item = require('./Item');

class Menu {
    static init() {
        // Create the menus table if it doesn't exist
        db.prepare(
            `CREATE TABLE IF NOT EXISTS menus(
                id INTEGER NOT NULL PRIMARY KEY,
                restaurant_id INTEGER,
                title TEXT
            );`
        ).run()
    }

    constructor(restaurant_id, title, id) {
        this.restaurant_id = restaurant_id;
        this.title = title;
        this.items = [];

        if (id) {
            this.id = id;
            const itemRows = db.prepare('SELECT * FROM items WHERE menu_id = ?').all(this.id);
            for (const itemRow of itemRows) {
                const item = new Item(itemRow.menu_id, itemRow.dish, itemRow.price, itemRow.id);
                this.addItem(item);
            }
        } else {
            const insert = db.prepare('INSERT INTO menus (restaurant_id, title) VALUES (?, ?);');
            const info = insert.run(this.restaurant_id, this.title);
            this.id = info.lastInsertRowid;
        }
    }

    addItem(item) {
        this.items.push(item);
    }
}
module.exports = Menu