import "./globals.css";

import localFont from "next/font/local";

import { Toaster } from "sonner";

const IranYekan = localFont({
  src: "./fonts/Sahel.woff",
  variable: "--font-iran-yekan",
});

export const metadata = {
  title: "بودجه یار",
  description: "درس مهندسی اینترنت",
};

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning lang="fa" dir="rtl">
      <body className={IranYekan.className}>
        {children}
        <Toaster
          richColors
          closeButton
          theme="light"
          toastOptions={{
            className: IranYekan.className,
          }}
        />
      </body>
    </html>
  );
}
