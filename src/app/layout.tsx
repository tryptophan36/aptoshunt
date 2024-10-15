import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { WalletProvider } from "@/components/WalletProvider";
import { Toaster } from "@/components/ui/toaster";
import { WrongNetworkAlert } from "@/components/WrongNetworkAlert";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ToastContainer} from 'react-toastify';
import "./globals.css";
import 'react-toastify/dist/ReactToastify.css';

export const metadata: Metadata = {
  title: "NextJS Boilerplate Template",
  description: "NextJS Boilerplate Template is a...",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html className="dark" lang="en">
      <body >
      
        <WalletProvider>
          <ReactQueryProvider>
            <div id="root " className="bg-black text-white">
              {children}
              </div>
            <WrongNetworkAlert />
            <Toaster />
            <ToastContainer/>
          </ReactQueryProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
