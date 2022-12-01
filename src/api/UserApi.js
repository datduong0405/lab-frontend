import axios from "axios";

export const getAllUser = async () => {
  const url = " http://localhost:8080/api/lab/user/";

  axios.get(url).then((res) => {
    return res.data;
  });
};
