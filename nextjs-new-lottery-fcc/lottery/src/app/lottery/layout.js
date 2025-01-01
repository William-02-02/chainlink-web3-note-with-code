import "../globals.css";

export const metadata = {
  title: "Decentralized Lottery",
  description: "A Decentralized Lottery Smart Contract",
};

export default function Home({ children }) {
  return (
      <html lang="en">
        <body>{children}</body>
      </html>
  );
}
