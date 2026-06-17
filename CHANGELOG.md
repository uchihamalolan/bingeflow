# Release Notes

## Version Notes (AMO)

- Initial release.
- Supports Prime Video only for now: `https://www.primevideo.com/*`.
- Press `s` to trigger Skip Intro.
- Press `n` to trigger Next Up only when the Next Up card is visible.
- No data collection (`data_collection_permissions: none`).

## Notes to Reviewer (AMO)

- This extension works only on Prime Video playback pages.
- Test steps:
  1. Open a Prime Video title and start playback.
  2. When a Skip Intro prompt appears, press `s`.
  3. The extension clicks Prime Video's skip-intro button.
  4. When the Next Up card appears, press `n`.
  5. The extension clicks `div.atvwebplayersdk-nextupcard-button`.
- No external server/API calls are made.
- No user account data is read, stored, or transmitted.
- If reviewer credentials are required, provide here before submission:
  - Username: `<reviewer_test_username>`
  - Password: `<reviewer_test_password>`
