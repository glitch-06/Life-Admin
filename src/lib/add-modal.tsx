import { createContext, useContext } from "react";

/** Lets any page open the shared "Add something" modal rendered by the app layout. */
export const AddModalContext = createContext<{ open: () => void }>({ open: () => {} });

export function useAddModal() {
  return useContext(AddModalContext);
}
