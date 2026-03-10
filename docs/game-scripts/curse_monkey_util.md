---
id: curse_monkey_util
title: Curse Monkey Util
description: Provides utility functions to apply or remove the Monkey Curse transformation effects on an entity using item thresholds and state management.
tags: [transformation, curse, inventory]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: c5fa5675
system_scope: entity
---

# Curse Monkey Util

> Based on game build **7140014** | Last updated: 2026-03-10

## Overview
`curse_monkey_util` is a module offering two core functions—`docurse` and `uncurse`—to manage the progression and reversal of the Monkey Curse on an entity. It interacts with the `skinner` component to update visual skin modes and with the `talker` component for in-game announcements. It is used when players interact with Monkey Items (e.g., Monkey Tokens) and controls layered transformation states (`monkeyfeet`, `monkeyhands`, `monkeytail`), associated tags, and scheduled transformation attempts.

## Usage example
```lua
local inst = ThePlayer
local tokens = 7 -- e.g., player collected 7 Monkey Tokens

-- Apply Monkey Curse (based on token count)
inst.components.curse_monkey_util.docurse(inst, tokens)

-- Later, remove the curse
inst.components.curse_monkey_util.uncurse(inst, 0)
```
> Note: This utility is typically used as a standalone module (`require`d and invoked), not as a component added via `inst:AddComponent`.

## Dependencies & tags
**Components used:** `skinner`, `talker`
**Tags:** Adds/Removes `"MONKEY_CURSE_1"`, `"MONKEY_CURSE_2"`, `"MONKEY_CURSE_3"`

## Properties
No public properties

## Main functions
### `docurse(owner, numitems)`
*   **Description:** Applies Monkey Curse progression to the `owner` entity based on the number of Monkey Items (`numitems`). Effects are applied incrementally, and a transformation to were-creature form may be scheduled if enough items are present.
*   **Parameters:**
    * `owner` (Entity) — The entity upon which the curse is applied.
    * `numitems` (number) — Count of Monkey Items (e.g., Monkey Tokens) held/used.
*   **Returns:** Nothing.
*   **Error states:** If `numitems` is less than `TUNING.MONKEY_TOKEN_COUNTS.LEVEL_1`, no curse layers are applied.

### `uncurse(owner, num)`
*   **Description:** Removes Monkey Curse progression from the `owner`. If `num <= 0`, all curse layers and tags are cleared. If `num > 0`, it may trigger a transformation attempt (if the entity is not already a were-creature) or immediately uncurse if already transformed.
*   **Parameters:**
    * `owner` (Entity) — The entity upon which the curse is removed.
    * `num` (number) — Threshold or quantity used to determine behavior (typically 0 for full uncurse).
*   **Returns:** Nothing.

## Events & listeners
- **Listens to:** None (this module does not register event listeners).
- **Pushes:** `"monkeycursehit"` — fired by both `docurse` and `uncurse`, with `uncurse = true/false` in event data.