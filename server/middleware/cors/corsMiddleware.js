const corsOptions = {
    origin: ['https://api.zoom.us','https://meet.google.com','http://localhost:3000'],
    methods: ['GET', 'POST'],
    credentials: true,
}; 

module.exports = corsOptions;