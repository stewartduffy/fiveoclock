import axios from "axios";

async function getLocations() {
  const url = process.env.REACT_APP_API_URL;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export default getLocations;
