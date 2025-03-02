import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import Button from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "@/components/CartContext";
import axios from "axios";
import Table from "@/components/Table";
import Input from "@/components/Input";
import { fetchProductsByIdsX } from "@/utils/api";

const ColumnsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  @media screen and (min-width: 768px) {
    grid-template-columns: 1.2fr .8fr;
  }
  gap: 40px;
  margin-top: 40px;
`;

const Box = styled.div`
  background-color: #fff;
  border-radius: 10px;
  padding: 30px;
`;

const ProductInfoCell = styled.td`
  padding: 10px 0;
`;

const ProductImageBox = styled.div`
  width: 70px;
  height: 100px;
  padding: 2px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img {
    max-width: 60px;
    max-height: 60px;
  }
  @media screen and (min-width: 768px) {
    padding: 10px;
    width: 100px;
    height: 100px;
    img {
      max-width: 80px;
      max-height: 80px;
    }
  }
`;

const QuantityLabel = styled.span`
  padding: 0 15px;
  display: block;
  @media screen and (min-width: 768px) {
    display: inline-block;
    padding: 0 10px;
  }
`;

const CityHolder = styled.div`
  display: flex;
  gap: 5px;
`;

export default function CartPage() {
  const { cartProducts, addProduct, removeProduct, clearCart } = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [streetAddress, setStreetAddress] = useState('');
  const [country, setCountry] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (Object.keys(cartProducts).length > 0) {
        const data = await fetchProductsByIdsX(Object.keys(cartProducts));
        if (data && data.length > 0) {
          setProducts(data);
          console.log(data);
        }
      } else {
        setProducts([]);
      }
    }
    fetchData();
  }, [cartProducts]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }
    if (window?.location.href.includes('success')) {
      setIsSuccess(true);
      clearCart();
    }
  }, []);

  function moreOfThisProduct(id) {
    addProduct(id);
  }

  function lessOfThisProduct(id) {
    removeProduct(id);
  }

  async function goToPayment() {
    const response = await axios.post('/api/checkout', {
      name, email, city, postalCode, streetAddress, country,
      cartProducts,
    });
    if (response.data.url) {
      window.location = response.data.url;
    }
  }

  let total = 0;
  for (const productId in cartProducts) {
    if (cartProducts.hasOwnProperty(productId)) {
      const product = products.find(p => p.id === Number(productId));
      const price = product ? product.price : 0;
      const quantity = cartProducts[productId];
      total += price * quantity;
    }
  }

  if (isSuccess) {
    return (
      <>
        <Header />
        <Center>
          <ColumnsWrapper>
            <Box>
              <h1>Thanks for your order!</h1>
              <p>We will email you when your order will be sent.</p>
            </Box>
          </ColumnsWrapper>
        </Center>
      </>
    );
  }

  return (
    <>
      <Header />
      <Center>
        <ColumnsWrapper>
          <Box>
            <h2>Cart</h2>
            {Object.keys(cartProducts).length === 0 && (
              <div>Your cart is empty</div>
            )}
            {products?.length > 0 && (
              <>
                <Table>
                  <thead>
                    <tr className="pb-2 pt-2 border-b-2 border-gray-200">
                      <th className="w-1/2 text-left">Product</th>
                      <th className="w-1/4 text-center !important">Quantity</th>
                      <th className="w-1/4 text-center !important">Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(product => {
                      const quantity = cartProducts[product.id] || 0;
                      return (
                        <tr key={product.id} className="border-b-2 border-gray-100">
                          <ProductInfoCell>
                            <ProductImageBox>
                              <img src={product.images[0]} alt="" />
                            </ProductImageBox>
                            {product.title}
                          </ProductInfoCell>
                          <td className="text-center">
                            <Button onClick={() => removeProduct(product.id)}>-</Button>
                            <QuantityLabel>{quantity}</QuantityLabel>
                            <Button onClick={() => addProduct(product.id)}>+</Button>
                          </td>
                          <td className="text-center">€{(quantity * product.price).toFixed(2)}</td>
                        </tr>
                      );
                    })}
                    <tr>
                      <td></td>
                      <td></td>
                      <td className="text-center">€{(total).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </Table>
              </>
            )}
            <Button black onClick={clearCart}>
              Clear Cart
            </Button>
          </Box>
          {Object.keys(cartProducts).length > 0 && (
            <Box>
              <h2>Order information</h2>
              <Input type="text"
                     placeholder="Name"
                     value={name}
                     name="name"
                     onChange={ev => setName(ev.target.value)} />
              <Input type="text"
                     placeholder="Email"
                     value={email}
                     name="email"
                     onChange={ev => setEmail(ev.target.value)} />
              <CityHolder>
                <Input type="text"
                       placeholder="City"
                       value={city}
                       name="city"
                       onChange={ev => setCity(ev.target.value)} />
                <Input type="text"
                       placeholder="Postal Code"
                       value={postalCode}
                       name="postalCode"
                       onChange={ev => setPostalCode(ev.target.value)} />
              </CityHolder>
              <Input type="text"
                     placeholder="Street Address"
                     value={streetAddress}
                     name="streetAddress"
                     onChange={ev => setStreetAddress(ev.target.value)} />
              <Input type="text"
                     placeholder="Country"
                     value={country}
                     name="country"
                     onChange={ev => setCountry(ev.target.value)} />
              <Button black block
                      onClick={goToPayment}>
                Continue to payment
              </Button>
            </Box>
          )}
        </ColumnsWrapper>
      </Center>
    </>
  );
}