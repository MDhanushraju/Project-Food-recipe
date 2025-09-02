import axios from 'axios'

export default async function Api() {
  const response = await axios.get("https://www.themealdb.com/api/json/v1/1/list.php?a=list")
  return response.data.categories  
}
