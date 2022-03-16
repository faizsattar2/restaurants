const Menu = require('./Menu');
const db = require('better-sqlite3')('./db.sqlite');

class Restaurant {
    static all = [];

    static init() {
        // Create the restaurants table if it doesn't exist
        db.prepare(
            `CREATE TABLE IF NOT EXISTS restaurants(
                id INTEGER NOT NULL PRIMARY KEY,
                name TEXT
            );`
        ).run();

        // Select the rows from the database
        const restaurantRows = db.prepare('SELECT * FROM restaurants').all();

        // For each restaurant row...
        for (const restaurantRow of restaurantRows) {
            // Create a Restaurant instance
            const restaurantInstance = new Restaurant(restaurantRow.name, restaurantRow.id);

            // Select the menu rows from the database
            const menuRows = db
                .prepare('SELECT * FROM menus WHERE restaurant_id = ?')
                .all(restaurantRow.id);

            // Associate the menus with the restaurant
            for (const menuRow of menuRows) {
                const menuInstance = new Menu(menuRow.restaurant_id, menuRow.title, menuRow.id);
                restaurantInstance.addMenu(menuInstance);
            }
        }
    }

    constructor(name, id) {
        this.name = name;
        this.menus = [];

        if (id) {
            this.id = id;
        } else {
            const insert = db.prepare('INSERT INTO restaurants (name) VALUES (?);');
            const info = insert.run(this.name);
            this.id = info.lastInsertRowid;
        }

        Restaurant.all.push(this);
    }
    update(updates) {
        this.name = updates.name || this.name
        this.menus = updates.menus || this.menus
        const update = db.prepare('UPDATE restaurants SET name=?,WHERE id=?;')
        update.run(this.name, this.id)
    }
    delete() {
        db.prepare('DELETE FROM restaurants WHERE id = ?;').run(this.id)
        const index = Restaurant.all.index0f(this)
        Restaurant.all.splice(index, 1)
    }

    addMenu(menu) {
        this.menus.push(menu);
    }
}

module.exports = Restaurant;