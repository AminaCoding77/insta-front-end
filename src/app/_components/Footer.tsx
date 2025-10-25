import { HomeIcon, PlusSquare, Search, UserCircle } from "lucide-react";

type propsType = {
  home: () => void;
  search: () => void;
  plus: () => void;
  circle: () => void;
};

const Footer = ({ home, search, plus, circle }: propsType) => {
  return (
    <div className="flex flex-col gap-2 fixed bottom-0 bg-white w-screen">
      <hr></hr>
      <div className="flex justify-between mx-10 mb-2 mt-1">
        <HomeIcon onClick={home} />
        <Search onClick={search} />
        <PlusSquare onClick={plus} />
        <UserCircle onClick={circle} />
      </div>
    </div>
  );
};

export default Footer;
