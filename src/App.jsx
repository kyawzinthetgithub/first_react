import { useEffect, useState } from "react";

// eslint-disable-next-line react/prop-types
const Card = ({ title }) => {
  const [count, setCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  useEffect(() => {
    console.log(`${title} has been ${hasLiked ? 'like' : 'unlike'}`);
  },[hasLiked, title]);
  return (
    <div onClick={() => setCount(count+1)}>
      <h2>{title} - {count}</h2>
      <button
        onClick={() => setHasLiked(!hasLiked)}
      >
        {hasLiked ? "Liked" : "Unliked"}
      </button>
    </div>
  );
};

function App() {
  return (
    <>
      <h2>hello react</h2>
      <Card title="Star War" hasLiked />
      <Card title="Naruto" hasLiked />
      <Card title="Hykuu" hasLiked />
    </>
  );
}

export default App;
