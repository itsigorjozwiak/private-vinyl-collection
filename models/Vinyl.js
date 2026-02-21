const mongoose = require('mongoose');

const vinylSchema = new mongoose.Schema({
  tytul: { type: String, required: true },
  wykonawca: { type: String, required: true },
  gatunek: String,
  rok: Number,
  okladka: String,
  ocena: { type: Number, min: 0, max: 5, default: 0 }, 
  dataDodania: { type: Date, default: Date.now },
  wlasciciel: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

module.exports = mongoose.model('Vinyl', vinylSchema);