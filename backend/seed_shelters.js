const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Shelter = require('./models/Shelter');

dotenv.config();

const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected.');
        
        await Shelter.deleteMany();
        
        await Shelter.create([
            { name: 'Community Hall Center', location: 'Andheri West', capacity: 500, status: 'Open' },
            { name: 'High School Gymnasium', location: 'Bandra East', capacity: 200, status: 'Full' },
            { name: 'Municipal Relief Camp', location: 'Dadar', capacity: 1000, status: 'Open' },
            { name: 'National Sports Stadium', location: 'Worli', capacity: 5000, status: 'Closed' }
        ]);
        
        console.log('Shelters seeded!');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

seed();
