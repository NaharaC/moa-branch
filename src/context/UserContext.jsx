import { useUser } from "../hooks/useUser";
import { UserContext } from "./user-context.js";

export const UserProvider = ({ children }) => {
  const userState = useUser();
  return <UserContext.Provider value={userState}>{children}</UserContext.Provider>;
};
