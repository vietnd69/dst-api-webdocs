---
id: vault_switch
title: Vault Switch
description: A decorative interactive switch component used in vault-related structures, supporting both standalone and base-mounted configurations with associated sound and animation logic.
tags: [decoration, interactive, sound, vault]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 7636c43d
system_scope: environment
---

# Vault Switch

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `vault_switch` prefab provides an interactive, non-pickable switch component for vault-themed environmental structures. It integrates with the `inspectable` and `pickable` components to support state inspection and fixed placement. Two variants are defined: `vault_switch` (the toggleable switch) and `vault_switch_base` (the pedestal that holds multiple switches with animation and looping sound). The component is primarily used for decorative and thematic purposes in grotto and vault areas.

## Usage example
```lua
-- Example of spawning and customizing a vault switch
local switch = SpawnPrefab("vault_switch")
switch.Transform:SetPosition(x, y, z)
switch:AddTag("vault_switch_custom") -- Optional custom tag

-- Example of spawning a base with 3 attached switches
local base = SpawnPrefab("vault_switch_base")
base.Transform:SetPosition(x, y, z)
```

## Dependencies & tags
**Components used:** `inspectable`, `pickable`, `transform`, `animstate`, `network`, `soundemitter`
**Tags:** Adds `decor`, `NOCLICK` to `vault_switch_base`; `vault_switch` does not add tags beyond internal ones.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `inst.prefab` | string | `"vault_switch"` | Prefab name override for network sync |
| `inst.components.inspectable.getstatus` | function | `GetStatus` | Returns `"VALID"` for inspection UI |

## Main functions
### `CreatePad()`
*   **Description:** Creates a small, non-networked, background-layered decorative pad entity used as a visual base for `vault_switch`. It is parented to the switch entity on non-dedicated clients.
*   **Parameters:** None.
*   **Returns:** Entity instance with `animstate`, `transform`, and tags `decor`, `NOCLICK`.

### `GetStatus(inst)`
*   **Description:** Provides inspection status text for the switch.
*   **Parameters:** `inst` (entity) — the vault switch instance.
*   **Returns:** `"VALID"` (string) — indicating the switch is functional and properly placed.

## Events & listeners
- **Listens to:** None — no event listeners are registered directly in this file.
- **Pushes:** None — no events are pushed directly in this file.