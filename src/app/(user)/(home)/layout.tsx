import ReactDOM from "react-dom";
import FudaFilmRollBg from "./_components/FudaFilmRollBg";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  ReactDOM.preload("/layouts/fuda_filmroll_left.webp", {
    as: "image",
    type: "image/webp",
  });
  ReactDOM.preload("/layouts/fuda_filmroll_right.webp", {
    as: "image",
    type: "image/webp",
  });

  return (
    <>
      <FudaFilmRollBg />
      {children}
    </>
  );
}
