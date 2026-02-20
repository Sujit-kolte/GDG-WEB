import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "GDG Website",
  description: "Main website with admin panel",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
