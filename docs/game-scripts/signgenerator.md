---
id: signgenerator
title: Signgenerator
description: Generates a randomized descriptive text string for signs based on tile type and randomized linguistic components.
tags: [text, generation, sign]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: fe0fe59d
system_scope: environment
---

# Signgenerator

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`Signgenerator` is a standalone utility function that constructs a randomly generated descriptive phrase for in-game signs. It pulls from predefined linguistic components (`QUANTIFIERS`, `ADJECTIVES`, `NOUNS` by tile type, `DEFAULT_NOUNS`, `ADDITIONS`) defined in `STRINGS.SIGNS`, and applies formatting rules to produce grammatically plausible sign text. This function is not an ECS component, but a pure function exported for reuse across prefabs that create signs.

## Usage example
```lua
local inst = CreateEntity()
inst:AddComponent("sign")
-- ... after setup ...
local sign_text = require("signgenerator")(inst, player)
inst.components.sign:SetDescription(sign_text)
```

## Dependencies & tags
**Components used:** None identified  
**Tags:** None identified  
**Dependencies:** Requires `strings` module and `STRINGS.SIGNS` table (populated via localization).

## Properties
No public properties.

## Main functions
### `GenerateRandomDescription(inst, doer)`
*   **Description:** Constructs a randomized sign description string by combining a quantifier (with 40% probability), an adjective, a noun based on the `doer`'s current tile type (or a default noun), and optionally an addition phrase (with 20% probability), using localized format strings.
*   **Parameters:**
    * `inst` (TheaterEntity) — The entity the sign is attached to (unused in current implementation but passed for context).
    * `doer` (Entity with `GetCurrentTileType()`) — The entity whose current tile type informs noun selection.
*   **Returns:** `string` — A formatted descriptive text string, e.g., `"The Very Shiny Swamp"`.
*   **Error states:** May return `nil` if `subfmt` fails (e.g., missing format string keys in `STRINGS.SIGNS`), though this is prevented by fallback defaults.

## Events & listeners
Not applicable.