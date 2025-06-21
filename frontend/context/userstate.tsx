import { createContext} from "react";

interface UserContextType {
  quizAttempts: number;
  incrementQuizAttempts: () => void;
  User: any;
}

const UserContext = createContext<UserContextType | undefined>(undefined);
export const useUserContext = () => {
  if (!UserContext) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return UserContext;
};
