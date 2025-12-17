# LeaveFE - Leave Management Frontend

This project is the frontend for a Leave Management application, built with Angular. It provides a user interface for employees to request leave, view their leave history, and for managers to approve or deny leave requests.

## ✨ Features

-   **Dashboard**: An overview of leave-related information.
-   **Leave Request**: A form for employees to submit new leave requests.
-   **Leave History**: A view for employees to see the status of their past and current leave requests.
-   **Leave Approval**: An interface for managers to review and approve/reject pending leave requests.
-   **Localization**: Includes custom pipes (`th-date`, `th-status`, `th-type`) for Thai language display of dates, statuses, and leave types.

## 🚀 Technology Stack

-   [Angular](https://angular.io/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [SCSS](https://sass-lang.com/) for styling
-   [Angular CLI](https://github.com/angular/angular-cli)

## Prerequisites

Before you begin, ensure you have met the following requirements:

-   [Node.js](https://nodejs.org/en/) (LTS version recommended)
-   [Angular CLI](https://cli.angular.io/) installed globally (`npm install -g @angular/cli`)

## 🏁 Getting Started

To get a local copy up and running, follow these simple steps.

1.  **Clone the repository:**
    ```sh
    git clone <your-repository-url>
    cd LeaveFE
    ```

2.  **Install NPM packages:**
    ```sh
    npm install
    ```

3.  **Run the development server:**
    ```sh
    ng serve
    ```
    Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## 📦 Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```sh
ng build
```
For a production build, use the production configuration:
```sh
ng build --configuration production
```

## 🧪 Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

```sh
ng test
```

## ⚙️ Further help with Angular CLI

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
