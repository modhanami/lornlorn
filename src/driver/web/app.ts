import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import errorHandler from './middleware/defaultErrorHandler';
import router from './route';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use('/api', router);
app.use(errorHandler);

export default app;