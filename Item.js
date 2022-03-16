const db = require('better-sqlite3')('./db.sqlite');

class Item {
  static init() {
    db.prepare(
      `CREATE TABLE IF NOT EXISTS items(
        id INTEGER NOT NULL PRIMARY KEY,
        menu_id INTEGER,
        dish TEXT,
        price INTEGER
      );`
    ).run();
  }

  constructor(menu_id, dish, price, id) {
    this.menu_id = menu_id;
    this.dish = dish;
    this.price = price;

    if (id) {
      this.id = id;
    } else {
        const insert = db.prepare('INSERT INTO items (menu_id, dish, price) VALUES (?, ?, ?);');
        const info = insert.run(this.menu_id, this.dish, this.price);
        this.id = info.lastInsertRowid;
    }
  }
}

module.exports = Item;