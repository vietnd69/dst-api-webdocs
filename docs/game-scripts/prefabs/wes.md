---
id: wes
title: Wes
description: Defines the Wes player character with unique penalties and bonuses for mining, chopping, and hammering, while reducing insulation effectiveness.
tags: [player, combat, crafting, temperature, hounds]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 5ff4a9eb
system_scope: player
---

# Wes

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
`wes.lua` defines the character prefab for Wes, a playable character in Don't Starve Together who trades durability and insulation for enhanced effectiveness in mining, chopping, and hammering actions. This file uses `MakePlayerCharacter` to construct the character and applies multiple component-level modifications via `common_postinit` and `master_postinit`. Key mechanics include reduced insulation (making temperature regulation harder), increased hound targeting, lower max stats (health, sanity, hunger), and boosted work multipliers for core actions. The character also gains special tags (`mime`, `balloonomancer`) and quagmire-specific tagging.

## Usage example
```lua
-- The character is created automatically by the game; use this as reference when modding:
local wes = require("prefabs/wes")
-- To modify Wes's behavior, hook into `common_postinit` or `master_postinit` via mod overrides
-- Example: Increase work multiplier for mining
inst.components.workmultiplier:AddMultiplier(ACTIONS.MINE, 1.2, "my_mod")
```

## Dependencies & tags
**Components used:** `health`, `hunger`, `sanity`, `foodaffinity`, `temperature`, `grogginess`, `playerlightningtarget`, `workmultiplier`, `efficientuser`, `combat`, `houndedtarget`, `luckuser` (commented out)
**Tags:** `mime`, `balloonomancer`, `quagmire_cheapskate` (only in quagmire mode)

## Properties
No public properties are defined directly in this file. All state is managed by attached components (e.g., `inst.components.health.maxhealth`), which are initialized with values from `TUNING`.

## Main functions
This file does not expose standalone public functions. Core logic resides in `common_postinit(inst)` and `master_postinit(inst)`, which are callbacks passed to `MakePlayerCharacter`.

### `common_postinit(inst)`
*   **Description:** Runs early in character initialization on both client and server. Adds character tags and applies animation overrides.
*   **Parameters:** `inst` (Entity) — the entity representing Wes.
*   **Returns:** Nothing.
*   **Error states:** None; safe to call on all game modes.

### `master_postinit(inst)`
*   **Description:** Runs on the server (after world join) to configure gameplay-affecting properties, including health, hunger, sanity, insulation, work multipliers, hound targeting, and combat multipliers.
*   **Parameters:** `inst` (Entity) — the entity representing Wes.
*   **Returns:** Nothing.
*   **Error states:** May silently skip `houndedtarget` and `efficientuser` components if already present; checks for `TheNet:GetServerGameMode()` to branch behavior (e.g., special handling for `lavaarena`).

## Events & listeners
- **Listens to:** None explicitly defined in this file.
- **Pushes:** `event_server_data("lavaarena", "prefabs/wes").master_postinit(inst)` is invoked conditionally during `master_postinit` when in lava arena mode, but this uses an external function rather than local event registration.