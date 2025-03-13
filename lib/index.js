"use strict";

const { spawn } = require('child_process');
const path = require('path');

/**
 * fetchAllContacts
 * Fetches the macOS/Apple contacts.
 *
 * @name fetchAllContacts
 * @function
 * @param {Function} onProgress A function which is called on progress, with the following object:
 *    - progress (information about the progress)
 *    - contactInfo (information about the contact)
 * @return {Promise} A promise resolving with the contacts as an array.
 */
module.exports = function fetchAllContacts(onProgress) {
  return new Promise((resolve, reject) => {
    // Define the path to the AppleScript file
    const scriptPath = path.join(__dirname, 'fetch-contacts.scpt');  // Update the script file name and location

    // Spawn a child process to run the AppleScript
    const scriptProcess = spawn('osascript', [scriptPath]);

    let contactsData = [];

    // Process the data
    let processData = (data) => {
      const output = data.toString();
      const lines = output.split('\n');

      lines.forEach((line) => {
        if (line.trim()) {
          // Check if the line contains progress in the form of "[current/total] {contact information in json format}"
          const progressMatch = line.match(/^\[(\d+)\/(\d+)\] (.+)$/);

          if (progressMatch) {
            const current = parseInt(progressMatch[1], 10);
            const total = parseInt(progressMatch[2], 10);
            const percent = (current / total) * 100;

            // Extract the contact information JSON
            let contactInfo = null;
            try {
              contactInfo = JSON.parse(progressMatch[3].trim());
            } catch (error) {
              console.error('Error parsing contact information:', error);
            }

            // Send both progress and contact info in the progress event
            if (onProgress && contactInfo) {
              onProgress({
                progress: {
                  current,
                  total,
                  percent
                },
                contact: contactInfo
              });
            }

            // Collect contact data
            if (contactInfo) {
              contactsData.push(contactInfo);
            }
          }
        }
      });
    };

    // Listen to stdout and stderr streams for output
    scriptProcess.stdout.on('data', processData);
    scriptProcess.stderr.on('data', processData);

    // Handle process closure
    scriptProcess.on('close', (code) => {
      if (code !== 0) {
        reject(`AppleScript process exited with code ${code}`);
        return;
      }

      // Resolve the promise with the collected contacts data
      resolve(contactsData);
    });
  });
};
