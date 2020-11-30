const { axios } = require("./fakeBackend/mock");

const getFeedbackByProductViewData = async (product, actualize = false) => {
  try {
    const { data } = await axios.get(`/feedback?product=${product}`);
    const usersIdsArr = data.feedback.map(({ userId }) => userId);
    const {
      data: { users },
    } = await axios.get(`/users?ids=[${usersIdsArr}]`);

    if (!data.feedback.length) {
      return {
        message: "Отзывов пока нет",
      };
    }

    const feedback = data.feedback.map((feedback) => {
      const date = new Date(feedback.date);
      const user = users.find((u) => u.id === feedback.userId);
      return {
        ...feedback,
        date: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
        user: `${user.name} (${user.email})`,
      };
    });

    feedback.sort((a, b) => new Date(a.date) - new Date(b.date));

    if (actualize) {
      return {
        feedback: feedback.reverse().slice(0, 3).reverse(),
      };
    }

    return {
      feedback,
    };
  } catch (error) {
    return { message: "Такого продукта не существует" };
  }
};

module.exports = { getFeedbackByProductViewData };
