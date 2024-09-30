import React, {useState, createContext, ReactNode} from 'react';

// Define the type for your user context
type AuthContextType = {
  user: any; // You can replace `any` with the actual type of your user data, e.g., `User | null`
  setUser: React.Dispatch<React.SetStateAction<any>>; // Update `any` to the correct type
};

// Create the AuthenticatedUserContext with an empty default value
export const AuthenticatedUserContext = createContext<
  AuthContextType | undefined
>(undefined);

// Define the props type for the provider
type AuthenticatedUserProviderProps = {
  children: ReactNode;
};

// Create the AuthenticatedUserProvider component
export const AuthenticatedUserProvider = ({
  children,
}: AuthenticatedUserProviderProps) => {
  const [user, setUser] = useState<any>(null); // Change `any` to the actual type of the user

  return (
    <AuthenticatedUserContext.Provider value={{user, setUser}}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};
