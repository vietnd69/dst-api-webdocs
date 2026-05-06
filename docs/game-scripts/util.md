---
id: util
title: Util
description: A comprehensive utility module providing helper functions for table manipulation, string operations, math calculations, spawning, file resolution, memory tracking, and specialized classes like RingBuffer and LinkedList.
tags: [utility, helpers, data-structures]
sidebar_position: 10
last_updated: 2026-04-21
build_version: 722832
change_status: stable
category_type: root
source_hash: d1bd03f2
system_scope: world
---

# Util

> Based on game build **722832** | Last updated: 2026-04-21

## Overview
`util.lua` is a core utility module that provides a wide collection of helper functions used throughout the Don't Starve Together codebase. It includes table manipulation utilities, string extensions, math and vector helpers, spawn functions, file path resolution, memory tracking tools, and several reusable class definitions (RingBuffer, DynamicPosition, LinkedList, PRNG_Uniform). This module is required by many other systems and does not attach to entities as a component. Functions are accessed directly after requiring the module.

## Usage example
```lua
require "util"  -- Functions are exposed globally after requiring

-- Table utilities
local contains = table.contains(myTable, "value")
local keys = table.getkeys(myTable)
local copied = deepcopy(originalTable)

-- String utilities
local parts = myString:split(":")
local matches = string.findall(myString, "pattern")

-- Spawn utilities
local inst = SpawnAt("prefab_name", position, scale, offset)

-- Class usage
local buffer = RingBuffer(10)
buffer:Add("entry")
local item = buffer:Get(1)

-- Math utilities
local distance = distsq(pos1, pos2)
local randomItem = GetRandomItem(choicesTable)
```

## Dependencies & tags
**External dependencies:**
- `TheSim` -- file operations, memory tracking, prefab loading, encoding/decoding
- `TheInput` -- input handling for debug spawn
- `TheWorld` -- world access for platform detection and map queries
- `TUNING` -- game balance constants for controller utilities
- `Prefabs` -- prefab registry for spawn validation

**Components used:**
- `boatringdata` -- accessed in `SnapToBoatEdge` for boat radius and segment data
- `placer` -- accessed in `ControllerPlacer_Boat_SpotFinder` for boat placement logic

**Tags:**
- `blinkfocus` -- check -- searched via TheSim:FindEntities in ControllerReticle_Blink_GetPosition

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `RingBuffer` | class | — | Circular buffer class with configurable max length. |
| `DynamicPosition` | class | — | Position tracker that follows moving walkable platforms. |
| `LinkedList` | class | — | Singly linked list class with iterator support. |
| `PRNG_Uniform` | class | — | Pseudo-random number generator based on 2^40-5^17 multiplicative generator. |

## Main functions

### `DumpTableXML(t, name)`
* **Description:** Recursively converts a table to XML-formatted string representation. Nested tables become `<table>` elements with name attributes; primitive values become self-closing tags with type and value attributes.
* **Parameters:**
  - `t` -- table to dump
  - `name` -- root element name (default `""`)
* **Returns:** XML-formatted string representation of the table.
* **Error states:** None.

### `DebugSpawn(prefab)`
* **Description:** Spawns a prefab at the console world position for debugging. Loads the prefab if needed and validates it is not a skin before spawning.
* **Parameters:**
  - `prefab` -- string prefab name to spawn
* **Returns:** Spawned entity instance, or `nil` if spawn failed.
* **Error states:** None (gracefully returns `nil` if `TheSim` or `TheInput` is unavailable).

### `GetClosest(target, entities)`
* **Description:** Finds the closest entity to a target from a list of entities using squared distance comparison.
* **Parameters:**
  - `target` -- entity with `GetPosition()` method
  - `entities` -- table of entities to search
* **Returns:** Closest entity instance, or `nil` if entities table is empty.
* **Error states:** Errors if `target` or any entity in `entities` lacks `GetPosition()` method.

### `SpawnAt(prefab, loc, scale, offset)`
* **Description:** Spawns a prefab at a specified location with optional scale and offset. Accepts either a position vector or an entity with `GetPosition()` as the location parameter.
* **Parameters:**
  - `prefab` -- string prefab name or entity with `.prefab` property
  - `loc` -- position vector or entity with `GetPosition()` method
  - `scale` -- optional scale vector or number
  - `offset` -- optional position offset vector
* **Returns:** Spawned entity instance, or `nil` if spawn failed.
* **Error states:** None (returns `nil` gracefully if `loc` or `prefab` is missing).

### `string:split(sep)`
* **Description:** String extension method that splits a string by a separator and returns an array of substrings.
* **Parameters:**
  - `sep` -- separator string (default `":"`)
* **Returns:** Array table of split substrings.
* **Error states:** None.

### `string.findall(s, pattern, init, plain)`
* **Description:** Like `string.find`, but returns an array of `{first, last}` position pairs for all matches. Never returns `nil`; returns empty table if no matches.
* **Parameters:**
  - `s` -- string to search
  - `pattern` -- Lua pattern to match
  - `init` -- starting index (default `1`)
  - `plain` -- boolean for plain text matching (default `nil`)
* **Returns:** Array of `{first, last}` position tables.
* **Error states:** None.

### `string.rfind(s, pattern, init, plain)`
* **Description:** Finds the last match of a pattern in a string. Returns the first and last positions of the last match.
* **Parameters:**
  - `s` -- string to search
  - `pattern` -- Lua pattern to match
  - `init` -- starting index (default `1`)
  - `plain` -- boolean for plain text matching (default `nil`)
* **Returns:** `first, last` positions of last match, or `nil` if no match.
* **Error states:** None.

### `string.rfind_plain(s, query, init)`
* **Description:** Finds the last match of a plain text query (non-pattern) in a string. Uses string reversal for efficiency.
* **Parameters:**
  - `s` -- string to search
  - `query` -- plain text to find (no pattern characters)
  - `init` -- starting index (default `1`)
* **Returns:** `first, last` positions of last match, or `nil` if no match.
* **Error states:** None.

### `table.contains(table, element)`
* **Description:** Checks if a value exists in a table (array-style search by value).
* **Parameters:**
  - `table` -- table to search
  - `element` -- value to find
* **Returns:** `true` if found, `false` otherwise.
* **Error states:** None (returns `false` if table is `nil`).

### `table.containskey(table, key)`
* **Description:** Checks if a specific key exists in a table. More explicit than `table[key] ~= nil` for documentation purposes.
* **Parameters:**
  - `table` -- table to search
  - `key` -- key to find
* **Returns:** `true` if key exists, `false` otherwise.
* **Error states:** None (returns `false` if table is `nil`).

### `table.getkeys(t)`
* **Description:** Returns an array table containing all keys from the input table.
* **Parameters:**
  - `t` -- table to extract keys from
* **Returns:** Array table of keys.
* **Error states:** None.

### `table.reverse(tab)`
* **Description:** Returns a new array table with elements in reverse order. Does not modify the original table.
* **Parameters:**
  - `tab` -- indexed array table to reverse
* **Returns:** New reversed array table.
* **Error states:** None.

### `table.reverse_inplace(t)`
* **Description:** Reverses an array table in-place by swapping elements from front and back. More memory-efficient than `table.reverse`.
* **Parameters:**
  - `t` -- indexed array table to reverse
* **Returns:** The same table (modified in-place).
* **Error states:** None.

### `table.invert(t)`
* **Description:** Creates a new table where keys and values are swapped. Useful for reverse lookups.
* **Parameters:**
  - `t` -- table to invert
* **Returns:** New table with swapped keys and values.
* **Error states:** None.

### `table.removearrayvalue(t, lookup_value)`
* **Description:** Removes the first occurrence of a value from an array-style table. Uses `table.remove` to maintain array indices.
* **Parameters:**
  - `t` -- array table to modify
  - `lookup_value` -- value to remove
* **Returns:** The removed value, or `nil` if not found.
* **Error states:** None.

### `table.removetablevalue(t, lookup_value)`
* **Description:** Removes the first occurrence of a value from any table (not just arrays). Sets the key to `nil`.
* **Parameters:**
  - `t` -- table to modify
  - `lookup_value` -- value to remove
* **Returns:** The removed value, or `nil` if not found.
* **Error states:** None.

### `table.reverselookup(t, lookup_value)`
* **Description:** Finds the key associated with a given value in a table.
* **Parameters:**
  - `t` -- table to search
  - `lookup_value` -- value to find
* **Returns:** Key associated with the value, or `nil` if not found.
* **Error states:** None.

### `table.count(t, value)`
* **Description:** Counts occurrences of a specific value in a table. If `value` is `nil`, counts all entries.
* **Parameters:**
  - `t` -- table to count
  - `value` -- value to count (optional, counts all if `nil`)
* **Returns:** Number of occurrences.
* **Error states:** None.

### `table.setfield(Table, Name, Value)`
* **Description:** Sets a nested field in a table using a dot-separated path string (e.g., `"A.B.C"`). Creates intermediate tables as needed.
* **Parameters:**
  - `Table` -- base table (default `_G` if not a table)
  - `Name` -- dot-separated field path string
  - `Value` -- value to set
* **Returns:** None.
* **Error states:** None.

### `table.getfield(Table, Name)`
* **Description:** Accesses a nested field in a table using a dot-separated path string.
* **Parameters:**
  - `Table` -- base table (default `_G` if not a table)
  - `Name` -- dot-separated field path string
* **Returns:** Value at the path, or `nil` if any intermediate table is missing.
* **Error states:** None.

### `table.typecheckedgetfield(Table, Type, ...)`
* **Description:** Safely accesses a nested field with type checking. Returns the value only if it matches the expected type.
* **Parameters:**
  - `Table` -- base table
  - `Type` -- expected type string (e.g., `"string"`, `"table"`)
  - `...` -- field names as separate arguments
* **Returns:** Value if type matches, or `nil`.
* **Error states:** None.

### `table.findfield(Table, Name)`
* **Description:** Recursively searches for a field name in a table and returns the dot-separated path to it.
* **Parameters:**
  - `Table` -- table to search
  - `Name` -- field name to find
* **Returns:** Dot-separated path string, or `nil` if not found.
* **Error states:** None.

### `table.findpath(Table, Names, indx)`
* **Description:** Recursively searches for a sequence of field names and returns the dot-separated path.
* **Parameters:**
  - `Table` -- table to search
  - `Names` -- array of field names or single string
  - `indx` -- starting index in Names array (default `1`)
* **Returns:** Dot-separated path string, or `nil` if not found.
* **Error states:** None.

### `table.keysareidentical(a, b)`
* **Description:** Checks if two tables have exactly the same keys (ignores values).
* **Parameters:**
  - `a` -- first table
  - `b` -- second table
* **Returns:** `true` if keys match exactly, `false` otherwise.
* **Error states:** None.

### `RemoveByValue(t, value)`
* **Description:** Removes all instances of a value from an array-style table. Iterates backwards to handle multiple removals safely.
* **Parameters:**
  - `t` -- array table to modify
  - `value` -- value to remove
* **Returns:** None.
* **Error states:** None.

### `GetFlattenedSparse(tab)`
* **Description:** Converts a sparse indexed table into a dense array by collecting and sorting indices, then reindexing sequentially.
* **Parameters:**
  - `tab` -- sparse indexed table
* **Returns:** New dense array table.
* **Error states:** None.

### `GetTableSize(table)`
* **Description:** Counts the number of key-value pairs in a table (like `#t` but works for map-style tables).
* **Parameters:**
  - `table` -- table to count
* **Returns:** Number of entries.
* **Error states:** None.

### `GetRandomItem(choices)`
* **Description:** Selects a random value from a table. Works with both array and map-style tables.
* **Parameters:**
  - `choices` -- table of values to choose from
* **Returns:** Random value from the table, or `nil` if table is empty.
* **Error states:** Asserts if picked is nil after iteration (indicates table size mismatch during iteration).

### `GetRandomItemWithIndex(choices)`
* **Description:** Selects a random key-value pair from a table. Returns both the key and value.
* **Parameters:**
  - `choices` -- table to choose from
* **Returns:** `idx, item` -- random key and its associated value.
* **Error states:** Asserts if idx or item is nil after iteration (indicates table size mismatch during iteration).

### `GetRandomKey(choices)`
* **Description:** Selects a random key from a table.
* **Parameters:**
  - `choices` -- table to choose from
* **Returns:** Random key from the table.
* **Error states:** Asserts if picked is nil after iteration (indicates table size mismatch during iteration).

### `PickSome(num, choices)`
* **Description:** Picks `num` unique random items from an array-style table without replacement. Modifies a local copy of the choices table.
* **Parameters:**
  - `num` -- number of items to pick
  - `choices` -- array table to pick from
* **Returns:** Array of picked items.
* **Error states:** None.

### `PickSomeWithDups(num, choices)`
* **Description:** Picks `num` random items from an array-style table with replacement (duplicates allowed).
* **Parameters:**
  - `num` -- number of items to pick
  - `choices` -- array table to pick from
* **Returns:** Array of picked items (may contain duplicates).
* **Error states:** None.

### `ConcatArrays(ret, ...)`
* **Description:** Appends multiple array-style tables to the first table passed in. Modifies the first table.
* **Parameters:**
  - `ret` -- base array table to append to
  - `...` -- additional arrays to append
* **Returns:** The modified base table.
* **Error states:** None.

### `JoinArrays(...)`
* **Description:** Creates a new array by concatenating multiple array-style tables. Does not modify input tables.
* **Parameters:**
  - `...` -- arrays to join
* **Returns:** New concatenated array table.
* **Error states:** None.

### `ExceptionArrays(tSource, tException)`
* **Description:** Returns a new array with elements from `tSource` that are not in `tException` (set difference).
* **Parameters:**
  - `tSource` -- source array
  - `tException` -- array of values to exclude
* **Returns:** New array with excluded values removed.
* **Error states:** None.

### `ArrayUnion(...)`
* **Description:** Merges multiple arrays, keeping only unique values (set union).
* **Parameters:**
  - `...` -- arrays to merge
* **Returns:** New array with unique values from all input arrays.
* **Error states:** None.

### `ArrayIntersection(...)`
* **Description:** Returns only values found in all provided arrays (set intersection).
* **Parameters:**
  - `...` -- arrays to intersect
* **Returns:** New array with values present in all input arrays.
* **Error states:** None.

### `StringContainsAnyInArray(input, array)`
* **Description:** Checks if a string contains any substring from a given array.
* **Parameters:**
  - `input` -- string to search
  - `array` -- array of substrings to check
* **Returns:** `true` if any substring is found, `false` otherwise.
* **Error states:** None.

### `MergeMaps(...)`
* **Description:** Merges multiple map-style tables. Later maps overwrite duplicate keys from earlier maps.
* **Parameters:**
  - `...` -- maps to merge
* **Returns:** New merged table.
* **Error states:** None.

### `MergeMapsAdditively(...)`
* **Description:** Merges multiple map-style tables with numeric values by adding values for duplicate keys.
* **Parameters:**
  - `...` -- maps to merge (values should be numbers)
* **Returns:** New merged table with summed values.
* **Error states:** None.

### `MergeMapsDeep(...)`
* **Description:** Deep merges multiple map-style tables. Recurses into nested tables. Asserts if merging incompatible types.
* **Parameters:**
  - `...` -- maps to merge
* **Returns:** New deeply merged table.
* **Error states:** Asserts if attempting to merge tables with incompatible types at the same key.

### `MergeKeyValueList(...)`
* **Description:** Merges lists of key-value pairs in the format `{ { "key", "value" }, ... }`. Later lists overwrite duplicate keys.
* **Parameters:**
  - `...` -- key-value list tables to merge
* **Returns:** New merged key-value list.
* **Error states:** None.

### `SubtractMapKeys(base, subtract)`
* **Description:** Removes keys from `base` that exist in `subtract`. Recurses into nested tables.
* **Parameters:**
  - `base` -- base table
  - `subtract` -- table of keys to remove
* **Returns:** New table with specified keys removed.
* **Error states:** None.

### `ExtendedArray(orig, addition, mult)`
* **Description:** Creates a new array with `orig` elements followed by `addition` repeated `mult` times.
* **Parameters:**
  - `orig` -- original array
  - `addition` -- array to append multiple times
  - `mult` -- number of times to repeat `addition` (default `1`)
* **Returns:** New extended array.
* **Error states:** None.

### `FlattenTree(tree, unique)`
* **Description:** Recursively flattens a nested table tree into a single-level array. Optionally keeps only unique values.
* **Parameters:**
  - `tree` -- nested table to flatten
  - `unique` -- boolean to keep only unique values (default `false`)
* **Returns:** Flattened array table.
* **Error states:** None.

### `GetRandomWithVariance(baseval, randomval)`
* **Description:** Returns a random value within `baseval +/- randomval`.
* **Parameters:**
  - `baseval` -- base value
  - `randomval` -- variance amount
* **Returns:** Random value in range `[baseval - randomval, baseval + randomval]`.
* **Error states:** None.

### `GetRandomMinMax(min, max)`
* **Description:** Returns a random float value between min and max.
* **Parameters:**
  - `min` -- minimum value
  - `max` -- maximum value
* **Returns:** Random float in range `[min, max]`.
* **Error states:** None.

### `distsq(v1, v2, v3, v4)`
* **Description:** Calculates squared distance between two points. Supports both Vector3 objects and raw coordinate parameters.
* **Parameters:**
  - `v1` -- first position (Vector3 or x coordinate)
  - `v2` -- second position (Vector3 or y coordinate)
  - `v3` -- optional third parameter for 2D mode (y coordinate of first point)
  - `v4` -- optional fourth parameter for 2D mode (y coordinate of second point)
* **Returns:** Squared distance (number).
* **Error states:** Errors if v1 or v2 is nil (no nil guard before member access or subtraction — source comments indicate crash is acceptable).

### `GetMemoizedFilePaths()`
* **Description:** Returns the memoized file paths cache, encoded and zipped for save data.
* **Parameters:** None
* **Returns:** Zipped and encoded save data table.
* **Error states:** None.

### `SetMemoizedFilePaths(memoized_file_paths)`
* **Description:** Restores the memoized file paths cache from encoded save data.
* **Parameters:**
  - `memoized_file_paths` -- zipped and encoded save data table
* **Returns:** None.
* **Error states:** None.

### `resolvefilepath(filepath, force_path_search, search_first_path)`
* **Description:** Resolves a file path by searching through package loaders (mods first, then data directory). Asserts if file is not found.
* **Parameters:**
  - `filepath` -- relative file path to resolve
  - `force_path_search` -- boolean to force search even on console (default `false`)
  - `search_first_path` -- optional hint for most likely path
* **Returns:** Resolved absolute file path string.
* **Error states:** Asserts if file cannot be found in any search path.

### `resolvefilepath_soft(filepath, force_path_search, search_first_path)`
* **Description:** Like `resolvefilepath`, but returns `nil` instead of asserting if file is not found.
* **Parameters:**
  - `filepath` -- relative file path to resolve
  - `force_path_search` -- boolean to force search (default `false`)
  - `search_first_path` -- optional path hint
* **Returns:** Resolved absolute file path string, or `nil` if not found.
* **Error states:** None.

### `softresolvefilepath(filepath, force_path_search, search_first_path)`
* **Description:** Alias for `resolvefilepath_soft` with memoization check.
* **Parameters:**
  - `filepath` -- relative file path to resolve
  - `force_path_search` -- boolean to force search (default `false`)
  - `search_first_path` -- optional path hint
* **Returns:** Resolved absolute file path string, or `nil` if not found.
* **Error states:** None.

### `isnan(x)`
* **Description:** Checks if a value is NaN (not a number).
* **Parameters:**
  - `x` -- value to check
* **Returns:** `true` if NaN, `false` otherwise.
* **Error states:** None.

### `isinf(x)`
* **Description:** Checks if a value is positive or negative infinity.
* **Parameters:**
  - `x` -- value to check
* **Returns:** `true` if infinite, `false` otherwise.
* **Error states:** None.

### `isbadnumber(x)`
* **Description:** Checks if a value is either NaN or infinite.
* **Parameters:**
  - `x` -- value to check
* **Returns:** `true` if bad number, `false` otherwise.
* **Error states:** None.

### `mem_report()`
* **Description:** Prints a memory report showing counts of each type in the global environment. Sorted by count descending.
* **Parameters:** None
* **Returns:** None (prints to console).
* **Error states:** None.

### `TrackMem()`
* **Description:** Enables memory tracking on TheSim and stops garbage collection for accurate measurement.
* **Parameters:** None
* **Returns:** None.
* **Error states:** None.

### `DumpMem()`
* **Description:** Dumps memory stats, prints memory report, and restarts garbage collection.
* **Parameters:** None
* **Returns:** None.
* **Error states:** None.

### `checkbit(x, b)`
* **Description:** Checks if a specific bit is set in a number.
* **Parameters:**
  - `x` -- number to check
  - `b` -- bit mask
* **Returns:** `true` if bit is set, `false` otherwise.
* **Error states:** None.

### `setbit(x, b)`
* **Description:** Sets a specific bit in a number.
* **Parameters:**
  - `x` -- number to modify
  - `b` -- bit mask to set
* **Returns:** Number with bit set.
* **Error states:** None.

### `clearbit(x, b)`
* **Description:** Clears a specific bit in a number.
* **Parameters:**
  - `x` -- number to modify
  - `b` -- bit mask to clear
* **Returns:** Number with bit cleared.
* **Error states:** None.

### `IsWithinAngle(position, forward, width, testPos)`
* **Description:** Checks if a test position is within a specified angular width from a forward vector.
* **Parameters:**
  - `position` -- origin position (Vector3)
  - `forward` -- forward direction vector (Vector3)
  - `width` -- total angular width in radians
  - `testPos` -- position to test (Vector3)
* **Returns:** `true` if within angle, `false` otherwise.
* **Error states:** None.

### `GetCircleEdgeSnapTransform(segments, radius, base_pt, pt, angle)`
* **Description:** Snaps a position to the nearest segment on a circle's edge. Used for boat placement.
* **Parameters:**
  - `segments` -- number of segments on the circle
  - `radius` -- circle radius
  - `base_pt` -- circle center position (Vector3)
  - `pt` -- point to snap (Vector3)
  - `angle` -- starting angle in degrees (default `0`)
* **Returns:** `snap_point, snap_angle` -- snapped position and angle.
* **Error states:** None.

### `SnapToBoatEdge(inst, boat, override_pt)`
* **Description:** Snaps an entity to the edge of a boat using boatringdata component for radius and segment information.
* **Parameters:**
  - `inst` -- entity to snap
  - `boat` -- boat entity with `boatringdata` component
  - `override_pt` -- optional override position
* **Returns:** None.
* **Error states:** None (returns early if boat is `nil`).

### `GetAngleFromBoat(boat, x, z)`
* **Description:** Returns the angle from a boat's position to a target coordinate.
* **Parameters:**
  - `boat` -- boat entity
  - `x` -- target x coordinate
  - `z` -- target z coordinate
* **Returns:** Angle in radians, or `nil` if boat is `nil`.
* **Error states:** None.

### `string.random(Length, CharSet)`
* **Description:** Generates a random string of specified length using characters from a character set.
* **Parameters:**
  - `Length` -- length of string to generate
  - `CharSet` -- character set string (e.g., `"%l%d"` for lowercase and digits, default `"."` for all)
* **Returns:** Random string.
* **Error states:** None.

### `HexToRGB(hex)`
* **Description:** Converts a hex color code to RGB values (0-255 range).
* **Parameters:**
  - `hex` -- hex color string (with or without `#` prefix)
* **Returns:** `r, g, b` -- RGB values (0-255).
* **Error states:** None.

### `RGBToPercentColor(r, g, b)`
* **Description:** Converts RGB values (0-255) to normalized color (0.0-1.0 range).
* **Parameters:**
  - `r` -- red value (0-255)
  - `g` -- green value (0-255)
  - `b` -- blue value (0-255)
* **Returns:** `r, g, b` -- normalized color values (0.0-1.0).
* **Error states:** None.

### `HexToPercentColor(hex)`
* **Description:** Converts a hex color code directly to normalized color (0.0-1.0 range).
* **Parameters:**
  - `hex` -- hex color string
* **Returns:** `r, g, b` -- normalized color values (0.0-1.0).
* **Error states:** None.

### `CalcDiminishingReturns(current, basedelta)`
* **Description:** Calculates a charge value with diminishing returns based on current value.
* **Parameters:**
  - `current` -- current charge value
  - `basedelta` -- base delta to apply
* **Returns:** New charge value after applying diminishing returns.
* **Error states:** None.

### `Dist2dSq(p1, p2)`
* **Description:** Calculates squared 2D distance between two points (x, y coordinates only).
* **Parameters:**
  - `p1` -- first point (table with x, y)
  - `p2` -- second point (table with x, y)
* **Returns:** Squared distance.
* **Error states:** None.

### `DistPointToSegmentXYSq(p, v1, v2)`
* **Description:** Calculates squared distance from a point to a line segment in 2D.
* **Parameters:**
  - `p` -- point to measure from (table with x, y)
  - `v1` -- segment start (table with x, y)
  - `v2` -- segment end (table with x, y)
* **Returns:** Squared distance to closest point on segment.
* **Error states:** None.

### `orderedPairs(t)`
* **Description:** Returns an iterator that traverses a table in alphabetical key order using string comparison for sorting.
* **Parameters:**
  - `t` -- table to iterate
* **Returns:** Iterator function, table, and initial state.
* **Error states:** None.

### `sorted_pairs(t, fn)`
* **Description:** Returns an iterator that traverses a table with keys sorted by a custom function.
* **Parameters:**
  - `t` -- table to iterate
  - `fn` -- custom sort function (default sorts numbers numerically, others as strings)
* **Returns:** Iterator function and state table.
* **Error states:** None.

### `GetTickForTime(target_time)`
* **Description:** Converts a time value to a tick count.
* **Parameters:**
  - `target_time` -- time in seconds
* **Returns:** Tick count (integer).
* **Error states:** None.

### `GetTimeForTick(target_tick)`
* **Description:** Converts a tick count to time in seconds.
* **Parameters:**
  - `target_tick` -- tick count
* **Returns:** Time in seconds.
* **Error states:** None.

### `GetTaskRemaining(task)`
* **Description:** Gets the remaining time for a scheduler task. Only works for tasks created from scheduler (not staticScheduler).
* **Parameters:**
  - `task` -- scheduler task
* **Returns:** Remaining time in seconds, or `-1` if task is nil, has no next time, or has already passed.
* **Error states:** None.

### `GetTaskTime(task)`
* **Description:** Gets the next scheduled time for a task.
* **Parameters:**
  - `task` -- scheduler task
* **Returns:** Next time in seconds, or `-1` if task is nil or has no next time.
* **Error states:** None.

### `shuffleArray(array)`
* **Description:** Shuffles an array in-place using Fisher-Yates algorithm.
* **Parameters:**
  - `array` -- array to shuffle
* **Returns:** The same array (modified in-place).
* **Error states:** None.

### `shuffledKeys(dict)`
* **Description:** Returns a shuffled array of keys from a table.
* **Parameters:**
  - `dict` -- table to get keys from
* **Returns:** Shuffled array of keys.
* **Error states:** None.

### `sortedKeys(dict)`
* **Description:** Returns a sorted array of keys from a table.
* **Parameters:**
  - `dict` -- table to get keys from
* **Returns:** Sorted array of keys.
* **Error states:** None.

### `TrackedAssert(tracking_data, function_ptr, function_data)`
* **Description:** Wraps a function call with tracked assertion that includes tracking data in error messages.
* **Parameters:**
  - `tracking_data` -- string to include in assertion message
  - `function_ptr` -- function to call
  - `function_data` -- data to pass to function
* **Returns:** Function return value.
* **Error states:** Asserts if the wrapped function calls `_G['tracked_assert'](false, reason)`.

### `deepcopy(object)`
* **Description:** Creates a deep copy of a table including all nested tables and preserving metatables.
* **Parameters:**
  - `object` -- table to copy
* **Returns:** Deep copy of the table.
* **Error states:** None.

### `deepcopynometa(object)`
* **Description:** Creates a deep copy of a table without copying metatables. Tables with metatables are converted to strings.
* **Parameters:**
  - `object` -- table to copy
* **Returns:** Deep copy without metatables.
* **Error states:** None.

### `shallowcopy(orig, dest)`
* **Description:** Creates a shallow copy of a table (copies references to nested tables, not the tables themselves).
* **Parameters:**
  - `orig` -- table to copy
  - `dest` -- optional destination table (creates new if nil)
* **Returns:** Copied table.
* **Error states:** None.

### `cleartable(object)`
* **Description:** Removes all key-value pairs from a table by setting each key to `nil`.
* **Parameters:**
  - `object` -- table to clear
* **Returns:** None.
* **Error states:** None.

### `IsTableEmpty(t)`
* **Description:** Checks if a table has no key-value pairs using `next()`.
* **Parameters:**
  - `t` -- table to check
* **Returns:** `true` if empty, `false` otherwise.
* **Error states:** None.

### `fastdump(value)`
* **Description:** Serializes a table to a Lua code string that can be loaded to recreate the table. Handles nested tables.
* **Parameters:**
  - `value` -- table to serialize
* **Returns:** Lua code string.
* **Error states:** Asserts if trying to serialize invalid data types (non-number/string/boolean/table keys).

### `circular_index_number(count, index)`
* **Description:** Calculates a circular index for a 1-based array. Converts any index to valid range `[1, count]`.
* **Parameters:**
  - `count` -- total number of elements
  - `index` -- desired index (can be outside valid range)
* **Returns:** Valid circular index in range `[1, count]`.
* **Error states:** None.

### `circular_index(t, index)`
* **Description:** Accesses a table element using circular indexing.
* **Parameters:**
  - `t` -- array table
  - `index` -- desired index (can be outside valid range)
* **Returns:** Table element at circular index.
* **Error states:** None.

### `RunInEnvironment(fn, fnenv)`
* **Description:** Runs a function in a custom environment using `setfenv`. Catches errors with traceback.
* **Parameters:**
  - `fn` -- function to run
  - `fnenv` -- environment table
* **Returns:** `success, result` from `xpcall`.
* **Error states:** None (errors caught by xpcall).

### `RunInEnvironmentSafe(fn, fnenv)`
* **Description:** Runs a function in a custom environment with safer error handling that prints to log.
* **Parameters:**
  - `fn` -- function to run
  - `fnenv` -- environment table
* **Returns:** `success, result` from `xpcall`.
* **Error states:** None.

### `RunInSandbox(untrusted_code)`
* **Description:** Runs untrusted Lua code in a restricted environment. Prohibits binary bytecode.
* **Parameters:**
  - `untrusted_code` -- Lua code string to execute
* **Returns:** `success, result` from `RunInEnvironment`.
* **Error states:** Returns `nil, "binary bytecode prohibited"` if code starts with byte 27.

### `RunInSandboxSafe(untrusted_code, error_handler)`
* **Description:** Runs untrusted Lua code in an empty environment. Does not assert by default.
* **Parameters:**
  - `untrusted_code` -- Lua code string to execute
  - `error_handler` -- optional custom error handler function
* **Returns:** `success, result` from `xpcall`.
* **Error states:** Returns `nil, "binary bytecode prohibited"` if code starts with byte 27.

### `RunInSandboxSafeCatchInfiniteLoops(untrusted_code, error_handler, maxops)`
* **Description:** Runs untrusted Lua code with infinite loop detection using debug hooks.
* **Parameters:**
  - `untrusted_code` -- Lua code string to execute
  - `error_handler` -- optional custom error handler function
  - `maxops` -- maximum operations before triggering infinite loop error (default `20000`)
* **Returns:** `success, result` from coroutine resume.
* **Error states:** Errors on infinite loop detection (exceeds maxops). Returns nil, "binary bytecode prohibited" if code starts with byte 27.

### `FunctionOrValue(func_or_val, ...)`
* **Description:** Calls a function or returns a value directly. Useful for configuration that can be either static or dynamic.
* **Parameters:**
  - `func_or_val` -- function or value
  - `...` -- arguments to pass if function
* **Returns:** Function return value or the value itself.
* **Error states:** None.

### `PrintTable(tab)`
* **Description:** Recursively formats a table into a readable string representation. Nested tables are indented for clarity.
* **Parameters:**
  - `tab` -- table to format
* **Returns:** Formatted string representation of the table.
* **Error states:** None.

### `ApplyLocalWordFilter(text, text_filter_context, net_id)`
* **Description:** Applies profanity filter to text if enabled. Skips filtering for game context strings.
* **Parameters:**
  - `text` -- text to filter
  - `text_filter_context` -- context enum for filtering
  - `net_id` -- network ID for filtering
* **Returns:** Filtered text, or original text if filtering is disabled.
* **Error states:** None.

### `rawstring(t)`
* **Description:** Returns the raw string representation of a table, bypassing any `__tostring` metamethod.
* **Parameters:**
  - `t` -- value to convert to string
* **Returns:** Raw string representation.
* **Error states:** None.

### `generic_error(err)`
* **Description:** Formats an error with stack trace for logging.
* **Parameters:**
  - `err` -- error value
* **Returns:** Formatted error string with stack trace.
* **Error states:** None.

### `ControllerReticle_Blink_GetPosition_Oneshot(pos, rotation, rmin, rmax, riter, validwalkablefn)`
* **Description:** Attempts to find a valid walkable position in a single radial sweep. Modifies the pos vector if successful.
* **Parameters:**
  - `pos` -- starting position (Vector3, modified in-place)
  - `rotation` -- rotation in degrees
  - `rmin` -- minimum radius
  - `rmax` -- maximum radius
  - `riter` -- radius iteration step
  - `validwalkablefn` -- optional validation function
* **Returns:** `true` if valid position found, `false` otherwise.
* **Error states:** None.

### `ControllerReticle_Blink_GetPosition_Direction(pos, rotation, maxrange, validwalkablefn)`
* **Description:** Finds a valid position in a specific direction using two-range sweep.
* **Parameters:**
  - `pos` -- starting position (Vector3, modified in-place)
  - `rotation` -- rotation in degrees
  - `maxrange` -- maximum range (default `12` for first sweep, `20` for second)
  - `validwalkablefn` -- optional validation function
* **Returns:** `true` if valid position found, `false` otherwise.
* **Error states:** None.

### `ControllerReticle_Blink_GetPosition(player, validwalkablefn)`
* **Description:** Finds the best position for controller blink reticle by checking blinkfocus entities first, then sweeping in a conical pattern forward.
* **Parameters:**
  - `player` -- player entity
  - `validwalkablefn` -- optional validation function
* **Returns:** Best position Vector3 for reticle.
* **Error states:** None.

### `ControllerPlacer_Boat_SpotFinder_Internal(placer, player, ox, oy, oz)`
* **Description:** Internal function for finding valid boat placement spots for controllers. Uses conical sweep around player position.
* **Parameters:**
  - `placer` -- placer component instance
  - `player` -- player entity
  - `ox, oy, oz` -- original placement coordinates
* **Returns:** None (modifies placer position in-place).
* **Error states:** None.

### `ControllerPlacer_Boat_SpotFinder(inst, boat_radius)`
* **Description:** Sets up boat spot finder for a placer component. Configures minimum boat radius and override function.
* **Parameters:**
  - `inst` -- entity with placer component
  - `boat_radius` -- boat radius for minimum range calculation
* **Returns:** None.
* **Error states:** None.

### `RingBuffer(maxlen)`
* **Description:** Constructor for RingBuffer class. Creates a circular buffer with specified maximum length.
* **Parameters:**
  - `maxlen` -- maximum buffer length (default `10` if invalid)
* **Returns:** New RingBuffer instance.
* **Error states:** None.

### `RingBuffer:Clear()`
* **Description:** Clears all entries from the buffer.
* **Parameters:** None
* **Returns:** None.
* **Error states:** None.

### `RingBuffer:Add(entry)`
* **Description:** Adds an element to the circular buffer. Overwrites oldest entry if buffer is full.
* **Parameters:**
  - `entry` -- element to add
* **Returns:** None.
* **Error states:** None.

### `RingBuffer:Get(index)`
* **Description:** Gets an element from the buffer by index (1-based from start of valid entries).
* **Parameters:**
  - `index` -- 1-based index
* **Returns:** Element at index, or `nil` if index is out of range.
* **Error states:** None.

### `RingBuffer:GetBuffer()`
* **Description:** Returns all entries as a new array table by calling self:Get(i) for each index.
* **Parameters:** None
* **Returns:** Array of all buffer entries.
* **Error states:** None.

### `RingBuffer:Resize(newsize)`
* **Description:** Resizes the buffer to a new maximum length. Preserves existing entries.
* **Parameters:**
  - `newsize` -- new maximum length (minimum `1`)
* **Returns:** None.
* **Error states:** None.

### `DynamicPosition(pt, walkable_platform)`
* **Description:** Constructor for DynamicPosition class. Creates a position that tracks a moving walkable platform.
* **Parameters:**
  - `pt` -- world space position (Vector3)
  - `walkable_platform` -- optional platform entity (auto-detected if nil)
* **Returns:** New DynamicPosition instance.
* **Error states:** None.

### `DynamicPosition:GetPosition()`
* **Description:** Gets the current world space position. Returns nil if tracked platform no longer exists.
* **Parameters:** None
* **Returns:** World position Vector3, or `nil` if platform is invalid.
* **Error states:** None.

### `DynamicPosition:__eq(rhs)`
* **Description:** Equality comparison metamethod. Compares platform and local position.
* **Parameters:**
  - `rhs` -- other DynamicPosition instance
* **Returns:** `true` if equal, `false` otherwise.
* **Error states:** None.

### `DynamicPosition:__tostring()`
* **Description:** String representation metamethod.
* **Parameters:** None
* **Returns:** Formatted position string or `"nil"`.
* **Error states:** None.

### `LinkedList()`
* **Description:** Constructor for LinkedList class. Creates an empty singly linked list.
* **Parameters:** None
* **Returns:** New LinkedList instance.
* **Error states:** None.

### `LinkedList:Append(v)`
* **Description:** Appends a value to the end of the list.
* **Parameters:**
  - `v` -- value to append
* **Returns:** The appended value.
* **Error states:** None.

### `LinkedList:Remove(v)`
* **Description:** Removes the first occurrence of a value from the list.
* **Parameters:**
  - `v` -- value to remove
* **Returns:** `true` if removed, `false` if not found.
* **Error states:** None.

### `LinkedList:Head()`
* **Description:** Gets the first element's data.
* **Parameters:** None
* **Returns:** First element's data, or `nil` if list is empty.
* **Error states:** None.

### `LinkedList:Tail()`
* **Description:** Gets the last element's data.
* **Parameters:** None
* **Returns:** Last element's data, or `nil` if list is empty.
* **Error states:** None.

### `LinkedList:Clear()`
* **Description:** Removes all elements from the list.
* **Parameters:** None
* **Returns:** None.
* **Error states:** None.

### `LinkedList:Count()`
* **Description:** Counts the number of elements in the list.
* **Parameters:** None
* **Returns:** Element count.
* **Error states:** None.

### `LinkedList:Iterator()`
* **Description:** Returns an iterator object for traversing the list.
* **Parameters:** None
* **Returns:** Iterator table with `Current()`, `Next()`, and `RemoveCurrent()` methods.
* **Error states:** None.

### `PRNG_Uniform(seed)`
* **Description:** Constructor for PRNG_Uniform class. Initializes the pseudo-random number generator with a seed.
* **Parameters:**
  - `seed` -- initial seed value (default `0`)
* **Returns:** New PRNG_Uniform instance.
* **Error states:** None.

### `PRNG_Uniform:SetSeed(seed)`
* **Description:** Sets a new seed for the generator.
* **Parameters:**
  - `seed` -- new seed value
* **Returns:** None.
* **Error states:** None.

### `PRNG_Uniform:Rand(optmin, optmax)`
* **Description:** Generates a random number. If min/max provided, returns integer in range; otherwise returns float in `[0, 1)`.
* **Parameters:**
  - `optmin` -- optional minimum value (if provided, triggers integer mode)
  - `optmax` -- optional maximum value
* **Returns:** Random float `[0, 1)` or random integer in range.
* **Error states:** None.

### `PRNG_Uniform:RandInt(min, max)`
* **Description:** Generates a random integer in the specified range.
* **Parameters:**
  - `min` -- minimum value (default `1` if max only provided)
  - `max` -- maximum value
* **Returns:** Random integer in `[min, max]`.
* **Error states:** None.

### `ipairs_reverse(t)`
* **Description:** Returns an iterator that traverses an array table in reverse order.
* **Parameters:**
  - `t` -- array table to iterate
* **Returns:** Iterator function, table, and initial index.
* **Error states:** None.

### `metanext(t, k, ...)`
* **Description:** Calls the `__next` metamethod if present, otherwise falls back to standard `next`.
* **Parameters:**
  - `t` -- table
  - `k` -- current key
  - `...` -- additional arguments
* **Returns:** Next key-value pair.
* **Error states:** None.

### `metapairs(t, ...)`
* **Description:** Calls the `__pairs` metamethod if present, otherwise falls back to standard `pairs`.
* **Parameters:**
  - `t` -- table
  - `...` -- additional arguments
* **Returns:** Iterator, table, and initial state.
* **Error states:** None.

### `metaipairs(t, ...)`
* **Description:** Calls the `__ipairs` metamethod if present, otherwise falls back to standard `ipairs`.
* **Parameters:**
  - `t` -- table
  - `...` -- additional arguments
* **Returns:** Iterator, table, and initial index.
* **Error states:** None.

### `metarawset(t, k, v)`
* **Description:** Sets a value in a table's metatable raw storage, bypassing metamethods.
* **Parameters:**
  - `t` -- table with metatable
  - `k` -- key
  - `v` -- value
* **Returns:** None.
* **Error states:** Errors if table has no metatable with `._` field.

### `metarawget(t, k)`
* **Description:** Gets a value from a table's metatable raw storage.
* **Parameters:**
  - `t` -- table with metatable
  - `k` -- key
* **Returns:** Value from metatable, or `nil`.
* **Error states:** Errors if table has no metatable.

### `ZipAndEncodeString(data)`
* **Description:** Zips and encodes a string for save data using TheSim.
* **Parameters:**
  - `data` -- string data to encode
* **Returns:** Encoded string.
* **Error states:** None.

### `ZipAndEncodeSaveData(data)`
* **Description:** Zips and encodes table data for save data, wrapping in a table with `str` field.
* **Parameters:**
  - `data` -- table data to encode
* **Returns:** `{ str = encoded_string }`.
* **Error states:** None.

### `DecodeAndUnzipString(str)`
* **Description:** Decodes and unzips a string from save data with infinite loop protection.
* **Parameters:**
  - `str` -- encoded string
* **Returns:** Decoded data, or empty table on failure.
* **Error states:** None (returns empty table on decode failure).

### `DecodeAndUnzipSaveData(data)`
* **Description:** Decodes and unzips save data from the `{ str = ... }` format.
* **Parameters:**
  - `data` -- save data table with `str` field
* **Returns:** Decoded data, or empty table on failure.
* **Error states:** None.

## Events & listeners
None.