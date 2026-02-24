import FudaFilmRollBg from "./_components/FudaFilmRollBg";

interface HomeLayoutProps {
  children: React.ReactNode;
}

export default function HomeLayout({ children }: HomeLayoutProps) {
  return (
    <>
      <FudaFilmRollBg />
      {children}
    </>
  );
}
