---
id: wx78_scanner
title: Wx78 Scanner
description: Defines the WX78 scanner item, deployed scanner entity, succeeded state, and FX prefabs for scanning creatures and unlocking modules.
tags: [prefab, wx78, scanner, entity]
sidebar_position: 10
last_updated: 2026-04-27
build_version: 722832
change_status: stable
category_type: prefabs
source_hash: 957cf69d
system_scope: entity
---

# Wx78 Scanner

> Based on game build **722832** | Last updated: 2026-04-27

## Overview
`wx78_scanner.lua` registers four related prefabs that form the WX78 scanning system: the inventory item (`wx78_scanner_item`), the deployed scanner entity (`wx78_scanner`), the succeeded harvestable state (`wx78_scanner_succeeded`), and scanning visual FX (`wx78_scanner_fx`). The item is deployable by WX78 characters; once deployed, the scanner follows the owner and searches for unscanned creatures. Upon successful scanning, it transitions to the succeeded state, allowing the owner to harvest a blueprint/module recipe. The file handles client-side rendering, server-side scanning logic, and network replication of scanner state via netvars.

## Usage example
```lua
-- Spawn the inventory item:
local item = SpawnPrefab("wx78_scanner_item")
item.components.inventoryitem:GiveToPlayer(player)

-- Spawn the deployed scanner (typically via deployment):
local scanner = SpawnPrefab("wx78_scanner")
scanner.Transform:SetPosition(x, y, z)
scanner.components.follower:SetLeader(player)

-- Spawn the succeeded state (internal transition):
local succeeded = SpawnPrefab("wx78_scanner_succeeded")
succeeded:SetUpFromScanner(scanner)
```

## Dependencies & tags
**External dependencies:**
- `wx78_moduledefs` -- provides `GetCreatureScanDataDefinition` for scan data lookup.
- `brains/wx78_scannerbrain` -- AI brain attached to the deployed scanner.

**Components used:**
- `inspectable` -- allows players to inspect status.
- `inventoryitem` -- enables carrying the item version.
- `entitytracker` -- tracks scan targets and lock-ons.
- `updatelooper` -- runs proximity scanning and range checks every frame.
- `deployable` -- allows placement from inventory (item version).
- `follower` -- makes deployed scanner follow the owner.
- `locomotor` -- handles movement for the deployed scanner.
- `timer` -- manages scan durations, flash intervals, and timeouts.
- `activatable` -- allows right-click deactivation.
- `cattoy` -- handles interaction with cats.
- `teacher` -- teaches the recipe upon harvest (succeeded version).
- `harvestable` -- allows harvesting the succeeded scanner.

**Tags:**
- `CLASSIFIED`, `DECOR`, `NOCLICK` -- added to ring FX.
- `usedeploystring` -- added to item version.
- `companion`, `NOBLOCK`, `scarytoprey`, `cattoyairborne` -- added to deployed scanner.
- `FX` -- added to scanner FX prefab.
- `upgrademoduleowner` -- required on deployer to deploy.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `assets` | table | --- | Array of animation and image assets loaded for all scanner prefabs. |
| `item_prefabs` | table | `{"scandata", "wx78_scanner"}` | Prefab dependencies for the item version. |
| `scanner_prefabs` | table | `{"wx78_scanner_fx", "wx78_scanner_succeeded"}` | Prefab dependencies for the deployed scanner. |
| `RING_FX` | table | `{NONE=0, SCANNING=1, ...}` | Enum for scanner ring visual states (None, Scanning, Failed, Success). |
| `SCAN_CAN` | table | `{"animal", "character", ...}` | List of target tags allowed for scanning. |
| `SCAN_CANT` | table | `{"DECOR", "FX", ...}` | List of target tags excluded from scanning. |
| `CIRCLE_RADIUS_SCALE` | constant | `10.67` | Scale factor for calculating ring FX radius based on proximity distance. |
| `MAX_FLASH_TIME` | constant | `2` | Maximum duration for top light flash timer. |
| `MIN_FLASH_TIME` | constant | `0.15` | Minimum duration for top light flash timer. |
| `ITEM_FLOATER_SCALE` | table | `{0.8, 1.0, 1.0}` | Scale values for inventory item floating animation. |
| `FALL_DELAY` | constant | `22 * FRAMES` | Delay before scan data entity marks itself as landed. |
| `_showringfx` | net_tinybyte | `0` | Netvar mirroring ring FX state to clients (scanner prefab). |
| `_radarboosters` | net_float | `0` | Netvar mirroring radar booster count to clients (scanner prefab). |
| `_scanned_id` | number | `nil` | Scan ID of successfully scanned creature, set in `OnSuccessfulScan()` and `on_scanner_load()`. |
| `_module_recipe_to_teach` | string | `nil` | Recipe name to teach on harvest, set in `OnSuccessfulScan()` and `on_scanner_save()`. |
| `_module_recipe` | string | `nil` | Recipe name for succeeded scanner, set in `SetUpFromScanner()` and `on_succeeded_load()`. |
| `TOP_LIGHT_FLASH_TIMERNAME` | constant | `"toplightflash_tick"` | Timer name gating top light flash logic in `OnUpdateScanCheck()` and `on_scanner_timer_done()`. |
| `DELAY_COMPLAIN_CAT` | constant | `0.3` | Base delay for WX78 complaint after cat interaction in `OnPlayedFromCat()`. |
| `DELAY_COMPLAIN_CAT_VAR` | constant | `0.2` | Random variance added to cat complaint delay in `OnPlayedFromCat()`. |
| `TUNING.WX78_SCANNER_SCANDIST` | constant | --- | Base scanning distance for creatures. |
| `TUNING.WX78_SCANNER_DISTANCES` | table | --- | Table of distance thresholds and ping times for proximity alerts. |
| `TUNING.WX78_SCANNER_TIMEOUT` | constant | --- | Time before succeeded scanner reverts to item if not harvested. |

## Main functions
### `itemfn()`
*   **Description:** Client-side constructor for the inventory item prefab. Creates physics, animation, and client components. On master, attaches server components (`inventoryitem`, `deployable`, `entitytracker`, `updatelooper`) and sets deployment logic. Returns `inst`.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** Errors if required components (`inventoryitem`, `entitytracker`, `deployable`) are missing when assigned callbacks (`OwnerFn`, `LoopFn`, `CanDeploy`, `OnScannerDeployed`) execute — no nil guards present in callback bodies.

### `scannerfn()`
*   **Description:** Client-side constructor for the deployed scanner entity. Creates flying physics, animation, and netvars. On master, attaches gameplay components (`follower`, `locomotor`, `activatable`, `timer`, `cattoy`) and starts the proximity scan loop. Assigns behavior methods to `inst` (e.g., `StartScanFX`, `StopAllScanning`). Returns `inst`.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** Errors if required components (`follower`, `entitytracker`, `activatable`, `timer`, `dataanalyzer`, `builder`) are missing when assigned callbacks (`OnChangedLeader`, `OnActivate`, `OnUpdateScanCheck`, `TryFindTarget`) execute — no nil guards present in callback bodies.

### `scannersucceededfn()`
*   **Description:** Client-side constructor for the succeeded scanner state (harvestable). Creates physics and animation. On master, attaches `teacher` and `harvestable` components, starts flash timer, and sets timeout to revert to item if not harvested. Returns `inst`.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** Errors if required components (`teacher`, `harvestable`, `timer`, `builder`, `inventory`) are missing when assigned callbacks (`OnTeach`, `on_harvested`, `can_harvest`) execute — no nil guards present in callback bodies.

### `scanfx_fn()`
*   **Description:** Constructor for the scanning visual FX entity. Creates animation entity, plays loop, and attaches `goAway` method to remove itself after animation. No server logic. Returns `inst`.
*   **Parameters:** None
*   **Returns:** entity instance
*   **Error states:** None.

### `StartScanFX(inst, target)`
*   **Description:** Spawns and attaches `wx78_scanner_fx` to the `target`. Plays looping telemetry sound. Scales FX based on target physics radius.
*   **Parameters:**
    - `inst` -- scanner entity
    - `target` -- entity being scanned
*   **Returns:** None
*   **Error states:** None — checks `target ~= nil` and `inst.scan_fx == nil` before spawning.

### `StopAllScanning(inst, status)`
*   **Description:** Halts all scanning activities. Removes update loops, clears target tracking, stops timers, and sets ring FX state based on `status` ("fail", "succeed", or nil).
*   **Parameters:**
    - `inst` -- scanner entity
    - `status` -- string ("fail", "succeed") or nil
*   **Returns:** None
*   **Error states:** None — safely handles nil target and timer states.

### `SpawnData(inst)`
*   **Description:** Spawns `scandata` item if scan was successful. Calculates amount from owner's `dataanalyzer`, sets stack size, and drops at scanner position.
*   **Parameters:** `inst` -- scanner entity
*   **Returns:** None
*   **Error states:** None — guards against missing owner or `dataanalyzer` component.

### `TryFindTarget(inst)`
*   **Description:** Scans surrounding entities for valid scan targets. Prioritizes blueprintable things (unknown recipes). Triggers `OnTargetFound` if valid target exists.
*   **Parameters:** `inst` -- scanner entity
*   **Returns:** None
*   **Error states:** None — validates owner and range before searching.

### `OnSuccessfulScan(inst)`
*   **Description:** Marks scan as done, sets `activatable` state, stores recipe to teach, and triggers `StopAllScanning("succeed")`.
*   **Parameters:** `inst` -- scanner entity
*   **Returns:** None
*   **Error states:** None — validates target and scan data before storing.

### `OnScanFailed(inst)`
*   **Description:** Stops scanning FX and restarts proximity scan loop. Called when target is lost or invalid.
*   **Parameters:** `inst` -- scanner entity
*   **Returns:** None
*   **Error states:** None.

## Events & listeners
- **Scanner Listens to:** `timerdone` -- handles flash ticks and proximity scan start.
- **Scanner Listens to:** `onremove` -- cleans up sounds and FX on entity removal.
- **Scanner Listens to:** `rangecircuitupdate` (on leader) -- updates radar booster count.
- **Scanner Listens to:** `onremove` (on target) -- triggers scan failure if target dies.
- **Scanner Pushes:** `turn_off` -- signals item reversion or deactivation.
- **Scanner Pushes:** `deployed` -- signals successful deployment.
- **Scanner Pushes:** `scan_success` -- signals successful scan completion.
- **Succeeded Listens to:** `timerdone` -- handles flash ticks and timeout reversion.
- **Succeeded Pushes:** `on_landed` -- signals spawn completion.
- **Succeeded Pushes:** `learnrecipe` (via teacher) -- unlocks recipe for harvester.