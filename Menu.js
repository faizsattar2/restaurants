const db = require('better-sqlite3')('./db.sqlite');
const Item = require('./Item');
const Restaurant = require("./Restaurant")

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
    update(updates) {
        this.title = updates.title || this.title
        this.items = updates.items || this.items
        const update = db.prepare('UPDATE menus SET title=? WHERE id=?;')
        update.run(this.title, this.id)
    }
    delete() {
        db.prepare('DELETE FROM menus WHERE id = ?;').run(this.id)
        const restaurant = Restaurant.all.find(function(restaurant){
           return restaurant.id == this.restaurant_id 
        },this)
        const index = restaurant.menus.indexOf(this)
        restaurant.menus.splice(index, 1)
    }
}

module.exports = Menu