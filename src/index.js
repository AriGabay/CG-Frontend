import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import rootReducer from './reducers/rootReducer';
import { prefixer } from 'stylis';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

// if (process.env.NODE_ENV !== 'production') {
//   const axe = require('@axe-core/react');
//   axe(React, ReactDOM, 1000);
// }

const store = configureStore({ reducer: rootReducer });

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

ReactDOM.render(
  <CacheProvider value={cacheRtl}>
    <Provider store={store}>
      <App />
    </Provider>
  </CacheProvider>,
  document.getElementById('root')
);
reportWebVitals();
