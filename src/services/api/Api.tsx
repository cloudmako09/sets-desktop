import axios from "axios";

export const fetchProducts = async () => {
  try {
    const urlEn = "https://tws.toromont.ca/ToromontCAT/ServiceHub/PublicInfo/equipment/used/n001/selloff/smallEquipment";
    const urlFr = "https://tws.toromont.ca/ToromontCAT/ServiceHub/PublicInfo/equipment/used/n001/selloff/smallEquipment?accept-language=fr-CA";

    // if URL contains /fr, load in FR API
    // else, load in EN API
    const urlParts = window.location.pathname.split("/");
    const mainUrl = urlParts.includes("fr") ? urlFr : urlEn;

    const response = await axios.get(mainUrl);
    const products = response.data.groups;
    console.log("Fetched data in API component:", products);
    return products;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
