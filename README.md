# GrowMeOrganic React Assignment

This project is a React application built with TypeScript and Vite. It demonstrates the implementation of a paginated, selectable data table using the [Art Institute of Chicago API](https://api.artic.edu/docs/#artworks). The application leverages PrimeReact components for UI and React Toastify for notifications.

## Features

- **Paginated Data Table:** Fetches artwork data from the API and displays it in a paginated table.
- **Row Selection:** Allows users to select rows via checkboxes or by specifying a range.
- **Range Selection Overlay:** Users can select multiple rows by entering a range (e.g., "1-5" or "10") using an overlay panel.
- **Responsive Design:** The UI adapts to different screen sizes.
- **Notifications:** Success and error notifications are displayed using React Toastify.
- **Loading State:** Displays a loading indicator while fetching data.
- **Error Handling:** Handles API errors gracefully and informs the user.

## Project Structure

- `src/App.tsx`: Main application logic and UI.
- `src/main.tsx`: Entry point for React rendering.
- `src/App.css`: Custom styles for the application and PrimeReact components.
- `src/index.css`: Global styles.
- `public/`: Static assets.
- `vite.config.ts`: Vite configuration.
- `tsconfig.*.json`: TypeScript configuration files.
- `eslint.config.js`: ESLint configuration.

## Logic and Implementation Details

### Data Fetching and Pagination

- The application uses the Art Institute of Chicago API to fetch artwork data.
- Pagination is managed using the `Paginator` component from PrimeReact.
- The current page is tracked with React state (`page`). When the page changes, a new API request is made.
- The API response includes pagination details, which are stored in state for use in the paginator and selection logic.

### Table Rendering

- The `DataTable` component displays artwork data with columns for title, place of origin, artist display, inscriptions, date start, and date end.
- Each row is assigned a unique `id` based on its position in the paginated results.
- The table supports multiple row selection via checkboxes.

### Row Selection Logic

- Selected row IDs are tracked in the `selectedIds` state.
- Selection is managed per page. When the user navigates between pages, only the rows on the current page are shown as selected.
- The selection logic ensures that selections persist across pages by merging current page selections with previously selected rows.

### Range Selection Overlay

- An overlay panel is triggered by clicking the chevron button in the "Title" column header.
- Users can input a range (e.g., "1-5") or a single number to select multiple rows at once.
- The input is validated to ensure the range is within the total number of rows.
- On successful selection, the specified rows are added to the selection and a success notification is shown. Invalid input triggers an informational notification.

### Notifications

- React Toastify is used to display notifications for selection actions and API errors.
- Notifications appear in the top-right corner and auto-close after three seconds.

### Error Handling

- API errors are caught and displayed to the user via a toast notification.
- The loading state is managed to prevent UI flicker and ensure a smooth user experience.

### Styling

- Custom styles are applied to PrimeReact components for a consistent look and feel.
- The application is responsive and adapts to smaller screens.

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm

### Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.

### Development

Start the development server:

```sh
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

To build the project for production:

```sh
npm run build
```

### Linting

To run ESLint:

```sh
npm run lint
```

## Dependencies

- [React](https://react.dev/)
- [PrimeReact](https://primereact.org/)
- [React Toastify](https://fkhadra.github.io/react-toastify/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)

## Customization

- The API endpoint and pagination logic can be adjusted in `src/App.tsx`.
- Styles can be modified in `src/App.css` and `src/index.css`.

## License

This project is for assignment purposes and does not include a license.

## Contact

For questions or feedback, please contact the project maintainer.