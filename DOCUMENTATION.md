## Documentation

You can see below the API reference of this module.

### `fetchAllContacts(onProgress)`
Fetches the macOS/Apple contacts.

#### Params

- **Function** `onProgress`: A function which is called on progress, with the following object:    - progress (information about the progress)
   - contactInfo (information about the contact)

#### Return
- **Promise** A promise resolving with the contacts as an array.

