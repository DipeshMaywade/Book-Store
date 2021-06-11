const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
chai.should();
chai.use(chaiHttp);
