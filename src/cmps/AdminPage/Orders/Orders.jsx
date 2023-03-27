import React, { useEffect, useState } from 'react';
import { ordersService } from '../../../services/ordersService';
import { productService } from '../../../services/productService';
import { cartService } from '../../../services/cartService';
import Grid from '@material-ui/core/Grid';
import { InputLabel, MenuItem, Select } from '@material-ui/core';
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
  const handelOrders = (event) => {
    const orderParse = JSON.parse(event.target.value);
    const productsLocal = orderParse.order.products;
    setOrder({ ...orderParse });
    setProducts([...productsLocal]);
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
    console.log('order', order);
    console.log('products', products);
    const res = await cartService.updateOrder({ ...order }, [...products]);
    console.log('res!!!!', res);
  };
  return (
    <Grid>
      {orders && orders.length && (
        <>
          <InputLabel id="order-to-select-label">
            נא לבחור מספר הזמנה
          </InputLabel>
          <Select
            labelId="order-to-select-label"
            label="קטגוריה לעריכה"
            name="editOrder"
            value={order ? order.id : ''}
            options={orders}
            onChange={(event) => handelOrders(event)}
            style={{ minWidth: '200px', marginBottom: '20px' }}
          >
            {orders.map((order) => {
              return (
                <MenuItem key={order.id} value={JSON.stringify(order)}>
                  הזמנה מספר - {order.id}
                </MenuItem>
              );
            })}
          </Select>
        </>
      )}
      {order &&
        !!Object.keys(order).length &&
        allProducts &&
        allProducts.length && (
          <div>
            <InputLabel id="product-to-add-label">
              נא לבחור מוצר להוספה
            </InputLabel>
            <Select
              labelId="product-to-add-label"
              style={{ minWidth: '200px', marginBottom: '20px' }}
              label="נא לבחור מוצר להוספה"
              name="addProduct"
              options={allProducts}
              onChange={(event) =>
                setProductToAdd(JSON.parse(event.target.value))
              }
            >
              {allProducts.map((product) => {
                return (
                  <MenuItem key={product.id} value={JSON.stringify(product)}>
                    {product.displayName}
                  </MenuItem>
                );
              })}
            </Select>
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
