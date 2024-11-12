import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

const useSessionId = () => {
  const [sessionId, setSessionId] = useState(null);

  useEffect(() => {
    const newSessionId = uuidv4();
    setSessionId(newSessionId);
    console.log(newSessionId);
  }, []);

//   const resetSessionId = () => {
//     setSessionId(uuidv4());
//   };

  return { sessionId };
};

export default useSessionId;
