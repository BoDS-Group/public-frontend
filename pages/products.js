import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import ProductsGrid from "@/components/ProductsGrid";
import { fetchRecentProducts } from "@/utils/api";
import { useEffect, useState, useRef } from "react";

const Title = styled.h2`
  font-size: 2rem;
  margin: 30px 0 20px;
  font-weight: normal;
`;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const newProducts = await fetchRecentProducts(page);
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        setLoading(false);
      }
    }

    fetchData();
  }, [page]);

  const lastProductElementRef = useRef();

  useEffect(() => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setPage((prevPage) => prevPage + 1);
      }
    });

    if (lastProductElementRef.current) {
      observer.current.observe(lastProductElementRef.current);
    }
  }, [loading]);

  return (
    <>
      <Header />
      <Center>
        <Title>All products</Title>
        <ProductsGrid products={products} />
        <div ref={lastProductElementRef} />
        {loading && <p>Loading more products...</p>}
      </Center>
    </>
  );
}