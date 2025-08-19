import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

const app=express();

app.use(cors({
    origin:["http://localhost:5173","http://localhost:5174"],
    credentials:true
}));

app.use(express.json({
    limit:'16kb'
}))

app.use((req, res, next) => {
  console.log('CORS request from:', req.headers.origin);
  next();
});

app.use(express.urlencoded({extended:true,limit:'16kb'}));;

app.use('/public', express.static('public'));
app.use(cookieParser());

// routes 
import userRoute from './routes/user.route.js';
import careerRoute from './routes/career.route.js';
import homeRoute from './routes/home.route.js';
import lifeRoute from './routes/life.route.js';
import contactRoute from './routes/contact.route.js';
import aboutRoute from './routes/about.route.js';
import serviceRoute from './routes/services.route.js';

app.use('/api/v1',userRoute)
app.use('/api/v1/career',careerRoute);
app.use('/api/v1/home',homeRoute);
app.use('/api/v1/life',lifeRoute);
app.use('/api/v1/contact',contactRoute);
app.use('/api/v1/about',aboutRoute);
app.use('/api/v1/service',serviceRoute);



export {app};
