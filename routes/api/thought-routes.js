const router = require('express').Router(); 
const {
    getAllThoughts,
    getThoughtById,
    addThought,
    updateThought,
    removeThought

} = require('../../controllers/Thought-controller');

router.route('/').get(getAllThoughts).post(addThought);

router.route('/:thoughtId').get(getThoughtById).put(updateThought).delete(removeThought);

module.exports = router; 

