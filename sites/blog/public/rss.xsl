<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
    <xsl:template match="/">
        <html xmlns="http://www.w3.org/1999/xhtml" lang="en">
            <head>
                <title><xsl:value-of select="/rss/channel/title" /> RSS Feed</title>
                <meta charset="UTF-8" />
                <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <link rel="icon" href="/icon/favicon.ico" sizes="any" />
                <link rel="icon" href="/icon/favicon.svg" type="image/svg+xml" />
                <!-- Colors -->
                <style>
                    body {
                    --bg: #fff;
                    --text: #111;
                    --link: #05b;
                    --variant: #eee;

                    --primary-bg: #def;
                    --primary-text: #013;
                    --selection-bg: #048;
                    --selection-text: #def;
                    }

                    .dark {
                    --bg: #111;
                    --text: #eee;
                    --link: #acf;
                    --variant: #444;

                    --primary-bg: #048;
                    --primary-text: #def;
                    --selection-bg: #def;
                    --selection-text: #013;
                    }

                    ::selection {
                    background-color: var(--selection-bg);
                    color: var(--selection-text);
                    }

                    ::-moz-selection {
                    background-color: var(--selection-bg);
                    color: var(--selection-text);
                    }
                </style>
                <!-- Global style -->
                <style>
                    @import url("https://rsms.me/inter/inter.css");

                    html {
                    font-family: "Inter", sans-serif;
                    }

                    @supports (font-variation-settings: normal) {
                    html {
                    font-family: "Inter var", sans-serif;
                    }
                    }

                    body {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    justify-content: space-between;
                    background-color: var(--bg);
                    color: var(--text);
                    margin: 0;
                    }

                    @supports (scroll-behavior: smooth) {
                    body {
                    scroll-behavior: smooth;
                    }
                    }

                    main {
                    width: 88vw;
                    max-width: 64rem;
                    margin: 0 auto;
                    }

                    main a {
                    text-decoration: none;
                    color: var(--link);
                    }

                    @supports (white-space: break-spaces) {
                    main a {
                    white-space: break-spaces;
                    }
                    }

                    main a:hover {
                    text-decoration: underline;
                    }

                    p {
                    line-height: 1.5rem;
                    text-align: justify;
                    }

                    ::-webkit-scrollbar {
                    width: 1.25rem;
                    }

                    ::-webkit-scrollbar-thumb {
                    background: var(--variant);
                    border-radius: 0.5rem;
                    border: solid 0.375rem var(--bg);
                    }

                    hr {
                    width: 100%;
                    border: none;
                    border-top: solid 0.125rem var(--variant);
                    }
                </style>
                <!-- Header -->
                <style>
                    header {
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    align-items: center;
                    background-color: var(--bg);
                    top: 0;
                    margin: 2vh 1vw;
                    }

                    header h3 {
                    margin: 0;
                    }

                    header h3 a {
                    text-decoration: none;
                    padding: 1rem 0.5rem;
                    border-radius: 0.5rem;
                    transition: all 0.25s;
                    color: var(--text);
                    }

                    header h3 a:hover {
                    color: var(--link);
                    }

                    @media (max-width: 768px) {
                    .gallery {
                    text-align: center;
                    }
                    }

                    .homepage {
                    transition-duration: 0.25s;
                    display: inline-flex;
                    align-items: center;
                    }

                    .homepage:hover {
                    filter: brightness(75%);
                    }

                    .homepage img {
                    height: 1.25rem;
                    }
                </style>
                <!-- Footer -->
                <style>
                    footer {
                    margin-top: 4rem;
                    position: relative;
                    display: flex;
                    bottom: 0;
                    padding: 1rem;
                    justify-content: center;
                    align-items: center;
                    }
                    footer a {
                    text-decoration: none;
                    color: var(--text);
                    padding: 0.5rem;
                    margin: 0 0.25rem;
                    border-radius: 0.5rem;
                    display: grid;
                    transition: all 0.25s;
                    }

                    footer a:hover {
                    color: var(--link);
                    }

                    footer a svg {
                    justify-self: center;
                    align-self: center;
                    height: 1.25rem;
                    }
                </style>
                <!-- Theme Toggle -->
                <style>
                    button {
                    display: none;
                    text-decoration: none;
                    padding: 0.5rem;
                    border-radius: 0.5rem;
                    transition: all 0.25s;
                    color: var(--text);
                    background-color: transparent;
                    border: none;
                    cursor: pointer;
                    }

                    button:hover {
                    color: var(--link);
                    }

                    svg {
                    fill: var(--text);
                    height: 1.25rem;
                    transition: all 0.25s;
                    align-self: center;
                    }

                    svg:hover {
                    fill: var(--link);
                    }

                    .sun {
                    display: none;
                    }

                    .dark .moon {
                    display: none;
                    }

                    .dark .sun {
                    display: inline-block;
                    }
                </style>
                <!-- Main -->
                <style>
                    main {
                    display: flex;
                    flex-direction: column;
                    }

                    .feed-items {
                    columns: 16rem auto;
                    column-gap: 0.5rem;
                    padding-inline-start: 0;
                    }

                    .feed-item {
                    border-radius: 0.5rem;
                    margin-bottom: 0.5rem;
                    break-inside: avoid;
                    padding: 0.75rem;
                    background-color: var(--primary-bg);
                    color: var(--primary-text);
                    }

                    .feed-item h3 {
                    margin: 0;
                    }

                    .feed-item p {
                    margin: 0.5rem 0;
                    text-align: left;
                    }
                </style>
            </head>
            <body>
                <header>
                    <h3>
                        <a href="/">
                            <xsl:value-of select="/rss/channel/title" />
                        </a>
                        <button
                            title="Theme toggle"
                            type="button"
                            id="themeToggle"
                            onclick="document.body.classList.toggle('dark')"
                        >
                            <svg class="moon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M9.598 1.591a.75.75 0 01.785-.175 7 7 0 11-8.967 8.967.75.75 0 01.961-.96 5.5 5.5 0 007.046-7.046.75.75 0 01.175-.786zm1.616 1.945a7 7 0 01-7.678 7.678 5.5 5.5 0 107.678-7.678z"
                                ></path>
                            </svg>
                            <svg class="sun" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                            >
                                <path
                                    fill-rule="evenodd"
                                    d="M8 10.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM8 12a4 4 0 100-8 4 4 0 000 8zM8 0a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0V.75A.75.75 0 018 0zm0 13a.75.75 0 01.75.75v1.5a.75.75 0 01-1.5 0v-1.5A.75.75 0 018 13zM2.343 2.343a.75.75 0 011.061 0l1.06 1.061a.75.75 0 01-1.06 1.06l-1.06-1.06a.75.75 0 010-1.06zm9.193 9.193a.75.75 0 011.06 0l1.061 1.06a.75.75 0 01-1.06 1.061l-1.061-1.06a.75.75 0 010-1.061zM16 8a.75.75 0 01-.75.75h-1.5a.75.75 0 010-1.5h1.5A.75.75 0 0116 8zM3 8a.75.75 0 01-.75.75H.75a.75.75 0 010-1.5h1.5A.75.75 0 013 8zm10.657-5.657a.75.75 0 010 1.061l-1.061 1.06a.75.75 0 11-1.06-1.06l1.06-1.06a.75.75 0 011.06 0zm-9.193 9.193a.75.75 0 010 1.06l-1.06 1.061a.75.75 0 11-1.061-1.06l1.06-1.061a.75.75 0 011.061 0z"
                                ></path>
                            </svg>
                        </button>
                    </h3>
                    <a
                        href="https://zerolimits.dev"
                        class="homepage"
                        target="_blank"
                        title="ZeroLimits.dev"
                    >
                        <img src="https://zerolimits.dev/icon/favicon.svg" alt="Favicon" />
                    </a>
                </header>
                <main>
                    <p>To add the RSS feed for <xsl:value-of select="/rss/channel/title" />, simply
        copy the URL and paste it into your RSS feed reader. Refresh your feed and the posts should
        show up!</p>
                    <hr />
                    <div class="feed-items">
                        <xsl:for-each select="/rss/channel/item">
                            <div class="feed-item">
                                <h3>
                                    <a target="_blank">
                                        <xsl:attribute name="href">
                                            <xsl:value-of select="link" />
                                        </xsl:attribute>
                                        <xsl:value-of select="title" />
                                    </a>
                                </h3>
                                <p>
                                    <xsl:value-of select="description" />
                                </p>
                                <small class="text-gray"> Published: <xsl:value-of
                                        select="pubDate" />
                                </small>
                            </div>
                        </xsl:for-each>
                    </div>
                </main>
                <footer>
                    <a href="https://github.com/noClaps/blog" title="Source Code">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">
                            <path
                                fill-rule="evenodd"
                                fill="currentColor"
                                d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
                            >
                            </path>
                        </svg>
                    </a>
                    <noscript>
                        <a href="/sitemap">Sitemap</a>
                    </noscript>
                </footer>
                <script>
                    document.getElementById('themeToggle').style.display = 'inline-block'
                    if (window.matchMedia("(prefers-color-scheme: dark)").matches === true) {
        document.body.classList.add("dark");
                    }
                </script>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>