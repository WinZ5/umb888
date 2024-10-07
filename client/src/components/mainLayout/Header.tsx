interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="w-full bg-white py-4 px-8 shadow flex justify-between items-center">
      <h1 className="text-lg font-semibold">
        {title}
      </h1>
    </header>
  );
};

export default Header