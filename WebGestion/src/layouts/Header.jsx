import React from "react";

const Header = ({ title }) => {
  return (
    <>
    <header className="fixed top-0 left-0 right-0 h-16 bg-gray-900 flex items-center justify-between border-b border-teal-500"></header>
      <header className="header-layout bg-gray-900 flex items-center justify-between z-5 border-b border-teal-500">
        <section className="flex justify-start items-center flex-1 self-stretch gap-2">
          <h1 className="text-lg font-semibold text-white">{title}</h1>
        </section>
      </header>
    </>
  );
};

export default Header;
