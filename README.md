# next-13

![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=f5f5f5 'Next.js')
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=flat-square&logo=eslint&logoColor=f5f5f5 'ESLint')
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=f5f5f5 'Vercel')

The purpose of this app is for me to explore the new features in next.js version 13 (new app folder, etc).

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

-   You'll be prompted to enter a name for your new next.js app. I entered the project name (which installed the project into the already existent next-13 folder), chose not to use Typescript, said yes to use ESLint and the following occurred:

    1.  These npm pakages were installed: **"@next/font", "eslint": "8.31.0", "eslint-config-next": "13.1.1", "next": "13.1.1", "react": "18.2.0", "react-dom": "18.2.0"** (all as regular dependencies). I don't know why create-next-app doesn't install eslint and eslint-config-next as devDependencies.
    2.  These files were created at the root of the project: **package.json**, **next.config.js**, **.eslintrc.json** files were created in the project folder.
    3.  All the folders/files necessary to get started were installed (eg: /pages, /public and styles, plus their subfolders/files).

You can now run the development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running.

---

### Setting up ESLint

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

### Initial folders/files

Emptied the **/styles** folder, then added my standard base css as **globals.css** (which is already being imported into **/pages/\_app.js**).

Emptied the **/public** folder, then added an **/images** subfolder.

Emptied the **/pages/api** folder.

I got rid of most of the content of **/pages/index.js**... making it just a basic functional component displaying a simple message.

Now I have a basic barebones app with a single page.

---

### The new /app folder

Now that the app is working and the point of this app was to check out the new **app** folder, I deleted the files in the **/pages** folder (\_app.js and \_document.js and index.js). I did keep the **/api** subfolder though since I plan on using it.

The new routing system in next 13's /app folder is folder based and not file based. Each folder is a route as long as it contains a page.js file within it.

You can group folders by placing both of them within a parent folder whose name is enclosed by parenthesis (eg: /app/(group1)/posts and /app/(group1)/authors).

After creating the /app folder, I added a file called **page.js** in it at the root. This will serve as the homepage.

Upon running the app for the first time, next will create **head.js** and **layout.js** in the app folder.

I've set the initial head.js file like this:

```js
export default function Head() {
    return (
        <>
            <title>next-13</title>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
        </>
    );
}
```

...and the initial layout.js file like this:

```js
import PropTypes from 'prop-types';

import '../styles/globals.css';

export default function RootLayout({ children }) {
    return (
        <html>
            <head />
            <body>
                {/* header component will go here */}

                <main>{children}</main>

                {/* footer component will go here */}
            </body>
        </html>
    );
}

RootLayout.propTypes = {
    children: PropTypes.node,
};
```

The head and layout components seems to serve the same purpose as the previous Layout component and the \_app.js plus \_document.js page files.

If you set the page title (plus meta info, favicon, etc) in the root head.js file, it will provide the <head> info for the entire app's pages. However, you can include as many head.js files as you'd like inside your /app folder structure. If one is found, it will override the root head.js and be applied to only the page.js file in that folder.

All components in the **/app** folder are **Server Component**s by default.

You only need to mark components as '**use client**' when they use client hooks such as useState or useEffect. It's best to leave components that do not depend on client hooks without the directive so that they can automatically be rendered as a Server Component when they aren't imported by another Client Component.

```js
'use client';

import { useState } from 'react';
```

You should also mark components as '**use client**' if you add interactivity and event listeners (onClick(), onChange(), etc).

**NOTE**: You cannot import a server component into a client component. You can pass a Server Component as a child or prop of a Client Component. You can do this by wrapping both components in another Server Component.

```js
// /app/ClientComponent.js

'use client';

export default function ClientComponent({children}) {
  return (
    <>
      {children}
    </>
  );
}
```

...and

```js
// /app/page.js

// you can pass a Server Component as a child or prop of a Client Component.
import ClientComponent from "./ClientComponent";
import ServerComponent from "./ServerComponent";

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

### api routes

For now, api routes are handled the same as before... in the **/pages/api** folder. This might change in the future.

---

![next-13](next_13.svg 'next-13')
![by Mike Gullo](author.svg 'by Mike Gullo')

-   Live version: https://next-13.vercel.app/
-   This project's github repo: https://github.com/mike14747/next-13
-   Me on github: https://github.com/mike14747
-   Contact me at: mgullo.dev@gmail.com

![GitHub last commit](https://img.shields.io/github/last-commit/mike14747/next-13?style=for-the-badge)
