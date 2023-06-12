import { createContext, useEffect, useState } from "react";
import axios from "axios";

// Create a new context named UserContext
export const UserContext = createContext({});

// Define a component named UserContextProvider
export function UserContextProvider({ children }) {
  // Define state variables for username and id using useState hook
  const [username, setUsername] = useState(null);
  const [id, setId] = useState(null);

  // Fetch user profile data when the component mounts
  useEffect(() => {
    // Send an HTTP GET request to '/profile' endpoint using Axios
    axios.get("/profile").then((response) => {
      // Update the state variables with the received data
      setId(response.data.userId);
      setUsername(response.data.username);
    });
  }, []);

  // Render the UserContext.Provider component
  return (
    <UserContext.Provider value={{ username, setUsername, id, setId }}>
      {children}
    </UserContext.Provider>
  );
}
