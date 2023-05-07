import axios from "axios";
import { useSelector } from "react-redux";
import { UserType } from "../features/userSlice";
export function useFeedbacks() {
  const { token } = useSelector(
    (state: { userSlice: UserType }) => state.userSlice
  );
  const instance = axios.create({
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  async function getFeedbacks(
    doctorId: string,
    setFetched: React.Dispatch<React.SetStateAction<boolean>>,
    setFeedbacks: React.Dispatch<React.SetStateAction<any>>
  ) {
    instance
      .get(`http://localhost:3001/feedbacks/feedbacks/${doctorId}`)
      .then((res) => {
        setFeedbacks(res.data);
        setFetched(true);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  async function postFeedback(
    feedback: string,
    doctorId: string,
    rating: number
  ) {
    instance
      .post(`http://localhost:3001/feedbacks/post-feedback`, {
        rating,
        feedback,
        doctorId,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return { getFeedbacks, postFeedback };
}
