import axios from "axios";

var apiHost = "http://localhost:8090/api/qb_pdf";
// var apiHost = "https://learnathon.bitsathy.ac.in/api/college";

const apiGetRequest = async (url) => {
  try {
    var res = await axios.get(apiHost + url, {
      // headers: {
      //   Authorization: "Bearer " + localStorage.getItem("college"),
      // },
    });

    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return { success: true, err: res.data.error };
    }
  } catch (error) {
    // if (error.response.status !== undefined && error.response.status === 404) {
    //   navigate("/404");
    //   return { success: false, err: error.message };
    // }

    // if (error.response.status !== undefined && error.response.status === 401) {
    //   navigate("/auth/login");
    //   return { success: false, err: error.message };
    // }

    return { success: false, err: error.message };
  }
};

export { apiGetRequest };

const apiPostRequest = async (url, data) => {
  try {
    var res = await axios.post(apiHost + url, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("college"),
      },
    });

    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return { success: true, err: res.data.error };
    }
  } catch (error) {
    return { success: false, err: error.message };
  }
};

const apiPutRequest = async (url, data) => {
  try {
    var res = await axios.put(apiHost + url, data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("college"),
      },
    });

    if (res.data.success) {
      return { success: true, data: res.data.data };
    } else {
      return { success: true, err: res.data.error };
    }
  } catch (error) {
    return { success: false, err: error.message };
  }
};
