import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { Roboto_Flex } from "next/font/google";
import { ColorModeScript, ColorModeProvider } from "@chakra-ui/color-mode";

const roboto = Roboto_Flex({
    weight: ["400", "500", "700", "800"],
    subsets: ["latin"],
    display: "block",
    variable: "--font-roboto",
});

export default function App({ Component, pageProps }: AppProps) {
    return (
        <main className={`${roboto.variable} font-sans`}>
            <Head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1"
                />
            </Head>
            <style jsx global>{`
                html {
                    font-family: ${roboto.style.fontFamily};
                }
            `}</style>
            <ColorModeProvider>
                <ColorModeScript
                    initialColorMode="dark"
                    key="chakra-ui-no-flash"
                    storageKey="chakra-ui-color-mode"
                />
                <Component {...pageProps} />
            </ColorModeProvider>
        </main>
    );
}
