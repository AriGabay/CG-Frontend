const initialState = {
  products: [],
  product: {},
  menuType: null,
  categories: [],
  category: {},
  page: 1,
};
const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_PRODUCTS':
      return { ...state, products: action.payload };
    case 'SET_PRODUCT':
      return { ...state, product: action.payload };
    case 'SET_MENU_TYPE':
      return { ...state, menuType: action.payload };
    case 'SET_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'SET_CATEGORY':
      return { ...state, category: action.payload };
    case 'SET_PAGE':
      return { ...state, page: action.payload };

    default:
      return state;
  }
};

export default rootReducer;
