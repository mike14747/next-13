# next-13

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=f5f5f5 'Next.js')
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=f5f5f5 'ESLint')
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=f5f5f5 'Vercel')

The purpose of this app is for me to explore the new features in next.js version 13 (new app folder, etc) using typescript.

I've created this app using **create-next-app** following these steps:

-   Created a repo at github with a .gitignore file and without a README.md file.
-   Cloned the app to my local computer.

```bash
git clone git@github.com:mike14747/next-13.git
```

-   I installed the next app from outside the **next-13** folder.

```bash
npx create-next-app
```

-   You'll be prompted to enter a name for your new next.js app. I entered the project name (which installed the project into the already existent next-13 folder), chose to use Typescript, said yes to use ESLint, no to Tailwind and the following occurred:

1.  These npm packages were installed: **"@types/node": "18.15.11", "@types/react": "18.0.35", "@types/react-dom": "18.0.11", "eslint": "8.38.0", "eslint-config-next": "13.3.0", "next": "13.3.0", "react": "18.2.0", "react-dom": "18.2.0", "typescript": "5.0.4"** (all as regular dependencies). I don't know why create-next-app doesn't install eslint and eslint-config-next as devDependencies.
2.  These files were created at the root of the project: **package.json**, **package-lock.json**, **next.config.js**, **.eslintrc.json**, **tsconfig.json**, **next-env.d.ts** files were created in the project folder.
3.  These folders were created: **/app**, **/app/api**, **/public**

-   Then, I made these changes (uninstalling the things that should be devDependencies, then reinstalling the devDependencies as devDependencies):

```bash
npm un @types/node @types/react @types/react-dom eslint eslint-config-next typescript

npm i -D @babel/core @babel/eslint-parser @types/node @types/react @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint eslint-config-next typescript
```

I added these folders manually:

```bash
mkdir styles public/images app/components types lib lib/api
```

You can now run the development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

---

## Setting up ESLint

I set my **.eslintrc.json** file to look like this:

```json
{
    "env": {
        "browser": true,
        "es2021": true,
        "node": true
    },
    "extends": ["eslint:recommended", "next", "next/core-web-vitals"],
    "rules": {
        // rules go here
    }
}
```

Then I added my standard rules to it.

---

## Initial folders/files

I added my base and global css files to the **/styles** folder (**mg_base.css** and **globals.css**).

Emptied the items from the root of the **/public** folder, then moved the default favicon to /public/images.

Emptied the **/app/api** folder.

I got rid of most of the content of **/app/page.tsx**... making it just a basic functional component displaying a simple message.

Now I have a basic barebones app with a single page.

---

## The new /app folder

Now that the app is working and the point of this app was to check out the new **/app** folder.

The new routing system in next 13's /app folder is "folder based" and NOT file based. Each folder is a route as long as it contains a page.tsx file within it.

You can group folders by placing both of them within a parent folder whose name is enclosed by parenthesis (eg: /app/(group1)/posts and /app/(group1)/authors).


...and the initial layout.js file like this:

```tsx
import { ReactNode } from 'react';
import { Inter } from 'next/font/google';
import Header from './components/Header';
import Footer from './components/Footer';

import '@/styles/mg_base.css';
import '@/styles/globals.css';

const defaultFont = Inter({
    variable: '--font-default',
    subsets: ['latin'],
});

export const metadata = {
    title: 'next-13',
    description: 'Testing the new appDir',
    viewport: {
        width: 'device-width',
        initialScale: 1,
        maximumScale: 2,
    },
    icons: {
        icon: [
            {
                url: '/images/favicon.ico',
                sizes: '32x32',
            },
        ],
    },
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
            <body id="appWrapper" className={defaultFont.variable}>
                <Header />

                <div className="page-container">
                    {children}
                </div>

                <Footer />
            </body>
        </html>
    );
}
```

The layout component seems to serve the same purpose as the previous Layout component and the \_app.js plus \_document.js page files.

If you set the page title (plus meta info, favicon, etc) in the root layout.tsx file, it will provide the <head> info for the entire app's pages. However, you can include meta info in as many pages as you'd like as long as they are server components. This info will override what is in layout.tsx.

All components in the **/app** folder are **Server Component**s by default.

You only need to mark components as **use client** when they use client hooks such as useState or useEffect. It's best to leave components that do not depend on client hooks without the directive so that they can automatically be rendered as a Server Component when they aren't imported by another Client Component.

```js
'use client';

import { useState } from 'react';
```

You should also mark components as '**use client**' if you add interactivity and event listeners (onClick(), onChange(), etc).

> **NOTE**: You cannot import a server component into a client component. You can pass a Server Component as a child or prop of a Client Component. You can do this by wrapping both components in another Server Component.

```js
// /app/ClientComponent.js

'use client';

export default function ClientComponent({ children }) {
    return <>{children}</>;
}
```

...and

```js
// /app/page.js

// you can pass a Server Component as a child or prop of a Client Component.
import ClientComponent from './ClientComponent';
import ServerComponent from './ServerComponent';

// pages are Server Components by default
export default function Page() {
    return (
        <ClientComponent>
            <ServerComponent />
        </ClientComponent>
    );
}
```

---

## fetch() in client components

For now, it's not recommend to use fetch() in client components in next.js version 13.

So, this will cause errors because of the abortController and fetch currently causing multiple rerenders:

```js
import { useEffect } from 'react';

export default function Page() {
    useEffect(() => {
        const abortController = new AbortController();

        fetch('/api/public', { signal: abortController.signal })
            .then((res) => res.json())
            .then((data) => console.log({ data }))
            .catch((error) => console.error(error));

        return () => abortController.abort();
    }, []);
    return <>...page</>;
}
```

It seems like, from my usage, that fetch() in client components is only bad for fetching dynamic data. I may be wrong about that.

I'm successfully using fetch() in client component for POST, PUT and DELETE methods.

---

## api routes

All api routes have been moved into the **/app/api** folder. The /pages folder has been completely removed.

---

## Environment variables

I added a .env file with settings for mongodb, next-auth and email.

---

## mongodb

I installed the native mongodb driver:

```bash
npm i mongodb
```

Then added my standard connection file (**/lib/mongodb.ts**).

---

## Testing with Jest and @testing-library/react

Install the necessary packages.

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom
```

Create a **jest.config.js** file at the root of your app with the following contents:

```js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
});

// Add any custom config to be passed to Jest
/** @type {import('jest').Config} */
const customJestConfig = {
    // Add more setup options before each test is run
    // setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
    moduleDirectories: ['node_modules', '<rootDir>/'],

    // If you're using [Module Path Aliases](https://nextjs.org/docs/advanced-features/module-path-aliases),
    // you will have to add the moduleNameMapper in order for jest to resolve your absolute paths.
    // The paths have to be matching with the paths option within the compilerOptions in the tsconfig.json
    // For example:

    moduleNameMapper: {
        '@/(.*)$': '<rootDir>/src/$1',
    },
    testEnvironment: 'jest-environment-jsdom',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
```

Add jest to your eslint env in eslintrc.json:

```json
"env": {
        "browser": true,
        "es2021": true,
        "node": true,
        "jest": true
    },
```

Create a **\_\_tests\_\_** folder at the root of your app.

---

## Issues

I'm having a problem with my LoginForm redirect not working properly when deployed on Vercel. It's getting stuck in a redirect loop... though it works fine locally whether in dev mode or with a build.

---

![next-13](next_13.svg 'next-13')
![by Mike Gullo](author.svg 'by Mike Gullo')

-   Live version: https://next-13.vercel.app/
-   This project's github repo: https://github.com/mike14747/next-13
-   Me on github: https://github.com/mike14747
-   Contact me at: mgullo.dev@gmail.com

![GitHub last commit](https://img.shields.io/github/last-commit/mike14747/next-13?style=for-the-badge)
