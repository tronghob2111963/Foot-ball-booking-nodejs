/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */
const ApiError = require('../api-error');

const itemService = require('../service/item.service');
// const Paginator = require('../service/paginator');

const JSend = require('../jsend');


async function getAllItems(req, res, next) {
 try {
        const { page, limit } = req.query;
        const items = await itemService.getAllItems({ page, limit });
        res.status(200).json(items);
    } catch (error) {
        console.log(error);
  
        return next (new ApiError(500, 'An error occurred while getting items'));
    }
}

async function createItem(req, res, next) {
   if (!req.body?.item_name || typeof req.body.item_name != 'string') {
    return next(new ApiError(400, 'item name should be a non-empty string'));
  }
  try{
    const item = await itemService.createItem({
        ...req.body,
         image_url: req.file ? `/public/img_item/${req.file.filename}` : null,
    })
     return res
            .status(201)
            .set({ 
                Location: `${req.baseUrl}/${item.id}`, 
            })
            .json(
               JSend.success({
                   item,
               })
            );
  }catch(error){
    console.log(error);
    return next (new ApiError(500, 'An error occurred while creating the item'));
  }
}

async function getItemByName(query) {
    let result= {
        contact: [],
        metadata: {
            totalRecords: 0,
            firstPage: 1,
            lastPage: 1,
            page: 1,
            limit: 5,
        }
    }
    try{
       result = await itemService.getItemByName(query);


    }catch(error){
        console.log(error)
        return next(new ApiError(500, 'An error occurred while getting item by name'));
    }
    return res.json(
        JSend.success({
            Item: result.item,
            metadata: result.metadata,
        })
    );
}
async function updateItem(req, res, next) {
    if(Object.keys(req.body).length === 0 && req.file){
        return next(new ApiError(400, 'Data updated no empty'))
    }
    const { items_id } = req.params;
    console.log(items_id);
    try {
        const updated = await itemService.updateItem(items_id, {
            ...req.body,
            image_url: req.file ? `public/img_item/$${req.file.filename}` : null, 
        })
        if(!updated){
            return next(new ApiError(404, 'item not found'));

        }
        return res.json(JSend.success({item: updated}));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, 'Lỗi khi update dữ liệu '));
    }
}

async function deleteItem(req,res, next) {
   const { items_id } = req.params;
   console.log(items_id);
   try {
        const deleted = await itemService.deleteItem(items_id);
        if(!deleted){
            return next (new ApiError(404, 'Item not found'));
        }
        return res.json(JSend.success({ item: deleted }));
   } catch (error) {
        console.log(error);
        return next (new ApiError(500, 'An error occurred while deleting the item'));
   }
}


module.exports = {
    createItem,
    getAllItems,
    getItemByName,
    updateItem,
    deleteItem
};