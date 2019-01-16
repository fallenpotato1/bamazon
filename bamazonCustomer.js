var mysql = require("mysql")
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "bamazon"
})

connection.connect(function (error) {
    if (error) throw (error)
    console.log("Connected as ID " + connection.threadId)
    lookAtProducts()
})

function lookAtProducts() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity > ?", [0], function (error, results) {
            if (error) throw (error)
            results.forEach(function (items) {
                console.log("Name: " + items.product_name + "\nId: " + items.item_id + "\nPrice: $" +
                    items.price + "\n")
            })
            startQuestion()
        }
    )
}

function startQuestion() {
    inquirer
        .prompt([
            {
                name: "itemId",
                type: "input",
                message: "What is the id of the item you would like to purchase?",
                validate: function (input) {
                    if (isNaN(parseInt(input))) {
                        console.log("\nYou must provide a number");
                        return false
                    } return true
                }

            },
            {
                name: "quantity",
                type: "input",
                message: "How many of this item would you like to purchase?",
                validate: function (input) {
                    if (isNaN(parseInt(input))) {
                        console.log("\nYou must provide a number");
                        return false
                    } return true
                }
            }
        ]).then(function (result) {
            nextQuestion(result.itemId, result.quantity)
        })
}

function nextQuestion(theId, theQuantity) {
    connection.query(
        "SELECT * FROM products WHERE item_id = ?", [theId], function (error, results) {
            if (error) throw (error)
            if (results[0].stock_quantity < parseInt(theQuantity)) {
                console.log("There are not enough in stock")
                return startQuestion()
            } else {
                console.log("Your order will be processed")
                updateProcess(results[0].item_id, parseInt(theQuantity), results[0].stock_quantity)
                return
            }
        }
    )
}

function updateProcess(databaseId, soldQuantity, databaseQuantity) {
    connection.query(
        "UPDATE products SET stock_quantity = " + parseInt(databaseQuantity - soldQuantity) + 
        " WHERE item_id = ?", [databaseId], function(error, result) {
            if (error) throw (error)
            connection.end()
        }
    )
}