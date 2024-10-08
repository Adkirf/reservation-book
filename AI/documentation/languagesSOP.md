Folder Structure

reservation-book/
├── public/
│   └── locales/
│       └── english.json
│       └── spanish.json
│       └── defaultSettings.json
├── src/
│   ├── app/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   └── lib/
│       └── utils/
│           └── index.ts



[x] Create an english.json file in the public/locales folder with all translated text @public/locales
[x] Add a default language to the @public/locales/defaultSettings.json
[x] Implement the selected language and translator-helper-funtion in the AuthProvider to make it accessible accross the app
[x] Go through all affected files on by one and replace hardcoded text with translated text using the translator-helper-funtion from the AuthProvider
[x] Create a new spanish.json with all text values from @english.json translated to spanish. 
[ ] Keep updated prompt: "Review the @languageSOP to translate the hardcoded text in ... using the @AuthProvider and update the lanagues.jsons" 