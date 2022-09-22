import React, { useContext, useEffect } from "react";
import AppContext from "./AppContext";

function ContextContent({ children }: any) {
  const WindowContext: any = window;

  const context: any = useContext(AppContext);

  useEffect(() => {
    if (WindowContext.ethereum) {
      WindowContext.ethereum.on("accountsChanged", (accounts: any) => {
        if (accounts?.length == 0) {
          context.changeContext({ walletAddress: null });
        }
      });
    }
  }, []);

  useEffect(() => {
    try {
      const parsed = JSON.parse(localStorage.getItem("state") || "");
      if (parsed) {
        console.log("saved", parsed);
      }
    } catch (error) {}
  }, []);

  return children;
}

export default ContextContent;
