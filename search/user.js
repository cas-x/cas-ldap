/**
* @Author: BingWu Yang <detailyang>
* @Date:   2016-03-13T16:59:16+08:00
* @Email:  detailyang@gmail.com
* @Last modified by:   detailyang
* @Last modified time: 2016-03-13T18:38:42+08:00
* @License: The MIT License (MIT)
*/


const config = require('../config');
const rp = require('request-promise');
const errors = require('request-promise/errors');
const co = require('co');
const ldap = require('ldapjs');


const headers = {
  authorization: `oauth ${config.cas.secret}`,
};

const search = (type) => {
  return (req, res, next) => {
    co(function *() {
      const query = {};
      // maybe support equal only is enough
      req.filter.map((f) => {
        if (f.type === 'equal') {
          query['field'] = f.attribute;
          query['value'] = f.value;
        }
      });
      const options = {
        url: `${config.cas.domain}${config.cas.api.getUser.endpoint}`,
        method: config.cas.api.getUser.method,
        qs: query,
        json: true,
        headers: headers,
      };
      const resp = yield rp(options).catch(errors.RequestError, (reason) => {
        //should log
      });
      if (!resp) {
        next(new ldap.UnavailableError());
        return res.end();
      }
      if (resp.code !== 0) {
        next(new ldap.NoSuchObjectError(resp.data.value));
        return res.end();
      }
      const user = resp.data.value;
      res.send({
        dn: type == 'static'
          ? `dc=${user.username},${config.dn.static}`
          : `dc=${user.username},${config.dn.dynamic}`,
        attributes: user
      });
      return res.end();
    })
    .catch((err) => {
      console.log(err);
    });
  }
}

module.exports = {
  static: search('static'),
  dynamic: search('dynamic'),
};
