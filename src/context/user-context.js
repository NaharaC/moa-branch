import { createStrictContext } from "./createStrictContext.js";

export const [UserContext, useUserContext] = createStrictContext("User", {
  displayName: "UserContext",
  errorMessage: "useUserContext must be used within a UserProvider",
});
