import React from "react";

const Header = ({ title }) => {
  return (
    <>
    <header className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center justify-between"
    style={{
      boxShadow: "0px 6px 24px 0px rgba(18, 96, 44, 0.08)", // Sombra en el borde inferior
      borderBottom: "1px solid rgba(18, 85, 42, 0.12)", // Borde inferior sutil
    }}></header>
      <header className="header-layout bg-white flex items-center justify-between z-5 ">
        <section className="flex justify-start items-center flex-1 self-stretch gap-2">
          <h1 className="text-lg font-semibold text-black">{title}</h1>
        </section>
      </header>
    </>
  );
};

export default Header;
