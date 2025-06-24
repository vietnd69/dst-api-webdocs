---
id: globalvariableoverrides
title: Global Variable Overrides
description: Base configuration file for overriding global variables in DST
sidebar_position: 50
slug: core-systems-globalvariableoverrides
last_updated: 2025-06-21
build_version: 676042
change_status: stable
---

# Global Variable Overrides

## Version History
| Build Version | Change Date | Change Type | Description |
|---|----|----|----|
| 676042 | 2025-06-21 | stable | Current version |

## Overview

The `globalvariableoverrides.lua` file serves as the base configuration file for overriding global variables in Don't Starve Together. This file is intentionally kept minimal and provides a foundation that other override variants can build upon.

## File Purpose

This file provides a clean slate for global variable configuration. It contains no active overrides by default, allowing the game to use its standard global variable values unless specifically modified by derived override files.

## Usage Example

```lua
-- The file contains only a comment indicating its intentional emptiness
-- Intentionally blank
```

## Implementation Details

### File Structure
The base `globalvariableoverrides.lua` file contains:
- A single comment line indicating intentional emptiness
- No active variable declarations or overrides
- Serves as a template for other override variants

### Global Variable System
Global variables in DST can be overridden through this configuration system to:
- Modify game behavior for different environments
- Enable or disable specific features
- Configure server settings and parameters
- Control mod behavior and warnings

## Related Override Files

This base file is part of a system of global variable override files:

- [Clean Overrides](./globalvariableoverrides_clean.md): Empty override file for clean environments
- [Monkey Overrides](./globalvariableoverrides_monkey.md): Mod-related overrides for testing
- [PAX Server Overrides](./globalvariableoverrides_pax_server.md): Server configuration for PAX events

## Common Use Cases

1. **Development Environment**: Use as a starting point for custom global variable configurations
2. **Production Deployment**: Maintain default game behavior when no overrides are needed
3. **Configuration Management**: Provide a base layer that specialized override files can extend

## Configuration Guidelines

When creating custom global variable overrides:

1. **Backup Original**: Always maintain a copy of the original file
2. **Document Changes**: Comment all modifications with purpose and expected behavior
3. **Test Thoroughly**: Verify that overrides work as expected in target environment
4. **Version Control**: Track changes to override configurations

## Related Modules

- [Mod Index](./modindex.md): Manages mod loading and configuration
- [Server Preferences](./serverpreferences.md): Handles server-specific settings
- [Config](./config.md): General configuration management system
