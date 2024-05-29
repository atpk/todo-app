import axios from "axios";

export const fetchTodos = async (backendUrl, token) => {
  try {
    const response = await axios.get(`${backendUrl}/todos`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const userInfoData = await Promise.all(
      response.data.map(async (userInfo) => {
        const h = parseFloat(userInfo.height) / 100;
        const bmi = parseFloat(userInfo.weight) / (h * h);
        const genderEncoded = userInfo.gender.toLowerCase() === "male" ? 0 : 1;

        try {
          const predictionResponse = await axios.post(
            "http://54.242.130.105:5000/predict",
            {
              input: [
                [
                  parseFloat(genderEncoded),
                  parseFloat(userInfo.age),
                  parseFloat(bmi),
                ],
              ],
            }
          );

          return {
            ...userInfo,
            diabetes_probability: predictionResponse.data.prediction,
          };
        } catch (predictionError) {
          console.error("Prediction error", predictionError);
          // Return user info without the diabetes_probability if prediction API fails
          return {
            ...userInfo,
            diabetes_probability: 0.1,
          };
        }
      })
    );

    return userInfoData;
  } catch (error) {
    console.error("Fetch todos error", error);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return [];
  }
};
