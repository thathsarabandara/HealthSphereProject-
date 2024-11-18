const corsOptions = {
    origin: ['https://api.zoom.us','https://meet.google.com','http://localhost:3000'],
    methods: ['GET', 'POST','PUT'],
    credentials: true,
}; 
const ipapiCorsOptions = {
    origin: ['https://ipapi.co'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    methods: ['GET'],
}
module.exports = {
    corsOptions,
    ipapiCorsOptions
};
