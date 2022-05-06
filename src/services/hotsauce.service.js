const { getDatabase } = require('../database/mongodb');
const { ObjectId } = require('mongodb');

const collectionName = 'hotsauces';

async function insertHotsauces(hotsauces) {
  const database = await getDatabase();
  const collection = database.collection(collectionName);
  await collection.insertMany(hotsauces);
}

async function getHotsauces(filterParams = {}) {
    // extract and query database based on filterParams
    const { brandNameFilter, sauceNameFilter, descFilter, minHeat, maxHeat } = filterParams;
    const query = await _buildQuery({ brandNameFilter, sauceNameFilter, descFilter, minHeat, maxHeat });
    console.log("## query is: ", query);
    const database = await getDatabase();
    const collection = database.collection(collectionName);
    return await collection.aggregate(query.concat({ $limit: 10000 })).maxTimeMS(30000).toArray();
}

async function getHotsauce(id) {
  const database = await getDatabase();
  const collection = database.collection(collectionName);
  return await collection.findOne({ _id: new ObjectId(id) });
}

async function updateHotsauce(id, Hotsauce) {
  const database = await getDatabase();
  const collection = database.collection(collectionName);
  await collection.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...Hotsauce,
      },
    }
  );
}

async function deleteHotsauce(id) {
  const database = await getDatabase();
  const collection = database.collection(collectionName);
  await collection.deleteOne({ _id: new ObjectId(id) });
}

/**
     * Builds Query based on filter criteria
     * @param {*} filters applied filters object
     * @param {*} type the type of filtering that will be applied
     * @returns db query based on applier filters
     */
 async function _buildQuery(filters) {
    let query = [];

    // will build all filters in parallel and combine to reduce time to build
    await Promise.all(Object.keys(filters).map(async (key) => {
        if (filters[key] != null) {
            switch (key) {
                case "brandNameFilter":
                    query.push({$match: { 'brandName': filters[key] }});
                    break;
                case "sauceNameFilter":
                    query.push({$match: { 'sauceName': filters[key] }});
                    break;
                case "descFilter":
                    query.push({$match: { 'desc': filters[key] }});
                    break;
                case "minHeat":
                    query.push({$match: { 'heat': { $gte: filters[key] }}});
                    break;
                case "maxHeat":
                    query.push({$match: { 'heat': { $lte: filters[key] }}});
                    break;
                default:
                    break;
            }
        }
    }));

    return query;
}

module.exports = {
  insertHotsauces,
  getHotsauces,
  getHotsauce,
  updateHotsauce,
  deleteHotsauce,
};
