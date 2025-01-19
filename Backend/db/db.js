const mongoose=require('mongoose')
async function connectToDb() {
    try {
       await mongoose.connect(process.env.DB_CONNECT, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to database');
    } catch (err) {
        console.error('Database connection error:', err);
    }
}

module.exports = connectToDb;