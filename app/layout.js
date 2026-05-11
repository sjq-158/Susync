import "./globals.css";

export const metadata = {
  title: "Susync — Philippines' All-in-One Property Platform",
  description:
    "Philippine's first all-in-one property platform. Find, Negotiate, and Close Property Deals. Fully Online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
