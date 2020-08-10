const app = require ('./app');
const {PORT, NODE_ENV} = require('./config');

app.listen(PORT, () => {
    console.log(`Server is listening in ${NODE_ENV} mode at http://localhost:${PORT}`);
});