const express = require('express');
const cheerio = require('cheerio');
var j;
const fs = require('fs');
var j = require('request').jar();
var app = express();
var port = 8004;
var request = require('request').defaults({
      timeout: 30000,
      jar: j
  });

// Add final card creator to bot.
// Will eventually find URL
var url = 'https://yeezysupply.com/products/mens-crepe-boot-taupe/?back=%2Fcollections%2Ffootwear'

function checkout(url) {
  request({
    url: url,
    encoding: 'utf-8',
    gzip: true,
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'Upgrade-Insecure-Requests': '1',
      }
  }, function (err, res, body) {
    if (err || body === undefined) {
      console.log("Error has occured")
    }
    return addToCart()
  })
};

function addToCart() {
  request({
    url: 'https://yeezysupply.com/cart/add.js',
    encoding: 'utf-8',
    method: 'POST',
    gzip: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.8',
      'Upgrade-Insecure-Requests': '1',
      'Referer': 'www.supremenewyork.com'
    },
    form: { 'quantity': '1', 'id': "38844695751" }
  }, function (err, res, body) {
    if (err || body === undefined) {
      console.log("Error has occured");
    }
    // Navigates to CART page
    request({
      url: 'https://yeezysupply.com/cart',
      encoding: 'utf-8',
      method: 'get',
      gzip: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'Upgrade-Insecure-Requests': '1',
        'Referer': url
      }
    }, function (err, res, body) {
      if (err || body == undefined) {
        console.log("Error has occured");
      }
      return beginCheckout()
    })
  })
}

function beginCheckout() {
  request({
    url: 'https://yeezysupply.com/cart',
    followAllRedirects: true,
    encoding: 'utf-8',
    method: 'POST',
    gzip: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.8',
      'Upgrade-Insecure-Requests': '1',
      'Referer': url
    },
    form: {'updates[]': '1', 'checkout': 'CHECK OUT'}

  }, function (err, res, body) {
    if (err || body === undefined) {
      console.log('Error Has Occured')
    }
    var $ = cheerio.load(body);
    var sl = $('.edit_checkout').attr('action');
    var pre = sl.split('/');
    var checkoutID = pre[3];
    var storeID = pre[1];
    // Checkout url:
    var newUrl = `https://yeezysupply.com/${storeID}/checkouts/${checkoutID}`;
    var authToken = $('input[name=authenticity_token]').attr('value');
    return shippingPage(newUrl, checkoutID, storeID, authToken)

})
}

function shippingPage(url, checkID, storID, authtk) {
  request({
    url: url,
    followAllRedirects: true,
    encoding: 'utf-8',
    method: 'POST',
    gzip: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.8',
      'Upgrade-Insecure-Requests': '1',
      'Referer': url
    },
    form: {
      'utf8': '✓',
      '_method': 'patch',
      'authenticity_token': authtk,
      'previous_step': 'contact_information',
      'step': 'shipping_method',
      'checkout[email]': 'tavaris203539@gmail.com',
      'checkout[buyer_accepts_marketing]': 0,
      'checkout[buyer_accepts_marketing]': 1,
      'checkout[shipping_address][first_name]': 'Tavaris',
      'checkout[shipping_address][last_name]': 'Johnson',
      'checkout[shipping_address][address1]': '3423 lockmed dr',
      'checkout[shipping_address][address2]': '',
      'checkout[shipping_address][city]': 'Norcross',
      'checkout[shipping_address][country]': 'US',
      'checkout[shipping_address][province]': 'GA',
      'checkout[shipping_address][zip]': '30092',
      'checkout[shipping_address][phone]': '9728960259',
      'checkout[shipping_address][first_name]': 'Tavaris',
      'checkout[shipping_address][last_name]': 'Johnson',
      'checkout[shipping_address][address1]': '3423 lockmed dr',
      'checkout[shipping_address][address2]': '',
      'checkout[shipping_address][city]': 'Norcross',
      'checkout[shipping_address][country]': 'US',
      'checkout[shipping_address][province]': 'GA',
      'checkout[shipping_address][zip]': '30092',
      'checkout[shipping_address][phone]': '9728960259',
      'checkout[remember_me]': '',
      'checkout[remember_me]': '0',
      'button': '',
      'checkout[client_details][browser_width]': '256',
      'checkout[client_details][browser_height]': '676',
      'checkout[client_details][javascript_enabled]': '1'
    }
  }, function (err, res, body) {
    if (err || body === undefined) {
      console.log("Error has occured");
    }
    request({
      url: url,
      followAllRedirects: true,
      encoding: 'utf-8',
      method: 'get',
      gzip: true,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.8',
        'Upgrade-Insecure-Requests': '1',
        'Referer': url
      },
      qs: {
        'previous_step': 'contact_information',
        'step': 'shipping_method'
      }
    }, function (err, res, body) {
      if (err || body ===undefined) {
        console.log("Error has occured");
      }
      return paymentPage(url, authtk, checkID, storID);
    })
  })
}

function paymentPage(url, authtk, checkID, storID) {
  request({
    url: url,
    followAllRedirects: true,
    encoding: 'utf-8',
    method: 'POST',
    gzip: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.8',
      'Upgrade-Insecure-Requests': '1',
      'Referer': url
    },
    form: {
      'utf8': '✓',
      '_method': 'patch',
      'authenticity_token': authtk,
      'previous_step': 'shipping_method',
      'step': 'payment_method',
      'checkout[shipping_rate][id]': 'shopify-STANDARD%20GROUND%20SHIPPING%205%20TO%207%20DAYS-20.00',
      'button': '',
      'checkout[client_details][browser_width]': '256',
      'checkout[client_details][browser_height]': '676',
      'checkout[client_details][javascript_enabled]': '1'

    }
  }, function (err, res, body) {
    if (err || body === undefined) {
      console.log("Error has occured");
    }
    var $ = cheerio.load(body);
    var newAuth = $('input[name=authenticity_token]').attr('value');
    var payment_gateway = $('input[name="checkout[payment_gateway]"]').eq(0).attr('value');
    return ccSubmit(url, newAuth, payment_gateway, checkID, storID);
  })
}

function ccSubmit(url, authtok, payment_gateway, checkoutID, storeID) {
  request({
    url: 'https://elb.deposit.shopifycs.com/sessions',
    followAllRedirects: true,
    method: 'options',
    encoding: 'utf-8',
    gzip: true,
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36',
      'Accept-Encoding': 'gzip, deflate, br',
      'Accept-Language': 'en-US,en;q=0.8',
      'Access-Control-Request-Headers': 'content-type',
      'Access-Control-Request-Method': 'POST',
      'Connection': 'keep-alive',
      'Upgrade-Insecure-Requests': '1',
      'Orgin': 'https://checkout.shopifycs.com',
      'content-type': 'application/json',
      'Host': 'elb.deposit.shopifycs.com',
      'Referer': `https://checkout.shopifycs.com/number?identifier=${checkoutID}&location=https%3A%2F%2Fcheckout.shopify.com%2F${storeID}%2Fcheckouts%2F${checkoutID}%3Fprevious_step%3Dshipping_method%26step%3Dpayment_method`
    },

  }, function (err, res, body) {
    if (err || body === undefined) {
      console.log("error has occured");
    }
    request({
      url: 'https://elb.deposit.shopifycs.com/sessions',
      followAllRedirects: true,
      method: 'POST',
      encoding: 'utf-8',
      gzip: true,
      headers:{
        'accept': 'application/json',
        'Origin': 'https://checkout.shopifycs.com',
        'Accept-Language': 'en-US,en;q=0.8',
        'Host': 'elb.deposit.shopifycs.com',
        'content-type': 'application/json',
        'Referer': `https://checkout.shopifycs.com/number?identifier=${checkoutID}&location=https%3A%2F%2Fcheckout.shopify.com%2F${storeID}%2Fcheckouts%2F${checkoutID}%3Fprevious_step%3Dshipping_method%26step%3Dpayment_method`,
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
      },
      form: {
        'credit_card': {
          'month': '1',
          'name': 'Tavaris Johnson',
          'number': '5275 1900 1097 3316',
          'verification_value': '405',
          'year': 2021

        }
    }
  }, function (err, res, body) {
      if (err || body === undefined) {
        console.log('Error has occured');
      }
      cc_verify_id = JSON.parse(body).id
      return finalccSubmit(url, authtok, payment_gateway, cc_verify_id);
    })
  })
}


function finalccSubmit(url, authToken, payment_gateway, cc_verify_id) {
  request({
    url: url,
    mehtod: 'post',
    followAllRedirects: true,
    encoding: 'utf-8',
    gzip: true,
    headers: {
      'Origin': 'https://yeezysupply.com',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.8',
      'Referer': url,
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/54.0.2840.98 Safari/537.36'
    },
    form: {
      'utf8':'✓',
      '_method':'patch',
      'authenticity_token': authToken,
      'previous_step': 'payment_method',
      'step': '',
      's': cc_verify_id,
      'checkout[payment_gateway]': payment_gateway,
      'checkout[credit_card][vault]': 'false',
      'checkout[different_billing_address]': 'false',
      'checkout[billing_address][first_name]': '',
      'checkout[billing_address][last_name]': '',
      'checkout[billing_address][address1]': '',
      'checkout[billing_address][address2]': '',
      'checkout[billing_address][city]': '',
      'checkout[billing_address][country]':'United States',
      'checkout[billing_address][province]':'Georgia',
      'checkout[billing_address][zip]': '',
      'checkout[billing_address][phone]': '',
      'checkout[total_price]':'66500',
      'complete':'1',
      'checkout[client_details][browser_width]':'271',
      'checkout[client_details][browser_height]':'676',
      'checkout[client_details][javascript_enabled]':'1'
    }
  }, function (err, res, body) {
    if (err || body === undefined) {
      console.log('Error has occured');
    }
    console.log(res)
  })
}

checkout(url)
app.listen(port);
