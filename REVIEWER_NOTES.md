# Notes to Reviewer

## innerHTML warnings

The `UNSAFE_VAR_ASSIGNMENT` / `innerHTML` warnings all come from two unmodified third-party libraries vendored in `vendor/`:

- **`vendor/trix.js`** — [Trix 2.1.19](https://github.com/basecamp/trix), a WYSIWYG editor by Basecamp. The innerHTML usage is internal to the editor's own DOM rendering and is not reachable via user input to this extension.
- **`vendor/purify.min.js`** — [DOMPurify 3.1.6](https://github.com/cure53/DOMPurify), a well-audited HTML sanitizer used specifically *to sanitize* HTML before it is written to the page. The single innerHTML write in DOMPurify is how it parses untrusted HTML in an isolated document — this is the intended and safe usage pattern for that library.

No first-party code in this extension uses innerHTML. All user-generated content from the Trix editor is passed through DOMPurify before being written to the AO3 comment textarea.

## Testing

No account is required to test basic functionality. To test:

1. Go to https://archiveofourown.org/works/ and click any fanfic
2. Scroll to the bottom of the page — the WYSIWYG editor should appear in the comment box
