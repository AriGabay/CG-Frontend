function store(key, value) {
  const dataLocalStorage = load(key);
  const arr = [];
  if (dataLocalStorage) {
    arr.push(value, { ...dataLocalStorage });
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
