Created a login page.
I will provide API for login and other page and functionality.

---
*July 8, 2025*
- Continued project setup. Reviewed existing code and prepared to add new features.
- Added ODK Version dropdown to `vasa-list` component.
- Integrated API call to fetch ODK versions from `https://localhost:7033/api/VASAODKVersion`.
- Created `OdkVersionService` to handle API calls for ODK versions.
- Created `environment.ts` to store the base API URL.
- Updated `vasa-list` component to use `OdkVersionService` and display `vasaDisplayVersion` with `versionTable1` as value.
- Resolved `NullInjectorError` by adding `provideHttpClient()` to `app.config.ts`.
- Modified ODK Version dropdown to use `vasaDisplayVersion` for both value and label.
- Added a data table to `vasa-list` component using PrimeNG.
- Installed PrimeNG and PrimeIcons.
- Updated `OdkVersionService` with `getVasaNarrativeByOdkVersion` method.
- Modified `vasa-list.ts` to fetch and display table data, handle dropdown selection, and search.
- Modified `vasa-list.html` to include the search button and PrimeNG table.
- Corrected PrimeNG module imports in `vasa-list.ts`.
- Added PrimeNG CSS to `angular.json`.
- Encountered errors with PrimeNG module and CSS resolution. Attempted to clear npm cache and reinstall, but faced permission issues.
- User manually deleted `node_modules` and `package-lock.json`.
- Reinstalled all npm packages successfully.
- Confirmed that data flattening logic for the table was already in place in `vasa-list.ts`.
- Added PrimeNG table to `vasa-list.html`.
- Imported `TableModule` in `vasa-list.ts`.
- Added PrimeNG CSS to `angular.json`.
- Removed PrimeNG and installed Angular Material.
- Refactored `vasa-list.ts` to use `MatTableModule` and `MatPaginator`.
- Refactored `vasa-list.html` to use Angular Material table and paginator.
- Updated `vasa-list.ts` to properly integrate `MatPaginator` using `ViewChild` and `AfterViewInit`.
- Applied `deeppurple-amber.css` theme to `src/styles.css`.
- Enhanced table with filter input in `vasa-list.html` and implemented `applyFilter` in `vasa-list.ts`.
- Refined form elements using Angular Material components in `vasa-list.html` and imported necessary modules in `vasa-list.ts`.
- Added basic layout and spacing to `vasa-list.css`.
- Added logout button to `vasa-list.html` and `logout()` method to `vasa-list.ts`.
- Generated `AuthGuard` and `AuthService`.
- Implemented login check in `AuthGuard` and integrated `AuthService`.
- Applied `AuthGuard` to `vasa-list` route in `app.routes.ts`.
- Modified `login.ts` and `vasa-list.ts` to use `AuthService` for login/logout.
- Corrected `AuthGuard` import path in `app.routes.ts`.
- Removed `[disabled]="!isFormValid"` from login button in `login.html`.

---
*July 9, 2025*
- **Narrative Details Page Implementation:**
  - Added "Narrative" button to `vasa-list` table, dynamically colored based on `isCompleted` status (Green: Complete, Pink: Incomplete, Red: Null/Other).
  - Created `vasa-narrative-details` component.
  - Implemented routing to `vasa-narrative-details` passing `version` and `uuid` as parameters.
  - Displayed all API data (`pgData` and `narrativeData`) dynamically on the details page.
  - Implemented "Narrative Status" radio buttons (Complete, Incomplete, No Narrative).
  - Added "Back" button to navigate back to the list.
  - Implemented error handling for API calls (displaying "Something went wrong or Item not found").
  - Handled `TypeError` when `narrativeData` is null or undefined by initializing `vasaNarrative` and `narrativeStatus` appropriately.
  - Implemented "Save" (POST) functionality for new narratives.
  - Implemented "Update" (PUT) functionality for existing narratives.
  - Ensured `odkVersion` is sent as a string in the payload.
  - Corrected `HttpClient` response type to `text` for successful API responses.
  - Enabled/disabled the "Save/Update" button based on narrative status selection and text content.
  - Integrated login ID for `entryBy` and `editBy` fields by storing it in `localStorage` via `AuthService`.
- **Error Handling & Routing Enhancements:**
  - Implemented a "Page Not Found" component for invalid URLs.
  - Fixed `routerLink` issue on "Page Not Found" button by importing `RouterModule`.
- **Authentication State Persistence:**
  - Persisted login state using `localStorage` to prevent re-login on page reload.
- **ODK Version Dropdown Enhancements:**
  - Added "All" option with value `0` to the ODK Version dropdown in `vasa-list.html` and `vasa-list.ts`.
  - Modified `vasa-list.ts` to pass `0` to the API for the "All" option.
  - Modified `odk-version.service.ts` to accept `string` for `odkVersion` parameter and construct the URL accordingly.
- **Login Page Functionality and UI Fixes:**
  - Implemented actual login API call in `login.ts` and `auth.service.ts` using `https://localhost:7033/api/Users/{userID}/{password}`.
  - Added error handling and messages for login: "Inactive user! Login Failed!!" (if `isActive != 1`) and "UserID or Password Incorrect!!" (if API doesn't find login data).
  - Stored user's `role` in `AuthService` after successful login.
  - Added `HttpClientModule` to `login.ts` imports.
  - Added `errorMessage` display in `login.html`.
  - Resolved login button hiding issue by removing `float: right` from `login.css` and using flexbox (`d-flex justify-content-end`) in `login.html` to position the button to the right.
- **Role-based UI Visibility:**
  - Controlled visibility of "Save/Update" button in `vasa-narrative-details.html` based on user's `role` (visible if `role == 1`).

---
*July 10, 2025*
- **Enhanced Search Functionality on `vasa-list` page:**
  - Added multiple search options: "Death Type" (All, Neo+Stb, Stb, Neo, Child, Adult), "Narrative Status" (All, Not Written, Completed, Incomplete, No Narrative), and "Data Collection Date From/To" with calendar icons.
  - Made calendar date inputs read-only and enforced `DD/MM/YYYY` format.
  - Implemented validation to ensure "Data Collection Date To" is greater than or equal to "Data Collection Date From".
  - Added API error handling for `getVasaNarrativeByFilters`, specifically displaying "No data found." for 404 Not Found responses.
  - Created `VasaNarrativeFilter` interface (`src/app/models/vasa-narrative-filter.model.ts`) for type-safe filter payload.
  - Configured `getVasaNarrativeByFilters` in `odk-version.service.ts` to use HTTP POST request with the `VasaNarrativeFilter` object in the request body.
  - Fixed date formatting issue (timezone offset) for calendar dates by using local date components.
- **Table Enhancements:**
  - Changed "Items per page" options in the paginator to 10, 20, 50.
  - Changed "Narrative" button text color to white.
  - Updated "Narrative" button background colors based on `isCompleted` status: `DarkGreen` (Complete), `DarkOrange` (Incomplete), `Indigo` (No Narrative), `Crimson` (Null/Other).
- **Filter and Paginator State Persistence:**
  - Implemented persistence of all search terms (ODK Version, Death Type, Narrative Status, Date From, Date To), general filter input, and paginator state (page index, page size) across navigation using `AuthService`.
  - Fixed issue where paginator `pageIndex` was not persisting after returning from the details page by explicitly setting it after data update.

---
*July 11, 2025*
- **Layout Modernization:**
  - Created `HeaderComponent` and `FooterComponent` for a consistent application layout.
  - Moved the logout button from `vasa-list.html` to `HeaderComponent`.
  - Removed the `logout()` method from `vasa-list.ts`.
  - Updated `app.html` to include `app-header` and `app-footer`.
  - Modified `app.ts` to conditionally show/hide the header and footer based on the current route (hidden on `/login` and `/`).
  - Added basic styling for the header and footer in `header.css`.
- **Global Loading Indicator:**
  - Implemented a global loading spinner using `LoaderService`, `LoaderInterceptor`, and `LoaderComponent`.
  - `LoaderService` manages the loading state with an `activeRequests` counter to handle multiple concurrent API calls.
  - `LoaderInterceptor` automatically shows the loader before HTTP requests and hides it upon completion (success or error).
  - `LoaderComponent` displays a Material Design progress spinner.
  - Configured `LoaderInterceptor` in `app.config.ts`.
  - Integrated `LoaderComponent` into `app.html` and imported it into `app.ts`.

**Remaining tasks for future work:**
1.  **Change Design:** UI/UX improvements, potentially involving changes to CSS, Angular Material components, or overall layout.
2.  **Login API Call:** Implement an actual API call for user login in `login.ts` instead of the current placeholder logic.