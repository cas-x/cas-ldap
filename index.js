/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T14:36:24+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-03-13T18:38:15+08:00
* @License: The MIT License (MIT)
*/


const ldap = require('ldapjs');
const rp = require('request-promise');
const errors = require('request-promise/errors');
const co = require('co');

const config = require('./config');


const server = ldap.createServer();
const headers = {
  authorization: `oauth ${config.cas.secret}`,
};

server.on('close', (err) => {
  console.log('ldap server closed');
});

// admin password bind
server.bind(config.dn.admin, (req, res, next) => {
  if (req.version !== 3) {
    return next(new ldap.ProtocolError(`${req.version} is not v3`));
  }
  if (req.credentials !== config.ldap.admin.password) {
    return next(new ldap.InvalidCredentialsError(req.dn.toString()));
  }
  res.end();
});

// dynamic password bind
server.bind(config.dn.dynamic, (req, res, next) => {
  try {
    const id = req.dn.toString().split(',')[0].split('=')[1];
  } catch (e) {
    id = 0;
  }
  const field = !isNaN(parseFloat(id)) && isFinite(id) ? 'id' : 'username';
  const body = {};
  body[field] = id;
  body['password'] = req.credentials;
  body['dynamic'] = true;

  co(function *() {
    const options = {
      url: `${config.cas.domain}${config.cas.api.checkLogin.endpoint}`,
      method: config.cas.api.checkLogin.method,
      body: body,
      json: true,
      headers: headers,
    };
    const resp = yield rp(options).catch(errors.RequestError, (reason) => {
    });
    if (!resp) {
      next(new ldap.UnavailableError());
      return res.end();
    }
    if (resp.code !== 0) {
      next(new ldap.InvalidCredentialsError(resp.data.value));
      return res.end();
    }
    return res.end();
  })
  .catch((err) => {
    next(new ldap.UnavailableError(err.message));
    return res.end();
  })
});

// static password bind
server.bind(config.dn.static, (req, res, next) => {
  try {
    const id = req.dn.toString().split(',')[0].split('=')[1];
  } catch (e) {
    id = 0;
  }
  const field = !isNaN(parseFloat(id)) && isFinite(id) ? 'id' : 'username';
  const body = {};
  body[field] = id;
  body['password'] = req.credentials;

  co (function *() {
    const options = {
      url: `${config.cas.domain}${config.cas.api.checkLogin.endpoint}`,
      method: config.cas.api.checkLogin.method,
      body: body,
      json: true,
      headers: headers,
    };
    const resp = yield rp(options).catch(errors.RequestError, (reason) => {
    });
    if (!resp) {
      next(new ldap.UnavailableError());
      return res.end();
    }
    if (resp.code !== 0) {
      next(new ldap.InvalidCredentialsError(resp.data.value));
      return res.end();
    }
    return res.end();
  })
  .catch((err) => {
    next(new ldap.UnavailableError(err.message));
    return res.end();
  });
});

const search = require('./search');
// search
server.search(config.dn.static, search.user.static);

server.unbind((req, res, next) => {
  res.end();
});

server.listen(config.ldap.port, config.ldap.host, () => {
  console.log('cas-ldap listening at ' + server.url);
});
