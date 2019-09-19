const mongoose = require('mongoose');

const recipeSchema = mongoose.Schema({
    name: { type: String, required: true },
    caption: { type: String, required: true },
    type: { type: String, required: true },
    owner: { type: String, required: true },
});

module.exports = mongoose.model('Recipe', recipeSchema);