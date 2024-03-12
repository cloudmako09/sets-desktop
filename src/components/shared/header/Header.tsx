import { useSearchParams } from "react-router-dom";
import useFilterStore from "../../../store";
import { Data } from "../../../types/types";
import { Dropdown } from "../../features/filters/components/Dropdown";
import { Search } from "../../features/filters/components/search/Search";
import { PriceRange } from "../../features/filters/components/PriceRange";
import { ClearButton } from "../../features/filters/components/ClearFiltersButton";

import "./header.scss";
import { Grid } from "@chakra-ui/react";

interface HeaderProps {
  data: Data[];
  isLoading: boolean;
  error: any;
}

export const Header = ({ data, isLoading, error }: HeaderProps) => {
  // If data is loading/errors, show responses
  if (isLoading) {
    return (
      <p className="header-loading">Loading header data, please wait...</p>
    );
  }

  if (error) {
    return <p>There's been an error!</p>;
  }

  // Bring in global state
  const {
    manufacturerDropdownFilter,
    provinceDropdownFilter,
    cityDropdownFilter,
    priceRangeFilter,
  } = useFilterStore();

  const filteredData = data.map((group) => group.equipments).flat();

  console.log("filtered data from header component:", filteredData);

  const handleDropdownFilterManufacturer = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    useFilterStore.setState({ manufacturerDropdownFilter: e.target.value });
  };

  const handleDropdownFilterProvince = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    useFilterStore.setState({ provinceDropdownFilter: e.target.value });

    // Filter the data based on the selected province
    const filteredCities = filteredData
      .filter((item) => item.state === e.target.value)
      .map((item) => item.city);

    // Set the filtered city dropdown options
    useFilterStore.setState({ cityDropdownFilter: filteredCities[0] || "" });
  };

  const handleDropdownFilterCity = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    useFilterStore.setState({ cityDropdownFilter: e.target.value });

    // Filter the data based on the selected city
    const filteredProvinces = filteredData
      .filter((item) => item.city === e.target.value)
      .map((item) => item.state);

    // Set the filtered province dropdown options
    useFilterStore.setState({
      provinceDropdownFilter: filteredProvinces[0] || "",
    });
  };

  const handlePriceRangeFilter = (value: number | null | undefined) => {
    useFilterStore.setState({ priceRangeFilter: value });
  };

  // Calculate the min price based on the smallest price value from API
  const minPrice = Math.min(
    ...data.map((i) =>
      Math.min(...i.equipments.map((item) => parseFloat(item["price"].text)))
    )
  );

  // Calculate the max price based on the largest price value from API
  const maxPrice = Math.max(
    ...data.map((i) =>
      Math.max(...i.equipments.map((item) => parseFloat(item["price"].text)))
    )
  );

  const [_searchParams, setSearchParams] = useSearchParams();

  // On click of clear button, update the zustand store states for all filters
  // and clear URL
  const handleClearFilter = () => {
    // Clear Zustand store states
    useFilterStore.setState({
      searchFilter: "",
      manufacturerDropdownFilter: "",
      provinceDropdownFilter: "",
      cityDropdownFilter: "",
      currentPage: 0,
      priceRangeFilter: null,
    });

    // Clear query parameters
    setSearchParams(new URLSearchParams());
  };

  return (
    <>
      <p className="intro">
        Small Equipment & Tool Sell-Off only applies to the serial numbers
        indicated. No substitutions, exchanges or returns. F.O.B current
        location. All sales are final. Applicable taxes are not included.
        Pricing and availability are subject to change.
      </p>
      <section className="header-area">
        <Grid
          templateColumns={{
            base: "repeat(1, 1fr)", // For screens below 768px (default Chakra UI base breakpoint)
            md: "repeat(6, 1fr)", // For screens 768px and above
          }}
          gap={6}
          alignItems="center"
        >
          <Search />
          <Dropdown
            data={data}
            value={manufacturerDropdownFilter}
            onChange={handleDropdownFilterManufacturer}
            filterType="manufacturer"
          />
          <Dropdown
            data={data}
            value={provinceDropdownFilter}
            onChange={handleDropdownFilterProvince}
            filterType="state"
          />
          <Dropdown
            data={data}
            value={cityDropdownFilter}
            onChange={handleDropdownFilterCity}
            filterType="city"
          />
          <PriceRange
            value={priceRangeFilter}
            onChange={handlePriceRangeFilter}
            min={minPrice}
            max={maxPrice}
          />
          <ClearButton onClick={handleClearFilter} />
        </Grid>
      </section>
    </>
  );
};
