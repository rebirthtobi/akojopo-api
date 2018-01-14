const mongoose = require('mongoose');
const config = require('./../config');

mongoose.Promise = global.Promise;

mongoose.connect(config.DATABASE, {
    useMongoClient: true,
});

const LocationSchema = new mongoose.Schema({    
    city: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    }
});

const ConnectSchema = new mongoose.Schema({    
    meetup: {
        type: Number,
        default: 0,
        required: true
    },
    eventbrite: {
        type: Number,
        default: 0,
        required: true
    },
    facebook: {
        type: Number,
        default: 0,
        required: true
    },
    google: {
        type: Number,
        default: 0,
        required: true
    },
    twitter: {
        type: Number,
        default: 0,
        required: true
    }
});

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        index: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    location: LocationSchema,
    connect: ConnectSchema,
    created_at: {
        type: Date,
        default: Date.now
    }
});

var User = mongoose.model('user', UserSchema);

module.exports = User;