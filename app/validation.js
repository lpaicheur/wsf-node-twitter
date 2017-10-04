const sendResponse = (error) => {
  if (error) {
    return { success: false, error };
  }
  return { success: true };
};

const checkType = (value, type) => {
  // eslint-disable-next-line valid-typeof
  if (typeof value !== type) {
    return false;
  }
  return true;
};

exports.username = (value) => {
  const schema = {
    label: 'username',
    type: 'string',
    min: 3,
    max: 120,
  };

  if (!checkType(value, schema.type)) {
    return sendResponse(`${schema.label} is not valid`);
  }

  if (value.length < schema.min) {
    return sendResponse(`${schema.label} is too short`);
  }
  if (value.length > schema.max) {
    return sendResponse(`${schema.label} is too long`);
  }

  return sendResponse();
};

exports.email = (value) => {
  const schema = {
    label: 'email',
    type: 'string',
  };

  if (!checkType(value, schema.type)) {
    return sendResponse(`${schema.label} is not valid`);
  }

  return sendResponse();
};

exports.first_name = (value) => {
  const schema = {
    label: 'first_name',
    type: 'string',
    min: 1,
    max: 120,
  };

  if (!checkType(value, schema.type)) {
    return sendResponse(`${schema.label} is not valid`);
  }

  if (value.length < schema.min) {
    return sendResponse(`${schema.label} is too short`);
  }
  if (value.length > schema.max) {
    return sendResponse(`${schema.label} is too long`);
  }

  return sendResponse();
};

exports.last_name = (value) => {
  const schema = {
    label: 'last_name',
    type: 'string',
    min: 1,
    max: 120,
  };

  if (!checkType(value, schema.type)) {
    return sendResponse(`${schema.label} is not valid`);
  }

  if (value.length < schema.min) {
    return sendResponse(`${schema.label} is too short`);
  }
  if (value.length > schema.max) {
    return sendResponse(`${schema.label} is too long`);
  }

  return sendResponse();
};

// exports.age = (value) => {
//   const validation = {
//     type: 'number',
//     min: 13,
//     max: 130,
//   };

//   if (!checkType(value, validation.type)) {
//     return sendResponse('Age is not valid');
//   }
//   if (value < validation.min) {
//     return sendResponse('Age is too short');
//   }
//   if (value > validation.max) {
//     return sendResponse('Age is too long');
//   }
//   return sendResponse();
// };

// exports.is_enabled = (value) => {
//   const validation = {
//     type: 'boolean',
//   };

//   if (!checkType(value, validation.type)) {
//     return sendResponse('is_enabled is not valid');
//   }
//   return sendResponse();
// };

// exports.tweet = (value) => {
//   const validation = {
//     type: 'string',
//     min: 1,
//     max: 280,
//   };

//   if (!checkType(value, validation.type)) {
//     return sendResponse('Tweet is not valid');
//   }
//   if (value.length < validation.min) {
//     return sendResponse('Tweet is too short');
//   }
//   if (value.length > validation.max) {
//     return sendResponse('Tweet is too long');
//   }

//   return sendResponse();
// };
