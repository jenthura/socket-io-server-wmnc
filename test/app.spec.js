const app = require('../src/app');

describe('App', () => {
    it('GET responds with 200 and \'Hello Boilerplate\'', () =>{
        return supertest(app)
        .get('/')
        .expect(200,'Hello Boilerplate');
    });
});

