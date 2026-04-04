---
id: curse_monkey_util
title: Curse Monkey Util
description: Manages the application and removal of Monkey Curse effects on an entity.
tags: [event, curse, transformation]
sidebar_position: 10

last_updated: 2026-03-21
build_version: 714014
change_status: stable
category_type: root
source_hash: c5fa5675
system_scope: entity
---

# Curse Monkey Util

> Based on game build **714014** | Last updated: 2026-03-21

## Overview
`curse_monkey_util` is a utility module responsible for managing the "Monkey Curse" state on an entity, typically a player character. It handles the visual and logical progression of the curse based on item counts, modifying entity tags, skin modes, and transformation states. It interacts closely with the `skinner` component to update appearance and the `talker` component for announcements.

## Usage example
```lua
local util = require("curse_monkey_util")

-- Apply curse effects based on collected items
util.docurse(inst, 5)

-- Remove curse effects completely
util.uncurse(inst, 0)
```

## Dependencies & tags
**Components used:** `skinner`, `talker`
**Tags:** Adds or removes `MONKEY_CURSE_1`, `MONKEY_CURSE_2`, `MONKEY_CURSE_3`, `wonkey`, `weregoose`, `weremoose`, `beaver`.

## Properties
No public properties

## Main functions
### `docurse(owner, numitems)`
*   **Description:** Applies curse effects to the owner entity based on the number of items collected. It spawns visual effects, updates skin modes, and sets curse level tags.
*   **Parameters:** 
    *   `owner` (Entity) - The entity instance to curse.
    *   `numitems` (number) - The count of items determining the curse level.
*   **Returns:** Nothing.
*   **Error states:** Checks `TUNING.MONKEY_TOKEN_COUNTS` thresholds. If the owner is already in a specific state (e.g., `monkeyfeet` is true), it skips redundant application steps.

### `uncurse(owner, num)`
*   **Description:** Removes or reduces curse effects on the owner entity. It spawns removal effects and resets skin modes and tags based on the provided number.
*   **Parameters:** 
    *   `owner` (Entity) - The entity instance to uncurse.
    *   `num` (number) - The target level or state for the uncurse process.
*   **Returns:** Nothing.
*   **Error states:** If `num` is less than or equal to `0`, it clears all curse data. If the owner has the `wonkey` tag, it may schedule a transformation task instead of immediately clearing data.

## Events & listeners
-   **Listens to:** None identified.
-   **Pushes:** `monkeycursehit` - Fired on the owner entity with data `{ uncurse = true/false }` to indicate the state change direction.