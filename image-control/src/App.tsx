import './App.css';
import Header from './components/Header/Header';
import ImageRow from './components/ImageRow/ImageRow';
import { useEffect, useState } from 'react';
import axios from 'axios';

type ProductList = {
  name: string;
  pattern: string;
  color: string;
  status: string;
}[];

type ProductStatus = {
  checked: boolean;
  pattern: string;
  color: string;
};

type ListOfProductsStatus = ProductStatus[];

function App() {
  const [index, setIndex] = useState<number>(0);
  const [status, setStatus] = useState<ListOfProductsStatus>([]);
  const [listOfProductUnchecked, setListOfProductUnchecked] =
    useState<ProductList>([]);

  async function getProductsFromApi() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/products`
      );
      const data = response.data;

      const uncheckedProducts = data.filter(
        (product: {
          pattern: string;
          color: string;
          name: string;
          status: string;
        }) => {
          return product.status === 'false';
        }
      );

      setListOfProductUnchecked(uncheckedProducts);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getProductsFromApi();
  }, []);

  return (
    <div className="App">
      <div className="app__container">
        {listOfProductUnchecked.length > 0 ? (
          <Header
            lineList={listOfProductUnchecked}
            index={index}
            setIndex={setIndex}
            status={status}
            setStatus={setStatus}
          />
        ) : null}
        {listOfProductUnchecked.length > 0 ? (
          <ImageRow
            lineList={listOfProductUnchecked}
            index={index}
            setIndex={setIndex}
            status={status}
            setStatus={setStatus}
          />
        ) : null}
      </div>
    </div>
  );
}

export default App;
