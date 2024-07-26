import {onRequest, onCall} from "firebase-functions/v2/https";
import {initializeApp} from "firebase-admin/app";
import {FieldValue, getFirestore, Timestamp} from "firebase-admin/firestore";
import * as dotenv from "dotenv";
dotenv.config();

const firebaseConfig = require("../firebaseConfig.json");
const braintree = require("braintree");

initializeApp(firebaseConfig);
const firestore = getFirestore();

const gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_MERCHANT_ID,
  publicKey: process.env.BRAINTREE_PUBLIC_KEY,
  privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});

export const createTransactionPls = onCall(async (request) => {
  const {nonce, amount, uid} = request.data;
  const transaction = await gateway.transaction.sale({
    amount: amount,
    paymentMethodNonce: nonce,
    options: {
      submitForSettlement: true,
    },
  });
  if (!transaction.success) {
    throw new Error("Transaction failed");
  }
  if (transaction.success) {
    await firestore.collection("users").doc(uid).update({
      accountBalance: FieldValue.increment(amount),
    });
  }
  return transaction;
});

export const getClientToken = onCall(async (request) => {
  const token = await gateway.clientToken.generate({});
  return token;
});
// Google Auth Redirect

export const createUser = onRequest(async (request, response) => {
  const {userName, email, uid} = request.body;

  await firestore.collection("users").doc(uid).set({
    accountBalance: 100,
    userName: userName,
    email: email,
    creationDate: Timestamp.now(),
  });
  response.send("User created successfully");
});

export const purchaseItem = onRequest(async (request, response) => {
  const {uid, itemID} = request.body;

  const user = await firestore.collection("users").doc(uid).get();
  const item = await firestore.collection("items").doc(itemID).get();
  const accountBalance = user.data()?.accountBalance;
  const itemPrice = item.data()?.itemPrice;

  if (accountBalance < itemPrice) {
    response.send("Insufficient balance");
    return;
  }
  await firestore.collection("items").doc(itemID).update({
    soldCount: FieldValue.increment(1),
  });
  await firestore.collection("users").doc(uid).update({
    accountBalance: accountBalance - itemPrice,
  });
  response
    .send("Item "+ itemID + " purchased for "+ itemPrice +" successfully");

  await firestore
    .collection("users").doc(uid)
    .collection("transactions").add({
      itemID: itemID,
      itemPrice: itemPrice,
      transactionDate: Timestamp.now(),
    });
});
// paypal integration
