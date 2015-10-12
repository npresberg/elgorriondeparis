var sendgrid = require('sendgrid')(process.env.SENDGRID_USERNAME, process.env.SENDGRID_PASSWORD),
  utils = require('./utils');

var EMAIL = 'hola@elgorriondeparis.com.ar';
var NAME = 'El gorrión de París';
var SUBJECT = 'Contacto';

exports.contact = function(data, done) {
  if (data.phone || data.product) {
    data.message += '\n';
    
    if (data.phone) {
      data.message += '\nteléfono: ' + data.phone;
    }
    if (data.product) {
      data.message += '\nproducto: ' + data.product;
    }
  }
  send(data.email, data.name, EMAIL, NAME, SUBJECT, data.message, done);
};

function send(from, fromName, to, toName, subject, msg, done) {
  sendgrid.send({ 
    from:from, fromname: fromName, to: to, toname: toName,
    replyto: from, date: new Date(), subject: subject, 
    html: utils.toHTML(msg), text: msg
  }, function(err, json) {
    if (err) return done(err);
    
    done();
  });
};
