---
id: resource_substitution
title: Resource Substitution
description: Provides a mapping and random selection mechanism for substituting game resources (e.g., rocks, trees, grass) with alternate variants based on predefined rules.
tags: [map, worldgen, resource, randomness]
sidebar_position: 1

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: environment
source_hash: 1a872a5f
---

# Resource Substitution

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

The Resource Substitution component is a utility module used during world generation to determine alternate prefabs for a given base resource type. It supports variant swapping—for example, replacing a `rock1` with either `basalt` or `rock_flintless`—to increase environmental diversity and procedural variety. This module does not operate on entities directly, but rather provides a functional interface for map generation systems to resolve resource substitutions deterministically or randomly.

The core function `GetSubstitute` takes a string resource identifier and returns a random element from its substitution list, or returns the original input if no substitution is defined.

## Usage example

```lua
local resource_substitution = require("map/resource_substitution")

-- Replace rock1 with a randomized substitute
local result = resource_substitution.GetSubstitute("rock1")
-- result is either "basalt" or "rock_flintless"

-- For an item with no substitution defined, return the original name
local unchanged = resource_substitution.GetSubstitute("unknown_item")
-- unchanged == "unknown_item"
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
No public properties are exposed by this component.

## Main functions
### `GetSubstitute(item)`
* **Description:** Returns a substitute resource name for the given `item`, selected randomly from its defined substitution list. If no substitution list exists for `item`, returns `item` unchanged.
* **Parameters:**
  - `item` (`string`): The prefab name or resource key to substitute.
* **Returns:** (`string`) A randomly selected substitute prefab name, or the original `item` if no substitution is defined.
* **Error states:** Returns `item` if `substitution_list[item]` is `nil`. Does not validate whether the returned prefab name corresponds to an actual prefabs file—it assumes the caller will resolve it appropriately.

## Events & listeners
None.