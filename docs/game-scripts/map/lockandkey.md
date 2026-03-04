---
id: lockandkey
title: Lockandkey
description: Provides global lookup tables for locks and keys used in world generation task sequencing.
tags: [world, tasks, generation]
sidebar_position: 10

last_updated: 2026-02-27
build_version: 714014
change_status: stable
category_type: map
system_scope: world
source_hash: f80e0de2
---

# Lockandkey

> Based on game build **714014** | Last updated: 2026-02-27

## Overview

This file defines and validates global lookup tables (`LOCKS`, `KEYS`, and `LOCKS_KEYS`) used to configure task unlocking logic in the game's world generation system. It does not define a component or entity — rather, it is a shared data module that maps named string identifiers to numeric indices for locks and keys, and specifies which keys unlock which locks. The mappings are validated at startup to ensure consistency, and missing identifiers may trigger errors depending on build type.

## Usage example

This file is loaded as a module and its tables are accessed directly:

```lua
-- Example: Checking whether a specific key unlocks a specific lock
local lock_index = LOCKS["SPIDERDENS"]
local key_index = KEYS["PIGS"]

if key_index then
    local keyset = LOCKS_KEYS[lock_index]
    if keyset and keyset[key_index] then
        -- The key 'PIGS' unlocks the lock 'SPIDERDENS'
    end
end
```

## Dependencies & tags
**Components used:** None. This is a data-only module with no component interactions.
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `LOCKS_ARRAY` | Array of strings | `{"NONE", "PIGGIFTS", ...}` | Ordered list of lock identifiers. Used to build `LOCKS`. |
| `LOCKS` | Table (map) | `{[1] = "NONE", ...}` or `{["PIGGIFTS"] = 2, ...}` | Lookup table mapping lock name strings to numeric indices. Also maps indices to names for validation. |
| `KEYS_ARRAY` | Array of strings | `{"NONE", "PICKAXE", ...}` | Ordered list of key identifiers. Used to build `KEYS`. |
| `KEYS` | Table (map) | `{[1] = "NONE", ...}` or `{["PICKAXE"] = 2, ...}` | Lookup table mapping key name strings to numeric indices. Also maps indices to names for validation. |
| `LOCKS_KEYS` | Table of arrays | `{[lock_idx] = {key_idx1, key_idx2, ...}, ...}` | Maps each lock index to a set of valid key indices. A lock is unlocked if *any* key in its set is provided. |
| `SKIP_THESE_MISSING_KEYS_AND_LOCKS` | Table (set) | `{"SILK" = true, "ROCKS" = true, ...}` | Set of legacy missing identifiers to skip during validation (prevents crash in dev). |
| `CRASH_ON_MISSING_KEY_OR_LOCK` | Boolean | `true` in `"dev"` builds | Enables strict validation: missing keys or locks raise errors unless whitelisted in `SKIP_THESE_MISSING_KEYS_AND_LOCKS`. |

## Main functions
No explicit functions are defined. All public logic is realized through top-level table definitions and validation loops.

## Events & listeners
This file defines no components and does not register or fire any events.