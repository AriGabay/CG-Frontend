import React, { useEffect, useState } from 'react';
import { ordersService } from '../../../services/ordersService';
import { productService } from '../../../services/productService';
import { cartService } from '../../../services/cartService';
import Grid from '@mui/material/Grid';
import { Autocomplete, TextField } from '@mui/material';
import Controls from '../../Controls/Controls';
import { PriceForUnit } from '../../PriceForUnit/PriceForUnit';
import { PriceForBox } from '../../PriceForBox/PriceForBox';
import { PriceForWeight } from '../../PriceForWeight/PriceForWeight';

export const Orders = () => {
  const [orders, setOrders] = useState();
  const [order, setOrder] = useState({});
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [productToAdd, setProductToAdd] = useState({});
  const [productOrder, setProductOrder] = useState({
    sizeToOrder: null,
    product: null,
    priceToShow: null,
  });
  useEffect(() => {
    ordersService.getOrders(true).then((res) => {
      setOrders(res);
    });
    productService.getAllProducts({ include: true }).then((res) => {
      setAllProducts([...res]);
    });
  }, []);
  useEffect(() => {
    const copyProductToAdd = { ...productToAdd };
    if (productOrder.sizeToOrder && productOrder.priceToShow) {
      copyProductToAdd.sizeToOrder = productOrder.sizeToOrder;
      copyProductToAdd.pricePerSize = productOrder.priceToShow;
      setProductToAdd({ ...copyProductToAdd });
    }
  }, [productOrder]);
  // The Autocomplete hands us the selected order object directly (the old raw
  // Select round-tripped it through JSON.stringify / JSON.parse).
  const handelOrders = (selectedOrder) => {
    if (!selectedOrder) {
      setOrder({});
      setProducts([]);
      return;
    }
    setOrder({ ...selectedOrder });
    setProducts([...selectedOrder.order.products]);
  };
  const trans = (word) => {
    if (word.includes('box')) return word.replace('box', 'קופסה');
    if (word.includes('unit')) return word.replace('unit', 'יחידות');
    if (word.includes('weight')) return word.replace('weight', 'גרם');
  };
  const removeProduct = (productId) => {
    const newProducts = products.filter((product) => product.id !== productId);
    setProducts([...newProducts]);
  };
  const addProduct = () => {
    setProducts((prev) => [...prev, { ...productToAdd }]);
  };

  const updateOrder = async () => {
    await cartService.updateOrder({ ...order }, [...products]);
  };
  return (
    <Grid>
      {orders && orders.length && (
        <Autocomplete
          options={orders}
          value={orders.find((o) => o.id === order?.id) || null}
          onChange={(_event, selectedOrder) => handelOrders(selectedOrder)}
          getOptionLabel={(o) => `הזמנה מספר - ${o.id}`}
          isOptionEqualToValue={(opt, val) => opt.id === val.id}
          noOptionsText="לא נמצאו תוצאות"
          clearText="ניקוי"
          openText="פתיחה"
          closeText="סגירה"
          style={{ minWidth: '260px', marginBottom: '20px' }}
          renderInput={(params) => (
            <TextField
              {...params}
              name="editOrder"
              label="נא לבחור מספר הזמנה"
              variant="outlined"
            />
          )}
        />
      )}
      {order &&
        !!Object.keys(order).length &&
        allProducts &&
        allProducts.length && (
          <div>
            <Autocomplete
              options={allProducts}
              value={
                allProducts.find((p) => p.id === productToAdd?.id) || null
              }
              onChange={(_event, selectedProduct) =>
                setProductToAdd(selectedProduct || {})
              }
              getOptionLabel={(p) => p.displayName || ''}
              isOptionEqualToValue={(opt, val) => opt.id === val.id}
              noOptionsText="לא נמצאו תוצאות"
              clearText="ניקוי"
              openText="פתיחה"
              closeText="סגירה"
              style={{ minWidth: '260px', marginBottom: '20px' }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  name="addProduct"
                  label="נא לבחור מוצר להוספה"
                  variant="outlined"
                />
              )}
            />
            {productToAdd && !!Object.keys(productToAdd).length && (
              <div>
                {productToAdd.Price.priceType === 'unit' ? (
                  <PriceForUnit
                    productOrder={productToAdd}
                    setProductOrder={setProductOrder}
                  />
                ) : null}
                {productToAdd.Price.priceType === 'box' ? (
                  <PriceForBox
                    product={productToAdd}
                    setProductOrder={setProductOrder}
                  />
                ) : null}
                {productToAdd.Price.priceType === 'weight' ? (
                  <PriceForWeight
                    product={productToAdd}
                    setProductOrder={setProductOrder}
                  />
                ) : null}
                <Controls.Button
                  style={{ marginBottom: '20px' }}
                  text={'הוסף מוצר להזמנה'}
                  onClick={() => addProduct()}
                />
              </div>
            )}
          </div>
        )}
      {order &&
        !!Object.keys(order).length &&
        products &&
        products.length &&
        products.map((product) => (
          <div key={order.id + product.id}>
            <h3>{product.displayName}</h3>
            <p>
              הוזמן : {product.sizeToOrder} {trans(product.Price.priceType)}
            </p>
            <p>מחיר : {product.pricePerSize} ₪</p>
            <Controls.Button
              text={'הסר'}
              onClick={() => removeProduct(product.id)}
            />
            <hr />
          </div>
        ))}
      {order && !!Object.keys(order).length && (
        <Controls.Button text={'עדכן הזמנה'} onClick={() => updateOrder()} />
      )}
    </Grid>
  );
};
