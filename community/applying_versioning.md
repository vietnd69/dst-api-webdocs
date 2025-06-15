---
id: applying_versioning
title: Applying Versioning to Documentation
sidebar_position: 4
---

# Applying Versioning to Documentation

This guide explains how to properly version your documentation contributions for the DST API documentation.

## Understanding the Versioning Systems

The DST documentation uses two versioning systems:

1. **API Version** - Semantic versioning (e.g., 0.5.2) for the API itself
2. **Build Number** - Game update build numbers (e.g., 619045) for reference

## Required Version Information

Every documentation page should include:

### In the Frontmatter

Add these fields to the frontmatter at the top of each document:

```md
---
id: page_id
title: Page Title
sidebar_position: 1
api_version: 0.5.2  # Current API version this applies to
last_updated: 2024-07-10  # Date in YYYY-MM-DD format
---
```

### In the Body

Include version information early in the document:

```md
# Component Name

*Added in API version: 0.5.0*  
*Last game build tested: 619045*
```

## Documenting Version Changes

### For Properties and Methods

When documenting components, include version information:

```md
## Properties

| Property | Type | Description | Added In |
|----------|------|-------------|----------|
| property1 | Type | Description of property1 | 0.5.0 |
| property2 | Type | Description of property2 | 0.5.2 |
```

For methods:

```md
### SomeFunction(param1, param2)

*Added in API version: 0.5.0*
```

### Version History Section

Include a Version History section at the end of the document:

```md
## Version History

| API Version | Game Build | Changes |
|-------------|------------|---------|
| 0.5.2 | 619045 | Added `AnotherFunction()` and `property2` |
| 0.5.0 | 587581 | Component introduced with `SomeFunction()` and `property1` |
```

## Handling Deprecated Features

Clearly mark deprecated features:

```md
### OldFunction(param)

*Added in API version: 0.4.0*
*Deprecated in API version: 0.5.2*
*Will be removed in: 0.6.0*

This function is deprecated. Use `NewFunction()` instead.
```

## Template Example

For a complete example of a properly versioned documentation page, see the [Component Template with Versioning](../../templates/component_template_with_versioning.md).

## Finding Version Information

1. **API Version**: Check the `version.txt` file in the DST API repository
2. **Game Build Numbers**: Reference the [Klei Forums Game Updates](https://forums.kleientertainment.com/game-updates/dst/) for the most recent build numbers

## Best Practices

1. Always check the most recent API version before submitting documentation
2. Specify the earliest version where a feature became available
3. Include game build numbers for context when relevant
4. Document deprecated features clearly with migration paths
5. Update version information when editing existing documentation 