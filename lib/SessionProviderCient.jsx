"use client";

import { SessionProvider } from "next-auth/react";

const SessionProviderClient = ({ children }) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default SessionProviderClient;
