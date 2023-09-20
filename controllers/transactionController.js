//FUND WALLET
//FUND WALLET
//FUND WALLET
//FUND WALLET
const express = require("express");
const database = require("../config/database");
const { v4 } = require("uuid");

exports.fundWallet = (req, res, next) => {
  const { id } = req.params;
  const { amount, transactionMode } = req.body;
  var newId = id.replace(":", "");
  //getting the item with the id from mysql
  var requiredItem = "SELECT * fROM account WHERE myId = ?";
  database.query(requiredItem, [newId], async (err, result) => {
    try {
      console.log(result[0].myEmail);
      var total = result[0].totalAmount; //total amount from mysql
      var total_to_float = parseFloat(total);
      var amount_to_float = parseFloat(amount);
      var newAmount = total_to_float + amount_to_float;
      var updateMe = `UPDATE account SET totalAmount=${newAmount},
                           amount=${amount},
                         transactionMode="funded",
                         person="",
                         personEmail=""
                         WHERE myEmail= ?`;
      database.query(updateMe, [result[0].myEmail], async (err, resul) => {
        if (err) {
          console.log(err);
        }
        console.log("updated successfully");
      });
    } catch (err) {
      console.log(err);
    }
  });
};

//SEND MONEY
//SEND MONEY
//SEND MONEY
//SEND MONEY

exports.sendMoney = (req, res, next) => {
  const { amount, email, sender, senderEmail, transaction } = req.body;
  //   console.log(typeof sender)
  const { id } = req.params;
  var newId = id.replace(":", "");
  if (!amount || !email || !sender || !senderEmail) {
    res.json({ message: "pls fill in all spaces" });
    return;
  } else {
    //addition  (reciever's id)
    var checkAccountToAdd = "SELECT * FROM account WHERE myEmail = ?";
    database.query(checkAccountToAdd, [email], async (err, result) => {
      try {
        if (result.length == 0) {
          console.log("user not found");
          res.json({ message2: "user not found" });
          return;
        } else {
          const myIdd = result[0].myId;
          var total = result[0].totalAmount; //total amount from mysql
          var total_to_float = parseFloat(total);
          var amount_to_float = parseFloat(amount);
          var newAmount = total_to_float + amount_to_float;

          var checkAccountToSubtract = "SELECT * FROM account WHERE myId = ?";
          //subtraction (sender)
          database.query(
            checkAccountToSubtract,
            [newId],
            async (err, result1) => {
              var total2 = result1[0].totalAmount; //total amount from mysql
              var total2_to_float = parseFloat(total2);
              if (total2_to_float < amount_to_float) {
                res.json({
                  transaction: "false",
                  message3: "insufficient funds",
                });
              } else {
                var newAmount2 = total2_to_float - amount_to_float;
                console.log(newAmount2);
                var updateMe = `UPDATE account SET totalAmount=${newAmount2},
                                              amount=${amount},
                                              person = '',
                                              personEmail = '',
                                              transactionMode= 'sent'
                                             WHERE myEmail= ?`;
                database.query(
                  updateMe,
                  [result1[0].myEmail],
                  async (err, resul) => {
                    if (err) {
                      console.log(err);
                    }
                    res.json({
                      id: myIdd,
                      amountSent: amount,
                      mode: "recieved successfully",
                    });
                    console.log("updated successfully");
                  }
                );
              }
            }
          );
          //add now!!
          var updateMe = `UPDATE account SET totalAmount=${newAmount},
                              amount=${amount}, 
                              person = '${sender}',
                              personEmail = '${senderEmail}',
                              transactionMode= 'recieved'
                             WHERE myEmail= ?`;
          database.query(updateMe, [result[0].myEmail], async (err, resul) => {
            if (err) {
              console.log(err);
            }
            res.json({
              id: newId,
              amountSent: amount,
              mode: "sent successfully",
              redirect: "true",
            });
            console.log("updated successfully");
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
};

//WITHDRAW MONEY
//WITHDRAW MONEY
//WITHDRAW MONEY
//WITHDRAW MONEY

exports.withdrawMoney = (req, res, next) => {
  const {
    amountToWithdraw,
    transaction,
    myName,
    myEmail,
    myAccNo,
    myBankName,
  } = req.body;
  const { id } = req.params;
  var newId = id.replace(":", "");
  if (!amountToWithdraw || !transaction || !myAccNo || !myBankName) {
    res.json({ message: "fill in empty spaces", stats: false });
    return;
  } else {
    var requiredItem = "SELECT * fROM account WHERE myId = ?";
    database.query(requiredItem, [newId], async (err, result) => {
      try {
        console.log(result[0].myEmail);
        var total = result[0].totalAmount; //total amount from mysql
        var total_to_float = parseFloat(total);
        var amount_to_float = parseFloat(amountToWithdraw);
        if (total_to_float < amount_to_float) {
          res.json({ message2: "insufficient funds", stat2: false });
        } else {
          var newAmount = total_to_float - amount_to_float;
          var updateMe = `UPDATE account SET totalAmount=${newAmount},
                                    amount=${amountToWithdraw},
                                    withdrawalAmount=${amountToWithdraw},
                                    transactionMode="withdrawal",
                                    person="",
                                    personEmail="",
                                    accountNumber=${myAccNo},
                                    bankName='${myBankName}'
                                    WHERE myEmail= ?`;
          database.query(updateMe, [result[0].myEmail], async (err, resul) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`${amountToWithdraw} withdrawn successfully`);
              res.json({ redirect: "true" });
            }
          });
        }
      } catch (err) {
        console.log(err);
      }
    });
  }
};

// route.post('/withdraw/checkUser/:id',async (req, res)=>{
//     const {id}=req.params
//     var newId=id.replace(':' , '')
//         const {amount}=req.body
//         if(!amount){
//             console.log("no body")
//            return;
//         }
//         else{var checkMoney = "SELECT * FROM account WHERE myId = ?";
//             database.query(checkMoney, [newId],(err, valu)=>{
//                const sendersAmount=valu[0].totalAmount
//                if(sendersAmount>=amount){
//                 //   res.send("im here")
//                 res.redirect(`http://localhost:3000/homepage:${valu[0].myId}`)
//                  return;
//                }else{
//                 res.json({ errorPrice:true })
//                }

//         })}
// })
