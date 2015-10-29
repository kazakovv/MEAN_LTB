/**
 * Created by Victor on 10/25/2015.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var usersSchema = new mongoose.Schema({
    email: String,
    password: String,
    username: String,
    kids:[],
    created_at: {type: Date, default: Date.now}
});

var babiesSchema = new mongoose.Schema({
    birthdate: Date,
    name: String,
    boy_girl: Number,
    created_at: {type: Date, default: Date.now},
    parents: [] //todo make it {type: ObjectId, ref: Users}
});



var growthRecords = new mongoose.Schema({
    dateGrowth: Date,
    head_cfr: Number,
    height: Number,
    weight: Number,
    baby_id: { type: Schema.Types.ObjectId, ref: 'Babies' }
});

var feverRecords = new mongoose.Schema({
    dateFever: Date,
    timeFever: Date,
    dose: String,
    medication: String,
    temp: Number,
    baby_id: { type: Schema.Types.ObjectId, ref: 'Babies' }
});

var developmentRecords = new mongoose.Schema({
    dateMilestone: Date,
    milestone: Number,
    note: String,
    baby_id: { type: Schema.Types.ObjectId, ref: 'Babies' }
});

mongoose.model('Users', usersSchema);
mongoose.model('Babies', babiesSchema);
mongoose.model('GrowthRecords', growthRecords);
mongoose.model('FeverRecords', feverRecords);
mongoose.model('DevelopmentRecords', developmentRecords);