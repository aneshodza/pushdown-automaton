# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.0] - 2024-04-20
### Fixed
- Properly fix the building CI. There was a confucion between cjs and esm, which has now been resolved.
- The termination message import (or lack thereof) was messing when using the library.
### Added
- The option for a different initial character on the stack

## [1.1.3] - 2024-04-20
### Fixed
- Fixed the publishing CI again, as it didn't build before publishing.

## [1.1.2] - 2024-04-20
### Fixed
- Fixed the tscompiler, as before it didn't suggest the imports correctly

## [1.1.1] - 2024-04-19
### Fixed
- Fixed the publishing CI, as it didn't build before publishing.

## [1.1.0] - 2024-04-19
### Added
- Checking for multiple matching transitions, meaning the automaton isn't deterministic.

## [1.0.0] - 2024-04-19
- Initial release
