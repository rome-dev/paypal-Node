var testModel = require('../models/test.model')
var paypal = require('paypal-rest-sdk')
var totalAmount = 0;
class mainController {
    async index() {
        console.log('cosaisndex');
    }
    async subscriptionSuccess(req, res) {
        let result = {
        }
        console.log(req.query.plan)
        let month = req.query.plan;
        let plan = ''
        if (!month) {
            plan = 'Monthly Plan'
        } else if (month == 6) {
            plan = '6 Months Plan'
        } else {
            plan = "Annual Plan"
        }
        res.render('index', { title: `${plan} Subscription was done Successfully`, result: JSON.stringify(result, null, '\t') });
    }
    async success(req, res) {
        let { paymentId, PayerID } = req.query;
        let execute_payment_json = {
            payer_id: PayerID,
            transactions: [{
                amount: {
                    currency: "USD",
                    total: totalAmount
                }
            }]
        }
        paypal.payment.execute(paymentId, execute_payment_json, (err, payment) => {
            if (err) {
                console.log('err', err);
                throw err;
            } else {
                console.log(payment)
                res.render('index', { title: 'Payment Success!', result: { result: JSON.stringify(payment, null, '\t') } });
            }
        })
    }
    async cancel(req, res) {
        res.send('Canceled');
    }
    async oneTimePayment(req, res) {
        let { amount, description } = req.body;
        totalAmount = amount;
        console.log("mainController -> oneTimePayment -> amount", amount)
        let clientID = process.env.CLIENT_ID;
        let secretKey = process.env.SECRET_KEY;
        let { REDIRECT_URL, CANCEL_URL } = process.env
        var create_payment_json = {
            "intent": "sale",
            "payer": {
                "payment_method": "paypal"
            },
            "redirect_urls": {
                "return_url": REDIRECT_URL,
                "cancel_url": CANCEL_URL
            },
            "transactions": [{
                "item_list": {
                    "items": [{
                        "name": "skw first",
                        "sku": "0001",
                        "price": amount,
                        "currency": "USD",
                        "quantity": 1
                    }
                    ]
                },
                "amount": {
                    "currency": "USD",
                    "total": amount
                },
                "description": description
            }]
        };
        paypal.configure({
            mode: 'sandbox', //sandbox or live
            client_id: clientID,
            client_secret: secretKey,
        })
        paypal.payment.create(create_payment_json, function (error, payment) {
            console.log("mainController -> oneTimePayment -> payment", payment)
            if (error) {
                throw error;
            } else {
                let { links } = payment
                for (let i = 0; i < links.length; i++) {
                    if (links[i].rel === 'approval_url') {
                        res.redirect(links[i].href);
                    }
                }
            }
        });
    }
}


module.exports = mainController;