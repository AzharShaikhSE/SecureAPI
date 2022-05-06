const express = require('express');
const router = express.Router();
const {
  insertHotsauces,
  getHotsauces,
  getHotsauce,
  updateHotsauce,
  deleteHotsauce,
} = require('../services/hotsauce.service');
const { jwtCheck } = require('../middleware/authentication.middleware');

// check api health
router.get('/test', (req, res) => {
  res.send('Yup, it works!');
});

// allow only authenticated users to access the following below endpoints
// router.use(jwtCheck);

// get all hotsauces
router.get('/:brandNameFilter?/:sauceNameFilter?/:descFilter?/:minHeat?/:maxHeat?', jwtCheck, async (req, res) => {
    const filterParams = req.params;
  const hotsauces = await getHotsauces(filterParams);
  res.send(hotsauces);
});

// get an hotsauce by id
router.get('/:id', jwtCheck, async (req, res) => {
  const hotsauce = await getHotsauce(req.params.id);
  res.json(hotsauce);
});

// create an hotsauce
router.post('/', jwtCheck, async (req, res) => {
  const hotsauce = req.body;
  await insertHotsauces(hotsauce);
  res.send({ message: 'New hotsauced inserted', hotsauce });
});

// update an hotsauce
router.put('/:id', jwtCheck, async (req, res) => {
  const id = req.params.id;
  const hotsauce = req.body;
  await updateHotsauce(id, hotsauce);
  res.send({ message: 'hotsauce updated', hotsauce });
});

// delete an hotsauce
router.delete('/:id', jwtCheck, async (req, res) => {
  const id = req.params.id;
  await deleteHotsauce(id);
  res.send({ message: 'hotsauce deleted' });
});

module.exports = router;
