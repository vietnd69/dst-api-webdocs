---
id: api-updates
title: API Updates and Changes
sidebar_position: 5
last_updated: 2023-07-06
slug: /api/updates
---

# API Updates and Changes

This document tracks changes to the Don't Starve Together API across game updates. It helps mod developers stay informed about new features, changes to existing functionality, and deprecated APIs that may affect their mods.

## How to Use This Document

- **New Features**: Learn about new APIs and capabilities added in recent game updates
- **Changed APIs**: Discover modifications to existing APIs that might require updates to your mods
- **Deprecated APIs**: Identify APIs that are no longer recommended and should be replaced
- **Removed APIs**: Find APIs that have been completely removed from the game

Each entry includes the game version where the change was introduced, a description of the change, and migration guidance where applicable.

## Latest Update (Game Version X.XX)

This section documents the most recent changes to the DST API.

### New Features

- **Feature Name**: Description of the new feature or API
  ```lua
  -- Example usage
  local example = SomeNewFunction()
  ```

### Changed APIs

- **API Name**: Description of changes to the existing API
  ```lua
  -- Old usage (no longer works)
  local old = OldFunction(param)
  
  -- New usage
  local new = UpdatedFunction(param, new_param)
  ```

### Deprecated APIs

- **API Name**: Description of the deprecated API and recommended alternatives
  ```lua
  -- Deprecated (will be removed in future versions)
  local old = DeprecatedFunction()
  
  -- Recommended alternative
  local new = RecommendedFunction()
  ```

### Removed APIs

- **API Name**: Description of the removed API and migration path
  ```lua
  -- This no longer exists
  -- local removed = RemovedFunction()
  
  -- Use this instead
  local alternative = AlternativeFunction()
  ```

## Historical Changes

### Game Version X.XX (Date)

#### New Features

- **Feature Name**: Description

#### Changed APIs

- **API Name**: Description

#### Deprecated APIs

- **API Name**: Description

#### Removed APIs

- **API Name**: Description

### Game Version X.XX (Date)

*(Similar structure for older versions)*

## Maintaining Compatibility

When updating your mods to work with newer game versions, consider these best practices:

1. **Check for API existence**: Always verify that functions exist before calling them
   ```lua
   if SomeFunction ~= nil then
       SomeFunction()
   else
       -- Fallback behavior
   end
   ```

2. **Version detection**: Adapt behavior based on the game version
   ```lua
   local version = TheSim:GetGameVersion()
   if version >= "X.XX" then
       -- Use new API
   else
       -- Use old API
   end
   ```

3. **Feature detection**: Check for specific features rather than version numbers when possible
   ```lua
   if TheWorld.components.new_component ~= nil then
       -- Use new component
   else
       -- Alternative approach
   end
   ```

4. **Graceful degradation**: Ensure your mod works (perhaps with reduced functionality) even when preferred APIs are unavailable

## Contributing to This Document

If you've discovered API changes not documented here, please contribute by:

1. Submitting a pull request to update this document
2. Including the game version where the change was introduced
3. Providing clear examples of both the old and new usage
4. Explaining any migration paths for deprecated APIs

Your contributions help keep the modding community informed and ensure mods remain compatible with game updates. 
