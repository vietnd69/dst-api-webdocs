---
id: pr-template
title: Pull Request Template
sidebar_position: 3
---

# Pull Request Template

When submitting a pull request to the Don't Starve Together API Documentation, please use the following template:

```markdown
## Description

[Provide a brief description of the changes you've made]

## Type of Change

- [ ] New documentation
- [ ] Documentation update/improvement
- [ ] Bug fix (incorrect information)
- [ ] Code example improvement
- [ ] Other (please specify)

## Areas Changed

- [ ] Component documentation
- [ ] Core systems documentation
- [ ] Examples/tutorials
- [ ] Getting started guides
- [ ] Localization documentation
- [ ] Other (please specify)

## Checklist

- [ ] I have followed the [documentation standards](documentation-standards.md)
- [ ] I have checked for spelling and grammatical errors
- [ ] I have verified that code examples work correctly
- [ ] I have tested the changes locally using `npm start`
- [ ] I have added appropriate cross-references to related documentation

## Additional Information

[Any additional information, context, or screenshots that might be helpful]
```

## Example Pull Request

Here's an example of a well-formatted pull request:

```markdown
## Description

Added documentation for the Workable component, including all properties, methods, and events. Also included examples of how to create workable objects like trees and rocks.

## Type of Change

- [x] New documentation
- [ ] Documentation update/improvement
- [ ] Bug fix (incorrect information)
- [ ] Code example improvement
- [ ] Other (please specify)

## Areas Changed

- [x] Component documentation
- [ ] Core systems documentation
- [ ] Examples/tutorials
- [ ] Getting started guides
- [ ] Localization documentation
- [ ] Other (please specify)

## Checklist

- [x] I have followed the [documentation standards](documentation-standards.md)
- [x] I have checked for spelling and grammatical errors
- [x] I have verified that code examples work correctly
- [x] I have tested the changes locally using `npm start`
- [x] I have added appropriate cross-references to related documentation

## Additional Information

This completes the documentation for all harvesting-related components (Workable, Pickable, and Harvestable).
```

## After Submitting a Pull Request

After submitting your pull request:

1. **Wait for Review**: A maintainer will review your changes
2. **Address Feedback**: Make any requested changes
3. **Approval and Merge**: Once approved, your changes will be merged into the main branch
4. **Deployment**: The documentation site will be automatically updated

Thank you for contributing to the Don't Starve Together API Documentation! 