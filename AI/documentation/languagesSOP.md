Folder Structure

reservation-book/
├── public/
│   └── locales/
│       └── english.json
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   └── lib/
│       └── settings/
│           └── index.ts



[x] Create a locales folder in the public directory to store language files.
[x] Create an english.json file in the public/locales folder with all the hardcoded text.
[x] Add the default language "English" to the lib/settings/index.ts file
[x] Implement the selected language in the AuthProvider to make it accessible accross the app
[x] Go through all affected files on by one and replace hardcoded text with variable text using the language provided in the AuthProvider

Folders to update:
[x] src/app/admin
[x] src/app/calendar
[x] src/app/login
[x] src/app/offline
[x] src/app/reservations
[x] src/app/support
[x] src/app/layout.tsx
[x] src/app/page.tsx
[x] src/components/Calendar
[x] src/components/Confirmation
[x] src/components/FormInputs
[x] src/components/Reservation
[x] src/components/UserManagement
[x] src/components/MenuSheet.tsx
[x] src/contexts
[x] src/hooks
[x] src/lib

[x] Create a new spanish.json with all text values from @english.json translated to spanish. 
[x] Change the default language in the @lib/settings/index.ts to spanish. 