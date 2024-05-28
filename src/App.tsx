import { ChakraProvider, Container } from "@chakra-ui/react";
import "@fontsource-variable/montserrat";
import { useQuery } from "react-query";
import { fetchProducts } from "../src/services/api/Api";

import { Header } from "./components/shared/header/Header";
import { MainTable } from "./components/shared/Table";

import "../src/styles/typography.scss";
import "../src/styles/general.scss";
import "../src/styles/variables.scss";

function App() {
  // Fetch the data
  const { data, isLoading, error } = useQuery("products", fetchProducts, {
    // Set stale/cache time
    staleTime: 1000 * 60 * 5, 
    cacheTime: 1000 * 60 * 10,
    refetchOnWindowFocus: true,
  });

  return (
    <>
      <ChakraProvider>
        <Container maxW="1200px">
          <Header data={data} isLoading={isLoading} error={error} />
          <MainTable data={data} isLoading={isLoading} error={error} />
        </Container>
      </ChakraProvider>
    </>
  );
}

export default App;

if (process.env.NODE_ENV !== "development") {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
  console.warn = () => {};
}
