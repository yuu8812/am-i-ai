import ST from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Skeleton = () => {
  return (
    <ST containerClassName="flex-1" height={"100%"} baseColor="#f1e3e33c" />
  );
};

export default Skeleton;
