---
id: profanityfilter
title: Profanityfilter
description: Provides profanity filtering functionality by checking input strings against configurable dictionaries using exact and loose matching.
tags: [text, filter, util]
sidebar_position: 10

last_updated: 2026-03-08
build_version: 714014
change_status: stable
category_type: util
source_hash: 9855020a
system_scope: entity
---

# Profanityfilter

> Based on game build **714014** | Last updated: 2026-03-08

## Overview
`ProfanityFilter` is a utility class that enables configurable profanity detection. It maintains multiple named dictionaries, each containing lists of prohibited words for exact and loose matching. It is designed to be used server-side for filtering user-generated text such as names, chat, or UI inputs.

## Usage example
```lua
local profanityfilter = TheSim:GetProfanityFilter()
profanityfilter:AddDictionary("en", {
    exact_match = { [smallhash("badword")] = true },
    loose_match = { "evil" }
})
if profanityfilter:HasProfanity("This contains badword") then
    print("Profanity detected!")
end
```

## Dependencies & tags
**Components used:** None identified.  
**Tags:** None identified.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `dictionaries` | table | `{}` | A map of dictionary names to dictionary configurations (each with `exact_match` and `loose_match` fields). |

## Main functions
### `AddDictionary(name, data)`
*   **Description:** Adds a new profanity dictionary with a given name. Populates internal hashes for exact matches and decodes simulated strings for loose matches.
*   **Parameters:**  
    `name` (string or `nil`) – Unique identifier for the dictionary; must be non-empty.  
    `data` (table) – Dictionary configuration containing `exact_match` (hash→boolean map) and `loose_match` (array of strings).  
*   **Returns:** Nothing.
*   **Error states:** No effect if `name` is `nil` or empty, or if a dictionary with the same name already exists.

### `RemoveDictionary(name)`
*   **Description:** Removes a dictionary by name from the filter.
*   **Parameters:**  
    `name` (string or `nil`) – Name of the dictionary to remove.  
*   **Returns:** Nothing.

### `HasProfanity(input)`
*   **Description:** Checks whether the input string contains any profanity, using both exact word matches (hashed) and substring-based loose matches.
*   **Parameters:**  
    `input` (string or `nil`) – Text to scan for profanity.  
*   **Returns:** `true` if any profanity is detected, otherwise `false`.
*   **Error states:** Returns `false` if `input` is `nil` or empty.

## Events & listeners
None identified.