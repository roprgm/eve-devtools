## North star

This codebase must read as THE example of clean, minimalist code. When in doubt, write the boring, obvious version.

* No ternaries, clever one-liners, or dense expressions — plain `if`/`else` and early returns.
* Every function does exactly one thing.
* No HTML or CSS inside JS/TS strings; keep them in `.html`/`.css` files so the IDE highlights them.
* If a change makes a file harder to skim, it is wrong, even if it works.

## Code quality

* Write code, comments, docs, and commit messages in English.
* Keep the codebase clean, simple, and easy to learn from.
* Prefer clear names, small functions, and straightforward control flow.
* Avoid clever abstractions, unnecessary indirection, deep nesting, and premature optimization.
* Remove dead code, unused exports, unused types, unused dependencies, and commented-out code.
* Don’t over-comment. Explain why, not what.

## Structure

* Use `kebab-case` for file and directory names.
* Order declarations dependencies-first: if B uses A, A comes above B; the exported entry point goes last.
* Import local modules through the `@/*` path alias.
* Keep modules focused and cohesive.
* Separate business logic from UI, routing, and framework-specific code.
* Make the smallest clean change that fully solves the problem.

## TypeScript

* Use strict, precise types.
* Avoid `any`; use `unknown` with narrowing when needed.
* Do not weaken types just to silence errors.

## Quality checks

* Add or update tests when behavior changes.
* Before finishing, run formatting, linting, type checking, and tests when available.

## Stack

* Use Bun as the package manager and runtime.
