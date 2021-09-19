const mongoose = require('mongoose');
const config = require('config');

const db = (process.env.NODE_ENV === 'production') ? process.env.mongoURI : config.get('mongoURI');

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
                        useNewUrlParser: true,
                        // useCreateIndex: true,
                        // useFindAndModify: false,
                        useUnifiedTopology: true
                    });
        console.log('MongoDB connected....');
    } catch (error) {
        console.error(`Error connecting mongoDB: ${error.message}`)
        process.exit(1);
    }
}
// const connectDB = () => {
//     mongoose.connect(db, {
//         useNewUrlParser: true,
//         // useCreateIndex: true,
//         // useFindAndModify: false,
//         useUnifiedTopology: true,
//     }).then(() => console.log('MongoDB connected!'))
//     .catch((error) => {
//         console.error(`Error connecting mongoDB: ${error.message}`)
//         process.exit(1);
//     })
// }

module.exports = connectDB;