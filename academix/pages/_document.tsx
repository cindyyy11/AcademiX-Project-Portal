import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta
                     content="Final year project management system for students and faculty"
                     name="AcademiX Project Portal"
                />
                <meta
                    content="AcademiX Project Portal"
                    property="og:title"
                />
                <meta
                    content="Final year project management system for students and faculty"
                    property="og:description"
                />
                <meta
                    content="%PUBLIC_URL%/fb-og-image.jpg"
                    property="og:image"
                />
                <meta
                    property="og:url"
                    content="https://your-domain.com"
                />
                <meta
                    property="og:site_name"
                    content="AcademiX Project Portal"
                />
                <meta 
                    property="og:type" content="website" />
                <meta
                    content="AcademiX Project Portal"
                    property="twitter:title"
                />
                <meta
                     content="Final year project management system for students and faculty"
                     property="twitter:description"
                />
                <meta
                    content="%PUBLIC_URL%/twitter-card.jpg"
                    property="twitter:image"
                />
                <meta property="og:type" content="Article" />
                <meta content="summary" name="twitter:card" />
                <meta name="twitter:site" content="@academiX" />
                <meta name="twitter:creator" content="@academiX" />
                <meta property="fb:admins" content="your_facebook_id" />
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1"
                />
                <meta name="msapplication-TileColor" content="#da532c" />
                <meta name="theme-color" content="#ffffff" />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
