---
id: issue-template
title: Issue Templates
sidebar_position: 4
---

# Issue Templates

When creating an issue for the Don't Starve Together API Documentation, please use one of the following templates based on the type of issue you're reporting.

## Documentation Bug Template

Use this template when reporting errors, inaccuracies, or problems in the existing documentation.

```markdown
## Documentation Bug

### Location
[Provide the URL or file path where the issue is located]

### Current Content
[Quote or screenshot the problematic content]

### Issue Description
[Describe what's wrong with the current content]

### Suggested Fix
[If possible, suggest how to fix the issue]

### Additional Context
[Any additional information that might be helpful]

### Environment
- Browser: [e.g., Chrome, Firefox]
- OS: [e.g., Windows, macOS]
```

## Missing Documentation Template

Use this template when requesting documentation for undocumented APIs, components, or features.

```markdown
## Missing Documentation Request

### Feature Needing Documentation
[Describe the API, component, or feature that needs documentation]

### Current Status
[Is there any existing documentation? If so, where and what's missing?]

### Importance
[Why is this documentation important? Who would benefit?]

### Example Usage
[If possible, provide example code showing how the feature is used]

### Additional Information
[Any other details that might be helpful]
```

## Documentation Improvement Template

Use this template when suggesting improvements to existing documentation.

```markdown
## Documentation Improvement Suggestion

### Location
[Provide the URL or file path of the documentation to improve]

### Current Content
[Summarize the current content or section]

### Suggested Improvement
[Describe how the documentation could be improved]

### Reason for Improvement
[Explain why this improvement would be valuable]

### Additional Context
[Any additional information that might be helpful]
```

## Example Issue

Here's an example of a well-formatted documentation bug issue:

```markdown
## Documentation Bug

### Location
https://vietnd69.github.io/dst-api-webdocs/docs/api-vanilla/components/health

### Current Content
> "The Health component manages an entity's health state, including current and maximum health values, damage handling, regeneration, invincibility, and death triggers."
>
> In the Properties table:
> | `firesuppression` | Number | Multiplier for fire damage |

### Issue Description
The property is incorrectly named. The actual property in the game code is `fire_damage_scale`, not `firesuppression`.

### Suggested Fix
Change the property name in the table from `firesuppression` to `fire_damage_scale`.

### Additional Context
This can be verified in the game code at `components/health.lua` line 42.

### Environment
- Browser: Chrome 98
- OS: Windows 10
```

## After Submitting an Issue

After submitting your issue:

1. **Wait for Triage**: A maintainer will review and categorize your issue
2. **Provide Additional Information**: If requested, provide more details
3. **Consider Contributing**: If you're able, consider submitting a pull request to fix the issue
4. **Track Progress**: Subscribe to the issue to receive updates

Thank you for helping improve the Don't Starve Together API Documentation! 