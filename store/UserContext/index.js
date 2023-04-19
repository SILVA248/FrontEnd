import { useState, createContext, useContext } from "react";

export const UserContext = createContext();

export const UserContextProvider = ({ children }) => {
  const [logged, setLogged] = useState(false);
  // useReducer

  return (
    <UserContext.Provider value={{ logged, setLogged }}>
      {children}
    </UserContext.Provider>
  );
};

export const useLoggedUser = () => {
  const context = useContext(UserContext);

  return context;
};
