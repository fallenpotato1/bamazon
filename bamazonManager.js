var mysql = require("mysql")
var inquirer = require("inquirer")

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "fallenpotato",
    database: "bamazon"
})

connection.connect(function (error) {
    if (error) throw (error)
    console.log("Connected as ID " + connection.threadId)
    startQuestion()
})





function startQuestion() {
    inquirer
        .prompt([
            {
                type: "list",
                name: "action",
                message: "What would you like to do?",
                choices: ["View Products", "View Low Inventory", "Add to Inventory", "Add Product"]

            }
        ]).then(function (result) {
            var theAction = result.action.split(" ").join("").toLowerCase()

            switch (theAction) {
                case "viewlowinventory":
                    viewLowInventory()
                    break;
                case "viewproducts":
                    lookAtProducts()
                    break;
                case "addtoinventory":
                    addToInventory()
                    break;
                case "addproduct":
                    addProduct()
                    break;
            }
        })
}

function viewLowInventory() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity < ?", [31], function (error, results) {
            if (error) throw (error)
            results.forEach(function (items) {
                console.log("Name: " + items.product_name + "\nId: " + items.item_id + "\nPrice: $" +
                    items.price + "\n")
            })
        }
    )
    startQuestion()
}


function lookAtProducts() {
    connection.query(
        "SELECT * FROM products WHERE stock_quantity > ?", [0], function (error, results) {
            if (error) throw (error)
            results.forEach(function (items) {
                console.log("Name: " + items.product_name + "\nId: " + items.item_id + "\nPrice: $" +
                    items.price + "\n")
            })
        }
    )
    startQuestion()
}




function addToInventory() {
    inquirer
        .prompt([
            {
                name: "productName",
                type: "input",
                message: "Which product would you like to add to?"
            },
            {
                name: "productAmount",
                type: "input",
                message: "How many would you like to add to the inventory?",
                validate: function (input) {
                    if (isNaN(parseInt(input))) {
                        console.log("\nYou must provide a number");
                        return false
                    } return true
                }
            }
        ]).then(function (input) {
            connection.query(
                "SELECT * FROM products WHERE stock_quantity > ?", [0], function (error, results) {
                    if (error) throw (error)
                    for (var i = 0; i < results.length; i++) {
                        if (results[i].product_name.toLowerCase() === input.productName.toLowerCase()) {
                            return updateInventory(results[i].product_name, input.productAmount, results[i].stock_quantity)
                        }
                    } addToInventory()
                }
            )
        })
}

function updateInventory(productName, productAmount, databaseQuantity) {
    connection.query(
        "UPDATE products SET stock_quantity = " + parseInt(parseInt(databaseQuantity) + parseInt(productAmount)) + 
        " WHERE product_name = ?", [productName], function(error, result) {
            if (error) throw (error)
            startQuestion()
        }
    )
}

function addProduct() {
    inquirer
        .prompt([
            {
                name: "newProduct",
                type: "input",
                message: "What is the name of the product you would like to add?"
            },
            {
                name: "newAmount",
                type: "input",
                message: "What is the amount you would like to add?",
                validate: function(input) {
                    if(isNaN(parseInt(input))) {
                        console.log("you must enter a number")
                        return false
                    } return true
                }
            }, 
            {
                name: "department",
                type: "input",
                message: "Which department will this product be in?"
            },
            {
                name: "productPrice",
                type: "input",
                message: "How much will this product cost?",
                validate: function(input) {
                    if(isNaN(parseFloat(input))) {
                        console.log("you must enter a number")
                        return false
                    } return true
                }
            }
        ]).then(function(input) {
            addNewProduct(input.newProduct, input.department, input.productPrice, input.newAmount)
        })
}

function addNewProduct(newProduct, department, productPrice, newAmount) {
    connection.query(
        "INSERT INTO products (product_name, department_name, price, stock_quantity) VALUES ('" + newProduct 
        + "', '" + department + "', " + productPrice + ", " + newAmount + ")"
    )
    startQuestion()
}


