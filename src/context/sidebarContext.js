import { createContext, useState } from "react";

export const cartContext = createContext();

function Cart({ children }) {
  const [dataForCart, setCartData] = useState([]);
  const [isDrawerOpen, setDrawerOpen] = useState(false);
  return (
    <cartContext.Provider
      value={{ dataForCart, setCartData, isDrawerOpen, setDrawerOpen }}
    >
      {children}
    </cartContext.Provider>
  );
}

export default Cart;
