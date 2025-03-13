tell application "Contacts"
    set contactList to {}
    set totalContacts to count of people
    set progress to 0

    -- Loop through all contacts
    repeat with aContact in people
        try
            set contactName to name of aContact
            set contactEmails to value of email of aContact
            if contactEmails is {} then
                set contactEmails to {}
            end if

            -- Check for phone numbers
            try
                set contactPhones to value of phone of aContact
                if contactPhones is {} then
                    set contactPhones to {}
                end if
            on error
                set contactPhones to {}
            end try

            -- Fetch and format birthday
            try
                set theBirthday to birth date of aContact
                if theBirthday is not missing value then
                    set theMonth to month of theBirthday as integer
                    set theDay to day of theBirthday
                    set theYear to year of theBirthday
                    set contactBirthday to (theDay as string) & "/" & (theMonth as string) & "/" & (theYear as string)
                else
                    set contactBirthday to ""
                end if
            on error errorMessage number errorNumber
                set contactBirthday to "" -- Fallback to "Not set" if there's an error
            end try

            -- Manually create a string that represents the contact data (only the required fields)
            set jsonString to "{"
            set jsonString to jsonString & "\"name\":\"" & contactName & "\", "
            set jsonString to jsonString & "\"emails\":" & (my formatList(contactEmails)) & ", "
            set jsonString to jsonString & "\"phones\":" & (my formatList(contactPhones)) & ", "
            set jsonString to jsonString & "\"birthday\":\"" & contactBirthday & "\""
            set jsonString to jsonString & "}"

            -- Log the JSON string with current progress
            set progress to progress + 1
            set percent to (progress / totalContacts) * 100
            log "[" & progress & "/" & totalContacts & "] " & jsonString
        on error errorMessage number errorNumber
            -- Log the error with the contact and error details
            log "Error processing contact: " & contactName & ". Error: " & errorMessage & " (Error Number: " & errorNumber & ")"
        end try
    end repeat
end tell

-- Helper function to format lists as JSON arrays
on formatList(inputList)
    set formattedList to "["
    repeat with i from 1 to count of inputList
        set formattedList to formattedList & "\"" & (item i of inputList) & "\""
        if i is not (count of inputList) then
            set formattedList to formattedList & ", "
        end if
    end repeat
    set formattedList to formattedList & "]"
    return formattedList
end formatList
