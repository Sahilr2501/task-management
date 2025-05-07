import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
                <meta name="description" content="Task Manager Application" />
                <meta name="theme-color" content="#210F37" />
                <script src="https://cdn.tailwindcss.com"></script>
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
} 