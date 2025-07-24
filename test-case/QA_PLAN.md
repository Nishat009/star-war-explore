🧪 QA & Test Plan – Star Wars Explorer
This QA/Test Plan ensures the Star Wars Explorer project meets functional and performance standards, focusing on SWAPI integration, custom enhancements, pagination, search, and UX consistency.

🎯 Objectives
✅ Verify correct display of character data from SWAPI and custom logic

✅ Ensure pagination and search function correctly

✅ Validate loading behavior and error handling

✅ Ensure optimal user experience in edge and failure scenarios

📋 Test Cases
🧪 TC001 – Initial Data Load
Precondition: Backend server running; frontend loaded

Steps:

Load homepage without entering search or interacting with pagination

Expected Result:

Displays 10 characters

Shows: name, height, mass, homeworld, species, films

Missing fields default to "Unknown"

Pass Criteria:

No console errors

All expected fields rendered correctly

🧪 TC002 – Pagination Navigation
Precondition: More than 10 characters available

Steps:

Click Next from page 1

Click Previous from page 2

Expected Result:

Navigates correctly between character sets

Pagination controls update accordingly

Pass Criteria:

"Previous" disabled on page 1

"Next" disabled on last page

Smooth navigation without glitches

🧪 TC003 – Search by Name
Precondition: Character list loaded

Steps:

Enter "Luke" in the search input

Submit search or wait for auto-filter

Expected Result:

Characters with "Luke" in their name are shown

Case-insensitive match

Pagination adjusts if fewer than 10 results

Pass Criteria:

Correct characters displayed

No duplicates or missing results

🧪 TC004 – Error Handling (SWAPI Failure)
Precondition: Simulate SWAPI failure (e.g., API returns 500 or times out)

Steps:

Load homepage or search while backend is simulating failed API calls

Expected Result:

Displays partial character data

Missing fields show "Unknown"

A user-friendly error message is shown

Pass Criteria:

No frontend crashes

Proper fallback behavior in UI

Error clearly logged or displayed

🧪 TC005 – Custom Data Enhancement (Species Inference)
Precondition: Character with missing species field is loaded (e.g., General Grievous)

Steps:

Locate such a character

Review the species field

Expected Result:

Species is inferred via character-URL match

"Unknown" used if no match

Pass Criteria:

Correct inference where possible

No incorrect data shown

Fields remain consistent

🧪 TC006 – Performance with Large Dataset
Precondition: Full SWAPI dataset is cached in backend

Steps:

Search with a broad keyword (e.g., "a")

Navigate through all result pages

Expected Result:

Data loads in under 3 seconds

Pagination stays responsive

Pass Criteria:

UI remains snappy

No delays, lags, or hangs

🧪 TC007 – Loading State Shows All Data Temporarily
Issue: All character data is briefly shown before correct data is loaded

Precondition: New page is loading (e.g., search or pagination click)

Steps:

Trigger a data fetch (e.g., by searching or clicking "Next")

Observe UI during the loading phase

Expected Result:

No characters displayed until data is fully ready

A loading spinner or text like "Loading..." is shown

Pass Criteria:

No premature rendering of unfiltered or stale data

Loading indicator visible during fetch

🧪 TC008 – “No Characters Found” Message Appears Prematurely
Issue: Message appears before loading completes

Precondition: Start typing a valid name in the search field

Steps:

Type a valid term slowly (e.g., "lu")

Watch for "No characters found" message while loading

Expected Result:

Message only appears after loading finishes and there are no results

Pass Criteria:

Message is suppressed while loading === true

Only displayed if filteredCharacters.length === 0 and loading === false