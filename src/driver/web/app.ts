import express from 'express';
import router from './route';
import bodyParser from 'body-parser';
import errorHandler from './middleware/defaultErrorHandler';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api', router);
app.use(errorHandler);

export default app;