# Python Classroom Editor

A browser-based multi-file Python editor with CodeMirror, Pyodide, localStorage, ZIP import/export, an interactive I/O console, and a Stop button.

## GitHub Pages

1. Create a repository and upload `index.html` and `coi-serviceworker.js` to its root.
2. In repository Settings > Pages, deploy from the main branch, root folder.
3. Visit the published HTTPS URL. On the first visit, the page should reload once when the service worker takes control.
4. Confirm `crossOriginIsolated === true` in browser DevTools. Click Run to download and start Pyodide.

The editor needs internet access to fetch CodeMirror, fflate, and Pyodide from CDNs. The service worker supplies cross-origin isolation headers for same-origin resources. This workaround is intended for GitHub Pages and must be verified in the target browsers. If an external CDN resource is blocked by COEP, host that dependency locally.

## Notes

- Browser storage is local to the browser profile and origin. Export ZIPs regularly for backup and assignment submission.
- `main.py` is the entry point. Python can import sibling modules and read/write text files.
- Files written by Python are synchronized to the project when execution completes, including after Python exceptions. Forced Stop terminates the worker, so changes since the start of that run are lost.
- The virtual project filesystem synchronizes UTF-8 text files up to 2 MB per file. Binary files are not supported.
- The code editor can be used without cross-origin isolation; running Python and interactive `input()` cannot.
- This project has not been browser-tested in this environment.
