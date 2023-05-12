import "./loading.scss";
import Loder from "../../assets/loading.gif";
const Loading = () => {
  return (
    <div className="LoadingPage">
      <div>
        <img src={Loder} alt="loading gif" />
        <h1>Loading Content For You</h1>
      </div>
    </div>
  );
};

export default Loading;
