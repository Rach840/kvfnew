"use client";
import React from "react";
import { SessionProvider } from "next-auth/react";
import { UserProvider } from "./user-provider";
import { Header } from "../../shared/ui/header";
import Footer from "../../shared/ui/footer";

export const Providers: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <SessionProvider>
      <UserProvider>
        <Header>
          <main style={{ backgroundColor: '#FEFCF1' }} className="py-10 min-h-lvh flex-1">{children}</main>
        </Header>
        <Footer></Footer>
      </UserProvider>
    </SessionProvider>
  );
};
