import { createContext, useEffect, useRef, useState } from "react";

export const GlobalContext = createContext();
export const GlobalStorage = ({ children }) => {

    const [numOnibus,setNumOnibus]=useState("")

    return (
        <GlobalContext.Provider
          value={{
            numOnibus,setNumOnibus
     
          }}
        >
          {children}
        </GlobalContext.Provider>
      );
    };