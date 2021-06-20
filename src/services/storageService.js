function store(key, value) {
  const data = load(key);
  const arr = [];
  if (data) {
    arr.push(value, { ...data });
  } else {
    arr.push({ value });
  }
  sessionStorage.setItem(key, JSON.stringify(arr));
}

function load(key, defaultValue = null) {
  var value = sessionStorage.getItem(key) || defaultValue;
  return JSON.parse(value);
}
export const storageService = {
  store,
  load,
};
