import axios from "axios";
import { useEffect } from "react";

function TestAPI() {
  useEffect(() => {
    axios.get("https://jsonplaceholder.typicode.com/posts")
      .then(res => console.log(res.data))
      .catch(err => console.log(err));
  }, []);

  return <h1>API Test</h1>;
}

export default TestAPI;