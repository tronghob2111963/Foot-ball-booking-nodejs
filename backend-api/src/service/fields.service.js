/* eslint-disable no-useless-catch */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-require-imports */
const knex = require('../database/knex');

const Paginator = require('../service/paginator');

const { unlink } = require('fs'); 

function fieldRepository() {
    return knex('fields');
}
function readField(payload) {
    return {
        // field_id: payload.field_id,
        field_name: payload.field_name,
        type_fields: payload.type_fields,
        price_per_hour: payload.price_per_hour,
        image_url: payload.image_url,
        status: payload.status
    };
}

async function createFields(payload) {
    const fields = readField(payload);
    const [field_id] = await fieldRepository().insert(fields);
    return {field_id, ...fields}
    
}

async function getFieldsbyType(query) {
  const { type_fields , page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  let results = await fieldRepository()
    .where((builder) => {
      if (type_fields) {
        builder.where('type_fields', 'like', `%${type_fields}%`);
      }
    })
    .select(
      knex.raw('count(field_id) OVER() AS recordCount'),
      'field_id',
      'field_name',
      'type_fields',
      'price_per_hour',
      'image_url',
      'status'
    )
    .limit(paginator.limit)
    .offset(paginator.offset);

  let totalRecords = 0;
  // eslint-disable-next-line no-const-assign
  results = results.map((result) => {
    totalRecords = result.recordCount;
    delete result.recordCount;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    fields: results,
  };
}

async function getFields(field_id) {
  return fieldRepository().where('field_id', field_id).select('*').first();
}

async function updateFields(field_id,payload) {
  const upadatedField = await fieldRepository()
    .where('field_id', field_id)
    .select('*')
    .first();
  if(!upadatedField) {
    return new ApiError(404, 'Không tìm thấy sân');
  }
  const update = readField(payload);
  if(!update.image_url){
    delete update.image_url;

  }
  await fieldRepository().where('field_id', field_id).update(update);
  if(
    update.image_url &&
    updateFields.image_url &&
    update.image_url !== upadatedField.image_url &&
    upadatedField.image_url.startsWith('/public/img_field') 
  ) {
      unlink(`.${upadatedField.image_url}`,(error) => {}); 
  }
  return { ...upadatedField, ...update };
  
}
async function getAllFields() {
  return fieldRepository().select('*');
}
async function deleteField(field_Id) {
  const deleteField = await fieldRepository()
    .where('field_id', field_Id)
    .select('image_url')
    .first();
  if (!deleteField) {
    return null;
  }
  await fieldRepository().where('field_id', field_Id).del();

  if (
    deleteField.avatar &&
    deleteField.avatar.startsWith('/public/uploads')
  ) {
    unlink(`.${deleteField.avatar}`, (error) => {});
  }
  return deleteField;
}

// Hàm xóa tất cả các trường
async function deleteAllFields() {
    const contacts = await fieldRepository().select('image_url');
    await fieldRepository().del();
    contacts.forEach((fields) => {
    if (fields.avatar && fields.image_url.startsWith('/public/uploads')) {
    unlink(`.${fields.avatar}`, (error) => {});
    }
    });
}     

module.exports = {
    createFields, 
    getFieldsbyType,
    getFields,
    updateFields,
    getAllFields,
    deleteField,
    deleteAllFields
}

