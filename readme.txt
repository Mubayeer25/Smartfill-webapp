Smartfill Web App Setup

This document provides instructions on how to set up and run the Slant AngularJS project for local development.

## 1\. Prerequisites

You must install the following tools before proceeding.

### Git

  - **Purpose:** Used to download (clone) the project code.
  - **Installation:** Download and install Git from [git-scm.com](https://git-scm.com/).

### Node Version Manager (nvm)

  - **Purpose:** This project requires an older version of Node.js (v10) to function correctly. `nvm` allows you to easily install and switch between Node versions.
  - **Installation (macOS / Linux / WSL):**
    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    ```
    After running, close and reopen your terminal.
  - **Installation (Windows):** Download and run the `nvm-setup.zip` installer from the [nvm-windows releases page](https://github.com/coreybutler/nvm-windows/releases).

### Node.js v10

  - **Purpose:** The specific version of Node.js required by the project's dependencies.
  - **Installation (after installing nvm):**
    ```bash
    nvm install 10
    nvm use 10
    ```

### Global Dependencies (Bower & Grunt)

  - **Purpose:** These are the package manager and task runner used by the project.
  - **Installation:**
    ```bash
    npm install -g bower grunt-cli
    ```

-----

## 2\. Project Setup

Follow these steps to download and install the project's dependencies.

1.  **Clone the Project**
    Open your terminal and clone the project repository.

    ```bash
    git clone <your-repository-url>
    cd <project-folder-name>
    ```

2.  **Set Node Version**
    Ensure your terminal is using the correct Node.js version.

    ```bash
    nvm use 10
    ```

3.  **Install Node Dependencies**
    This command installs the tools needed for the build process. The `--legacy-peer-deps` flag is required for this older project.

    ```bash
    npm install --legacy-peer-deps
    ```

4.  **Install Front-End Dependencies**
    This command downloads all the front-end libraries (like Angular, jQuery, etc.).

    ```bash
    bower install
    ```

-----

## 3\. Configuration

The application connects to a Supabase backend for authentication. You must add the project's API keys to the code.

1.  Open the file: **`app/js/app.js`**.

2.  Find the Supabase initialization block at the top of the file.

3.  Replace the placeholder values for `SUPABASE_URL` and `SUPABASE_ANON_KEY` with the keys from your Supabase project dashboard.

    ```javascript
    // --- SUPABASE INITIALIZATION ---
    const SUPABASE_URL = 'YOUR_SUPABASE_URL';
    const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY';

    window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    // --- END OF SUPABASE INITIALIZATION ---
    ```

-----

## 4\. Running the Application

This project requires a build step before you can view it.

1.  **Build the Project**
    This command compiles all the source code from the `app/` directory and places the final output in the `angular/` directory.

    ```bash
    grunt build:angular
    ```

2.  **Start the Web Server**
    Run the server from the project's root directory.

    ```bash
    npx http-server
    ```

3.  **View the App**
    The server will give you a URL, likely `http://localhost:8080`. Open this in your browser and click on the **`angular/`** folder to see the running application.

-----

## 5\. Development Workflow

**IMPORTANT:** Always follow this process when you make changes to the code.

1.  **Edit files in the `app/` directory ONLY.** Do not edit files in the `angular/` folder, as they will be overwritten.
2.  When you're ready to see your changes, **stop the server** (`CTRL + C`).
3.  **Re-run the build command**: `grunt build:angular`.
4.  **Restart the server**: `npx http-server`.
5.  **Hard refresh your browser** (`Ctrl+Shift+R` or `Cmd+Shift+R`) to ensure you see the latest changes.
