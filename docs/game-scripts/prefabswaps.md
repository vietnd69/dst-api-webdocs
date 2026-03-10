---
id: prefabswaps
title: Prefabswaps
description: Manages configurable prefab substitutions used during world generation, supporting primary/non-primary variants, location-based exclusions, and customization-controlled prefabs.
tags: [worldgen, configuration, prefabs]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: f9f30053
system_scope: world
---

# Prefabswaps

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
`PrefabSwaps` is a world generation utility module that enables dynamic, configurable replacement of prefabs during world generation. It supports categorized sets of interchangeable prefabs (e.g., `grass`, `twigs`, `berries`), weighted selection based on world settings, location constraints, and advanced proxy resolution for customizations and randomized variants. This module ensures only selected sets are active and allows other systems to check whether a given prefab should be excluded due to being inactive in the current configuration.

## Usage example
```lua
-- Register a custom grass variant
PrefabSwaps.AddPrefabSwap({
    category = "grass",
    name = "sandy grass",
    prefabs = { "sandgrass" },
    weight = 2,
    exclude_locations = { "cave" },
})

-- Select which sets to use for a given world location and options
PrefabSwaps.SelectPrefabSwaps("forest", {
    prefabswaps_start = "balanced", -- or "classic", "highly random", or nil
})

-- Later, during world gen, check if a prefab should be spawned
if not PrefabSwaps.IsPrefabInactive("sandgrass") then
    -- spawn logic
end
```

## Dependencies & tags
**Components used:** None  
**Tags:** None identified  
**Dependencies:** Uses `util/weighted_list` for weighted random selection.

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `_base_sets` | table | `{}` | Internal storage mapping category names to lists of swap sets. Not public. |
| `_proxies` | table | `{}` | Internal proxy map for temporary prefab names to real prefabs (e.g., `"ground_twigs"` → `"twigs"`). |
| `_customization_proxies` | table | `{}` | Internal map for prefabs whose spawning is controlled by a customization setting. |
| `_randomization_proxies` | table | `{}` | Internal map for prefabs that resolve to a random choice from a list. |
| `_selected_sets` | table? | `nil` | Cached copy of `_base_sets` after `SelectPrefabSwaps` is called, with `active` flags set on chosen sets. |
| `_inactive_prefabs` | table | `{}` | Set of prefab names excluded due to being in non-selected swap sets. Used for quick lookup. |

## Main functions
### `AddPrefabSwap(t)`
* **Description:** Registers a new prefab swap set under a given category. The first entry in a category is automatically marked as `primary`. If a subsequent entry sets `primary = true`, it replaces the prior primary entry.
* **Parameters:** `t` (table) — A table with fields:
  - `category` (string, required) — Group identifier (e.g., `"grass"`).
  - `name` (string, required) — Human-readable name.
  - `prefabs` (table, required) — Array of prefab names this set uses.
  - `weight` (number) — Relative selection weight (default: `1`).
  - `primary` (boolean) — Whether this is the default set for the category.
  - `exclude_locations` (table?) — Array of locations where this set is invalid (e.g., `{"cave"}`).
  - `required_locations` (table?) — Array of locations where this set *must* be selected (if present, `primary` sets are ignored for location constraints).
* **Returns:** Nothing.
* **Error states:** No explicit error handling; malformed `prefabs` or `category` will cause issues at selection time.

### `GetBasePrefabSwaps()`
* **Description:** Returns the internal storage of all registered swap sets by category.
* **Parameters:** None.
* **Returns:** table — `_base_sets`, mapping category strings to arrays of swap set tables.

### `AddPrefabProxy(proxy, prefab)`
* **Description:** Registers a temporary "proxy" prefab name that should be replaced with a real prefab during world gen (e.g., `"ground_twigs"` → `"twigs"`). Proxy names must not conflict with existing prefabs.
* **Parameters:** 
  - `proxy` (string) — Temporary name used in world gen tables.
  - `prefab` (string) — Actual prefab to use.
* **Returns:** Nothing.

### `ResolvePrefabProxy(proxy)`
* **Description:** Resolves a proxy name to its actual prefab, returning the input unchanged if no mapping exists.
* **Parameters:** `proxy` (string) — Proxy name.
* **Returns:** string — The resolved prefab name or the original proxy.

### `AddCustomizationPrefab(proxy, prefab)`
* **Description:** Registers a proxy that should be replaced with a real prefab *after* initial entity spawning—typically to allow runtime customization toggles to control whether it spawns.
* **Parameters:** 
  - `proxy` (string) — Temporary name.
  - `prefab` (string) — Actual prefab name.
* **Returns:** Nothing.
* **Error states:** Asserts if `prefab` is already mapped to another proxy (no multi-level proxies allowed).

### `ResolveCustomizationPrefab(proxy)`
* **Description:** Resolves a customization proxy to its real prefab, if registered.
* **Parameters:** `proxy` (string) — Proxy name.
* **Returns:** string? — The real prefab name or `nil` if no mapping exists.

### `AddRandomizationPrefab(proxy, prefabs)`
* **Description:** Registers a proxy whose resolution should randomly pick one prefab from the given list.
* **Parameters:** 
  - `proxy` (string) — Proxy name.
  - `prefabs` (table) — Array of valid prefab names to choose from.
* **Returns:** Nothing.

### `IsRandomizationPrefab(proxy)`
* **Description:** Checks whether `proxy` is registered as a randomization proxy.
* **Parameters:** `proxy` (string) — Proxy name.
* **Returns:** boolean — `true` if registered, otherwise `false`.

### `ResolveRandomizationPrefab(proxy)`
* **Description:** Randomly selects and returns one prefab from the list registered under `proxy`.
* **Parameters:** `proxy` (string) — Proxy name.
* **Returns:** string? — A randomly chosen prefab, or `nil` if `proxy` is not registered.

### `SelectPrefabSwaps(location, world_gen_options, override_sets)`
* **Description:** Selects active swap sets based on world generation configuration. Marks non-primary sets as inactive for all categories and populates `_inactive_prefabs`.
* **Parameters:** 
  - `location` (string) — Current location (e.g., `"forest"`, `"cave"`).
  - `world_gen_options` (table?) — World gen options table, possibly containing `"prefabswaps_start"` set to `"classic"`, `"highly random"`, or `nil`.
  - `override_sets` (table?) — If present, overrides selections per category using exact `set.name` matches.
* **Returns:** Nothing.
* **Error states:** No explicit error handling; missing/invalid `override_sets` entries are silently ignored.

### `IsPrefabInactive(prefab)`
* **Description:** Returns whether a given prefab was excluded due to belonging to a non-selected swap set.
* **Parameters:** `prefab` (string) — Prefab name.
* **Returns:** boolean — `true` if the prefab should be ignored during spawning, otherwise `false`.

## Events & listeners
None identified.