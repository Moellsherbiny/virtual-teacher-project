import React from "react";

function Footer() {
  const date = new Date();
  const currentYear = date.getFullYear();
  return (
    <footer className="fixed w-full left-0 bottom-0 bg-white/70 dark:bg-white/10 backdrop-blur-lg">
      <p className="text-center dark:text-white text-muted-foreground text-sm font-light">
        All Copyrights &copy; Reserved To Virtual Teacher {currentYear}{" "}
      </p>
    </footer>
  );
}

export default Footer;
