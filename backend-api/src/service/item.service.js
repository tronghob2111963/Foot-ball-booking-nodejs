/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const knex = require('../database/knex');

const Paginator = require('../service/paginator');

const { unlink } = require('fs'); 

// const JSend = require('../jsend');

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ApiError = require('../api-error')

function itemRepository() {
    return knex('items');
}

function readItem(payload){
    return{
        item_name: payload.item_name,
        price: payload.price,
        stock: payload.stock,
        image_url: payload.image_url,
    }
}

async function getAllItems(params) {
    const { page = 1, limit = 5 } = params;
    return itemRepository().select('item_name', 'price', 'image_url').limit(limit).offset((page - 1) * limit);
}
async function getManyItems(query) {
  const { item_name, page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  let results = await itemRepository()
    .where((builder) => {
      if (item_name) {
        builder.where('item_name', 'like', `%${item_name}%`);
      }
    })
    .select(
      knex.raw('count(item_id) OVER() AS recordCount'),
      'item_name',
      'price',
      'image'
    )
    .limit(paginator.limit)
    .offset(paginator.offset);

  let totalRecords = 0;
  results = results.map((result) => {
    totalRecords = result.recordCount;
    delete result.recordCount;
    return result;
  });
  return {
    metadata: paginator.getMetadata(totalRecords),
    items: results,
  };
}
async function createItem(payload) {
    const item = readItem(payload);
    const [item_id] = await itemRepository().insert(item);
    return {item_id, ...item};
}

async function deleteItem(items_id) {
    const deleteContact = await itemRepository()
        .where('items_id', items_id)
        .select('image_url')
        .first();
    if(!deleteItem){
        return null;
    }
    
    await itemRepository().where('items_id', items_id).del();

    if(
        deleteContact.avatar &&
        deleteContact.avatar.startsWith('/public/uploads')
    )
    return deleteItem;
    
} 
async function updateItem(items_id, payload) {
        const updatedItem = await itemRepository()
            .where('items_id', items_id)
            .select('*')
            .first();
        if (!updatedItem) {
            return null;
        }
        const update = readItem(payload);
        if (!update.image_url) {
            delete update.image_url;
        }
        await itemRepository().where('items_id', items_id).update(update);
        if (
            update.avatar &&
            updatedItem.avatar &&
            update.avatar !== updatedItem.avatar &&
            updatedItem.image_url.startsWith('/public/img_item')
            ) {
                unlink(`.${updatedItem.avatar}`, (error) => {});
            }
                return { ...updatedItem, ...update };
    }
module.exports = {
    getAllItems,
    getManyItems,
    createItem,
    deleteItem,
    updateItem

}

