var mysql = require("mysql");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    start();
});


function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer
            .prompt([
                {
                    name: "product_name",
                    type: "list",
                    choices: function () {
                        var choiceArrayId = [];
                        var choiceArrayName = [];
                        var choiceJoin = []
                        var b = {}
                        for (var i = 0; i < results.length; i++) {

                            choiceJoin.push(results[i].item_id + ',' + results[i].product_name)
                        }
                        return (choiceJoin)
                    },
                    message: "which product would you like to buy?"
                },
                {
                    name: "userQuantity",
                    type: "input",
                    message: "how many?"
                }
            ])
            .then(function (answer) {
                //console.log(answer)
                var getId = answer.product_name.indexOf(',');
                var getProductId = answer.product_name.substring(0, getId);
                dataRetrieve(getProductId, answer.userQuantity);

            }

            )
    }

    )
}

function dataRetrieve(getProductId, userQuantity) {
    connection.query("SELECT * FROM products Where item_id =?", [getProductId], function (err, results) {
        if (err) throw err;
        var resQuantity = results[0].stock_quantity;
        var productPrice = results[0].price
        if (resQuantity >= userQuantity) {
            console.log("Great! Product is available to buy");
            productPurchase(getProductId, resQuantity, userQuantity,productPrice)
        }
        else {
            console.log('Insufficient quantity!')
            connection.end();
            return

        }
    })

}
function productPurchase(getProductId, resQuantity, userQuantity,productPrice) {
    var updateStock = parseInt(resQuantity) - parseInt(userQuantity)
    var TotalPrice = (parseFloat(productPrice,2))*(parseInt(userQuantity));
    connection.query("UPDATE products SET ? WHERE ?",
        [{ stock_quantity: updateStock },
        { item_id: getProductId }
        ],
        function (err, res) {
            if (err) throw err;
            console.log("Remained Product in Stock: " + updateStock)
            console.log("Price per Product: "+productPrice)
            console.log("Total Price: " + TotalPrice)
            connection.end();
        }
    )
}