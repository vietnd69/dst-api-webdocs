---
id: maintaining-documentation
title: Maintaining Documentation
sidebar_position: 8
last_updated: 2023-07-06
slug: /api/maintaining-documentation
---

# Maintaining API Documentation

This guide explains how to maintain and update the Don't Starve Together API documentation, particularly when new game updates introduce changes to the API.

## When to Update Documentation

Documentation should be updated in the following scenarios:

1. **New Game Updates**: When Klei releases a new DST update that changes the API
2. **New Features**: When new components, functions, or systems are added
3. **API Changes**: When existing APIs are modified in behavior or signature
4. **Deprecations**: When APIs are marked as deprecated or removed
5. **Bug Fixes**: When documentation contains errors or outdated information

## Documentation Update Process

### 1. Identify Changes

First, identify what has changed in the API:

- Review the official update notes from Klei
- Examine the game code for changes (if accessible)
- Test existing mods to see if they still work
- Check community forums for reported issues

### 2. Categorize Changes

Categorize the changes into:

- **New Features**: Entirely new APIs, components, or systems
- **Changed APIs**: Modifications to existing APIs
- **Deprecated APIs**: APIs that are still available but no longer recommended
- **Removed APIs**: APIs that have been completely removed

### 3. Document Changes

#### For New Features

1. Create or update the relevant documentation page in the appropriate section
2. Include a complete API reference with parameters and return values
3. Provide usage examples
4. Add cross-references to related documentation

#### For Changed APIs

1. Update the existing documentation to reflect the new behavior
2. Add a note about the change, including when it was introduced
3. If the change is significant, consider adding a migration guide
4. Use visual indicators to highlight changes (e.g., "Changed in v1.2.3")

#### For Deprecated APIs

1. Mark the API as deprecated in the documentation
2. Add information about when it will be removed (if known)
3. Provide the recommended alternative
4. Include migration examples

#### For Removed APIs

1. Mark the API as removed in the documentation
2. Provide the recommended alternative
3. Include migration examples
4. Consider keeping the documentation available but clearly marked as removed

### 4. Update the API Changes Document

After documenting specific changes in their respective pages, update the [API Updates and Changes](api-updates.md) document:

1. Create a new section for the game update
2. Summarize all changes in the appropriate categories
3. Link to the detailed documentation for each change
4. Include the update version number and date

## Documentation Standards

When updating documentation, follow these standards:

### Format and Style

- Use clear, concise language
- Follow the existing documentation style
- Use proper Markdown formatting
- Include code examples with syntax highlighting
- Use tables for structured information

### Code Examples

- Ensure all code examples are correct and tested
- Use consistent formatting for Lua code
- Include comments to explain complex code
- Show both the old and new way when documenting changes

### Cross-References

- Add links to related documentation
- Reference other relevant API changes
- Link to official resources when appropriate

## Example Update Process

Here's an example of the documentation update process:

1. **Identify Change**: The "Waterlogged Update" added a new `waterloggable` component

2. **Document Component**:
   - Create or update `docs/api-vanilla/components/waterloggable.md`
   - Document the component's properties and methods
   - Include usage examples

3. **Update API Changes Document**:
   - Add a section for the "Waterlogged Update"
   - List the new `waterloggable` component under "New Features"
   - Provide a brief description and link to the detailed documentation

4. **Cross-Reference**:
   - Update related documentation (e.g., boat component)
   - Add links to the new component from relevant pages

## Using the API Update Template

When documenting a significant API update, use the [API Update Template](api-update-template.md) as a starting point:

1. Copy the template to a new file with an appropriate name
2. Fill in the details for each section
3. Add the file to the documentation
4. Update cross-references as needed

## Contributing Documentation Updates

If you're contributing documentation updates:

1. Fork the repository
2. Create a branch for your changes
3. Make your documentation updates
4. Submit a pull request with a clear description of the changes

### Best Practices for Contributors

- Focus on accuracy and clarity
- Test all code examples
- Follow the existing documentation style
- Include references to sources (e.g., official announcements)
- Clearly indicate what has changed and when

## Conclusion

Maintaining up-to-date API documentation is crucial for the Don't Starve Together modding community. By following these guidelines, we can ensure that the documentation remains accurate, comprehensive, and useful as the game continues to evolve. 
