// DataContext.js
import { createContext, useState } from "react";

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [dataId, setDataId] = useState(null);

  return (
    <DataContext.Provider value={{ dataId, setDataId }}>
      {children}
    </DataContext.Provider>
  );
};
