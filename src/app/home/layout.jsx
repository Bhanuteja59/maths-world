import React from "react";
import ChatBot from "../chatbot/page"

const Layout = ({ children }) => {
  return (

    <>
      <div>
        {children}
        <ChatBot />
      </div>
    </>

  );
};

export default Layout;
