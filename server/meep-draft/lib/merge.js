export default (...args) => {
  return extend({}, ...args);
}

const extend = (obj, ...args) => {
  Object.assign(obj, ...args);
  return obj
};
