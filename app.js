const express = require('express');
const path = require('path');
const parser = require('body-parser');
const mongoose = require('mongoose');
const Recipe = require('./models/recipe');

const app = express();

app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));


mongoose.connect('mongodb+srv://animalworldng:olajumoke1@recipes-j5xs6.mongodb.net/test', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch((error) => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.error(error);
    });

app.use(express.static('public'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

console.log(path.join(__dirname, 'recipe.html'));

app.get('/', (req, res, next) => {
    console.log(path.join(__dirname, 'recipe.html'));
    // res.sendFile(path.join(__dirname, 'recipe.html'));
    res.end('<h1>Welcome to Recipes.com!</h1>');
});

// GET ALL RECIPES
app.get('/api/recipes', (req, res, next) => {

    Recipe.find().then(
        (recipes) => {
            res.status(200).json(recipes.reverse());
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});


// GET A SPECIFIC RECIPE BY ID
app.get('/api/recipes/:id', (req, res, next) => {

    let id = req.params.id;
    // console.log(id);

    Recipe.findOne({
        _id: id
    }).then(
        (recipe) => {
            res.status(200).json(recipe);
        }
    ).catch(
        (error) => {
            res.status(404).json({
                error: error
            });
        }
    );
});


// // CREATE A NEW RECIPE AND ADD TO DATABASE
app.post('/api/recipes', (req, res, next) => {

    const recipe = new Recipe({
        name: req.body.name,
        caption: req.body.caption,
        type: req.body.type,
        owner: req.body.owner,
    });
    recipe.save().then(
        () => {
            res.status(201).json({
                recipe,
                message: 'New Recipe saved successfully!'
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});


// UPDATE A SPECIFIC RECIPE BY ID
app.put('/api/recipes/:id', (req, res, next) => {

    const id = req.params.id;
    // console.log(typeof id, id);

    const recipe = new Recipe({
        _id: id,
        name: req.body.name,
        caption: req.body.caption,
        type: req.body.type,
        owner: req.body.owner,
    });

    Recipe.updateOne({ _id: id }, recipe).then(
        () => {
            // console.log(recipe);
            res.status(201).json({
                recipe,
                message: 'Recipe updated successfully!'
            });
        }).catch(
            (error) => {
                res.status(400).json({
                    message: 'Recipe not updated!',
                    error: error
                });
            }
        );
});


// DELETE A SPECIFIC RECIPE BY ID
app.delete('/api/recipes/:id', (req, res, next) => {

    const id = req.params.id;
    // console.log(id);

    Recipe.deleteOne({ _id: id }).then(
        () => {
            res.status(200).json({
                message: `Recipe with ID: ${id} Deleted!`
            });
        }
    ).catch(
        (error) => {
            res.status(400).json({
                error: error
            });
        }
    );
});



module.exports = app;