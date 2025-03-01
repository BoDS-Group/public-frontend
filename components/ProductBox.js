import styled from "styled-components";
import Button from "@/components/Button";
import CartIcon from "@/components/icons/CartIcon";
import Link from "next/link";
import {use, useContext} from "react";
import {CartContext} from "@/components/CartContext";
import { fetchImageURL } from "@/utils/api";
import { useEffect, useState } from "react";

const ProductWrapper = styled.div`
  
`;

const WhiteBox = styled(Link)`
  background-color: #fff;
  padding: 20px;
  height: 120px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  img{
    max-width: 100%;
    max-height: 80px;
  }
`;

const Title = styled(Link)`
  font-weight: normal;
  font-size:.9rem;
  color:inherit;
  text-decoration:none;
  margin:0;
`;

const ProductInfoBox = styled.div`
  margin-top: 5px;
`;

const PriceRow = styled.div`
  display: block;
  @media screen and (min-width: 768px) {
    display: flex;
    gap: 5px;
  }
  align-items: center;
  justify-content:space-between;
  margin-top:2px;
`;

const Price = styled.div`
  font-size: 1rem;
  font-weight:400;
  text-align: right;
  @media screen and (min-width: 768px) {
    font-size: 1.2rem;
    font-weight:600;
    text-align: left;
  }
`;

export default function ProductBox({
  id,
  title,
  description,
  price,
  images
}) {
  const {addProduct} = useContext(CartContext);
  const [imageURL, setImageURL] = useState([]);
  const url = '/product/'+id;

  async function fetchImage(image_id) {
    const url = await fetchImageURL(image_id);
    if (url) {
      setImageURL(url.image_url);
    }
  }

  useEffect(() => {
    if (images && images.length > 0) {
      fetchImage(images[0]);
    }
    console.log(imageURL);
  }, [images]);

  if (images && images.length > 0) {
    console.log('ProductBox:', id, title, description, price, images[0]);
    // fetchImage(images[0]);
  }

  return (
    <ProductWrapper>
      <WhiteBox href={url}>
        <div>
          {imageURL && <img src={imageURL} alt=""/>}
        </div>
      </WhiteBox>
      <ProductInfoBox>
        <Title href={url}>{title}</Title>
        <PriceRow>
          <Price>
            ${price}
          </Price>
          <div >
            <Button block onClick={() => addProduct(id)} primary outline>
              Add to cart
            </Button>
          </div>
        </PriceRow>
      </ProductInfoBox>
    </ProductWrapper>
  );
}