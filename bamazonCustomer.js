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
    password: "ashkan021",
    database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function (err) {
    if (err) throw err;
    // run the start function after the connection is made to prompt the user
    start();
});


function start() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        // once you have the items, prompt the user for which they'd like to bid on
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
                    name: "quantity",
                    type: "input",
                    message: "how many?"
                }
            ])
            .then(function (answer) {
                console.log(answer)
                var getId = answer.product_name.indexOf(',');
                var getProductId = answer.product_name.substring(0, getId);
                console.log(getProductId)
            }

            )
    }

    )
}