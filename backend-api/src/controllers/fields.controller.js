/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable no-undef */

const fieldsService = require('../service/fields.service');
const  ApiError = require('../api-error');
// const { first, limit } = require('../database/knex');

const JSend = require('../jsend');


async function createFields(req, res, next) {
  if (!req.body?.field_name || typeof req.body.field_name != 'string') {
    return next(new ApiError(400, 'Field name should be a non-empty string'));
  }
  try {
          const field = await fieldsService.createFields({
            ...req.body,
            image_url: req.file ? `/public/img_field/${req.file.filename}` : null,
        });
        return res
            .status(201)
            .set({ 
                Location: `${req.baseUrl}/${field.id}`, 
            })
            .json(
                JSend.success({ 
                    field, 
                })
            );
  } catch (error) {
    console.log(error);
    return next(
      new ApiError(500, 'An error occurred while creating the field')
    );
  }
}
async function getAllFields(req, res, next) {
  try {
    const fields = await fieldsService.getAllFields();
    return res.json(fields);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'Error retrieving fields'));
  }
}

async function getFieldsbyType(req, res, next) {
    let result = {
        fields: [],
        metada: {
         totalRecords: 0,
         firstPage: 1,
         lastPage: 1,
         page: 1,
         limit: 5,   
        },
    };
    //   let fields = [];
  try {
    result = await fieldsService.getFieldsbyType(req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while getting fields by type'));
  }
  return res.json(JSend.success({
    fields: result.fields,
    metadata: result.metadata
  }));
    
}


async function getFields(req, res, next) {
    const { field_id } = req.params;
    console.log(field_id);
    try {
       const fields = await fieldsService.getFields(field_id);
       console.log(fields);
       if(!fields) {
            console.log(error);
            return next(new ApiError(404, 'Field not found'));
       }
       return res.json(JSend.success({ fields }));
    } catch (error) {
        console.log(error);
        return next(new ApiError(500, `Error retrieving fields with id=${field_id}`));
    }
}
async function updateFields(req, res, next) {
  if(Object.keys(req.body).length === 0 && !req.file) {
    return next(new ApiError(400, 'Không được để trống dữ liệu'));
  }
  const { field_id } = req.params;
  console.log(field_id);

  try {
    const updated = await fieldsService.updateFields(field_id, {
      ...req.body,
      image_url: req.file ? `/public/uploads/${req.file.filename}` : null,
    });

    if(!updated) {
      return next(new ApiError(404, 'Field not found'));
    }
    return res.json(JSend.success({ field: updated }));
    
  } catch (error) {
      console.log(error);
      return next(new ApiError(500, `LỖI KHI UPDATE DỮ LIỆU`));
  }
}
// Hàm xóa 1 trường theo id
async function deleteField(req, res, next) {
  const { field_id } = req.params;
  try {
    const deleted = await fieldsService.deleteField(field_id);
    if(!deleted) {
      console.log(error);
      return next(new ApiError(404, 'Field not found'));
    }
    return res.json(JSend.success({ field: deleted }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while deleting the field'));
  }
}

// Hàm xóa tất cả các trường
async function deleteAllFields(req, res, next) {
  try {
    await fieldsService.deleteAllFields();
    return res.json(JSend.success());
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, 'An error occurred while deleting all fields'));
  }
}

// Hàm xóa 1 trường theo id


module.exports = {
    createFields,
    getFieldsbyType,
    getFields,
    updateFields,
    deleteField,
    deleteAllFields,
    getAllFields
};
