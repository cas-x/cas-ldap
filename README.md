# CAS-LDAP

A component for support ldap protocol ([RFC 4511](https://tools.ietf.org/html/rfc4511)) integrated with [CAS](https://github.com/detailyang/cas-server). CAS-LDAP can be used to integrate with software which supoort ldap such as  gitlab、jira、confluence、jenkins、gerrit、vpn device、phabricator、grafana. check these [configuration](https://github.com/detailyang/cas-ldap/tree/master/docs/images), you will find the configuration.


[![Node.js version support][shield-node]](#)
[![Build status][shield-build]](#)
[![MIT licensed][shield-license]](#)

Table of Contents
-----------------

  * [Requirements](#requirements)
  * [Development](#development)
  * [Production](#production)
  * [Contributing](#contributing)
  * [License](#license)


Requirements
------------
CAS-LDAP requires the following to run:

[Node.js][node] (personally recommand latest release version)    
[Npm][npm] (normally comes with Node.js)     
[CAS][cas] (personally recommand latest release version)    


Development
-----------
look at config.js, when you in development environment, CAS-LDAP will listen at port 1636 (ldaps) and port 1389 (ldap) and CAS-LDAP will request CAS api http://127.0.0.1:3000 as default. if your CAS server is not on http://127.0.0.1:3000, you can set environment CAS_LDAP_CAS_DOMAIN and CAS_LDAP_CAS_SECRET.

````bash
NODE_ENV=dev node index.js
````

Production
----------



Contributing
------------



License
-------

CAS-LDAP is licensed under the [MIT](#) license.  

[node]: https://nodejs.org/
[npm]: https://www.npmjs.com/
[cas]: https://github.com/detailyang/cas-server
[shield-license]: https://img.shields.io/badge/license-MIT-blue.svg
[shield-node]: https://img.shields.io/badge/node.js%20support-0.10–5-brightgreen.svg
[shield-build]: https://img.shields.io/badge/build-passing-brightgreen.svg
