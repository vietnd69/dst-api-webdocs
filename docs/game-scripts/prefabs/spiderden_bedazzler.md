---
id: spiderden_bedazzler
title: Spiderden Bedazzler
description: A single-use consumable item that applies a bedazzling buff to a target upon use, designed for spider-related gameplay interactions.
tags: [consumable, buff, spider, combat]
sidebar_position: 10

last_updated: 2026-03-07
build_version: 714014
change_status: stable
category_type: prefabs
source_hash: 3a9a4f92
system_scope: inventory
---

# Spiderden Bedazzler

> Based on game build **714014** | Last updated: 2026-03-07

## Overview
The `spiderden_bedazzler` prefab is a consumable inventory item that grants a temporary visual and functional effect (bedazzling) to a target entity. It uses the `finiteuses` component to manage a single use and triggers self-destruction when depleted. The `bedazzler` component handles the core bedazzling logic, with its usage amount configured via `TUNING.BEDAZZLER_USE_AMOUNT`.

## Usage example
```lua
local inst = SpawnPrefab("spiderden_bedazzler")
-- The prefab is automatically configured with finiteuses and bedazzler components
-- It will be consumed once used, and removed from the world afterward
```

## Dependencies & tags
**Components used:** `inventoryitem`, `inspectable`, `finiteuses`, `bedazzler`  
**Tags:** None identified.

## Properties
No public properties.

## Main functions
### Constructor (`fn`)
*   **Description:** Constructs the entity, sets up visual and network properties, and initializes the `finiteuses` and `bedazzler` components. On the master sim, it configures consumption behavior and cleanup.
*   **Parameters:** None (called internally by the prefab system).
*   **Returns:** `inst` — the constructed entity, or `nil` on non-master clients.
*   **Error states:** Returns early on non-master clients before adding gameplay components.

### `inst.components.finiteuses:SetOnFinished(fn)`
*   **Description:** Registers a callback to be executed when the item runs out of uses (i.e., is consumed). In this case, it removes the entity.
*   **Parameters:** `fn` (function) — callback function that takes no arguments.
*   **Returns:** Nothing.

### `inst.components.bedazzler:SetUseAmount(use_amount)`
*   **Description:** Sets the amount of bedazzling effect applied per use.
*   **Parameters:** `use_amount` (number) — the magnitude of the bedazzling effect, sourced from `TUNING.BEDAZZLER_USE_AMOUNT`.
*   **Returns:** Nothing.

## Events & listeners
None identified.