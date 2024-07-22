import {createContext, useContext} from 'react';

export const BuilderContext = createContext({
  productBuilderSettings: {},
  productBuilderData: {},
  updateProductBuilderData: () => {},
  updateProductBuilderSettings: () => {},
});

export const ProductBuilderProvider = ({children, providerValues}) => {
  return (
    <BuilderContext.Provider value={providerValues}>
      {children}
    </BuilderContext.Provider>
  );
};

export function useProductBuilderContext() {
  return useContext(BuilderContext);
}
