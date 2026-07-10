import "./globals.css";

export const metadata = {
  title: "TaxHub — Knowledge Assistant",
  description:
    "A grounded, source-cited Q&A assistant for German tax law.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-paper text-ink font-body antialiased">
        {children}
      </body>
    </html>
  );
}
