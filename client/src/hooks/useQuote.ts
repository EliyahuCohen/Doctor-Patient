import axios from "axios";
export function useQuote() {
  function getQuote(
    setQuote: React.Dispatch<
      React.SetStateAction<{ id: number; quote: string } | null>
    >
  ) {
    axios
      .get("http://localhost:3001/quotes/get-quoute")
      .then((res) => {
        setQuote(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }
  return { getQuote };
}
