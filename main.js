const util = require('util');

const Restaurant = require('./Restaurant');
const Menu = require('./Menu');
const Item = require('./Item');

Item.init();
Menu.init();
Restaurant.init();

// const kfc = new Restaurant("KFC");
// const drinks = new Menu(1, "Drinks");
// kfc.addMenu(drinks);

// const coke = new Item(1, 'Coke', 2);
// Restaurant.all[0].menus[0].addItem(coke);

console.log(util.inspect(Restaurant.all, {
    depth: Infinity,
    colors: true
}));

module.exports = { Item, Menu, Restaurant };