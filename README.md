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

    1.  These npm pakages were installed: **"@next/font", "eslint": "8.31.0", "eslint-config-next": "13.1.1", "next": "13.1.1", "react": "18.2.0", "react-dom": "18.2.0"** (all as regular dependencies).
    2.  These files were created at the root of the project: **package.json**, **next.config.js**, **.eslintrc.json** files were created in the project folder.
    3.  All the folders/files necessary to get started were installed (eg: /pages, /public and styles, plus their subfolders/files).

You can now run the development server.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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
    "extends": [
        "eslint:recommended",
        "next",
        "next/core-web-vitals"
    ],
    "rules": {
        // rules go here
    }
}
```

Then I added my standard rules to it.

---

### Initial folders/files

Emptied the **/styles** folder, then added my standard base css as **globals.css** (which is already being imported into **/pages/_app.js**).

Emptied the **/public** folder, then added an **/images** subfolder.

Emptied the **/pages/api** folder.

I got rid of most of the content of **/pages/index.js**... making it just a basic functional component displaying a simple message.

Now I have a basic barebones app with a single page.

---

![next-13](next_13.svg 'next-13')
![by Mike Gullo](author.svg 'by Mike Gullo')

-   Live version: https://next-13.vercel.app/
-   This project's github repo: https://github.com/mike14747/next-13
-   Me on github: https://github.com/mike14747
-   Contact me at: mgullo.dev@gmail.com

![GitHub last commit](https://img.shields.io/github/last-commit/mike14747/next-13?style=for-the-badge)