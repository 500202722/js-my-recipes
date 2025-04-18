const router = require('express').Router()
const { getCollection, ObjectId } = require('../../../dbconnect')

let collection = null
const getRecipes = async () => {
    if (!collection) collection = await getCollection('RecipeAPI', 'Recipes')
    return collection
}

router.get('/', async (request, response) => {
    const collection = await getRecipes()
    const data = await collection.find().toArray()
    if (data) response.send(data.map(({ id, title, image, prepTime, difficulty }) => ({ id, title, image, prepTime, difficulty })))
    else response.send({ error: { message: `Could not find any recipes.` }})
})

router.get('/recipe/:id', async (request, response) => {
    const { id } = request.params
    const collection = await getRecipes()
    const found = await collection.findOne({ id: parseInt(id) })
    if (found) response.send(found)
    else response.send({ error: { message: `Could not find recipe with id: ${id}` }})
})

router.post('/recipe/add', async (request, response) => {
    const { title, image, description, ingredients, instructions, prepTime, difficulty } = request.body
    const collection = await getRecipes()
    const { acknowledged, insertedId } = await collection.insertOne({ title, image, description, ingredients, instructions, prepTime, difficulty })
    response.send({ acknowledged, insertedId,  title, image, description, ingredients, instructions, prepTime, difficulty })
})

module.exports = router