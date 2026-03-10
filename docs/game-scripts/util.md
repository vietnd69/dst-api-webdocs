---
id: util
title: Util
description: Central utility library providing table/string/math helpers, debugging tools, memory management, path resolution, PRNG, teleportation validation, and ECS extension functions for DST modding.
tags: [utility, math, debug, memory, pathing]
sidebar_position: 10

last_updated: 2026-03-10
build_version: 714014
change_status: stable
category_type: root
source_hash: 088212c7
system_scope: entity
---

# Util

> Based on game build **714014** | Last updated: 2026-03-10

## Overview
The `util.lua` module serves as a foundational utility library in Don't Starve Together’s codebase, offering comprehensive helper functions across multiple domains: string and table manipulation, random number generation, spatial and geometric computations, memory profiling and tracking, path resolution, debug aids (e.g., spawning, table dumping), and teleportation/linking permission checks. It is not an ECS component but a top-level module imported by many scripts, prefabs, and systems to support consistent, reusable logic and reduce duplication.

## Usage example
```lua
local util = require("util")

-- Generate a reproducible random value
local rng = util.PRNG_Uniform(12345)
local rand_int = rng:RandInt(1, 10)
local rand_float = rng:Rand()

-- Get closest enemy to player
local closest = util.GetClosest(player, enemies)

-- Deep-merge two configuration tables
local merged_config = util.MergeMapsDeep(base_config, mod_config)

-- Safely run untrusted code with timeout protection
local ok, result = util.RunInSandboxSafeCatchInfiniteLoops("return 1+2")
```

## Dependencies & tags
**Components used:**
- `components.boatringdata` (used in `SnapToBoatEdge`)
- `components.placer` (used in `ControllerPlacer_Boat_SpotFinder` to override `controllergroundoverridefn`)
- `TheSim` (path resolution, memory stats, word filtering, save data encoding/decoding, teleport validation)
- `TheInput` (`DebugSpawn`, controller reticle logic)
- `TheWorld.Map` (`DynamicPosition`, teleport/linking validation via `IsWagPunkArenaBarrierUp`, `IsPointInAnyVault`, etc.)
- `Prefabs` and `PREFABS` (`DebugSpawn`, `SpawnAt`)
- Standard libraries: `table`, `string`, `math`, `debug`, `coroutine`, `bit`, `utf8`
- External helpers: `DataDumper`, `ZipAndEncodeSaveData`, `DecodeAndUnzipSaveData`, `Profile`, `TEXT_FILTER_CTX_GAME`
- `distSq`, `ToVector3`, `TUNING.CONTROLLER_BLINKFOCUS_*`, `DEGREES`, `RADIANS`, `Utf8`

**Tags:**
- `"blinkfocus"` (used for reticle blink target filtering)

## Properties
| Property | Type | Default Value | Description |
|----------|------|---------------|-------------|
| `memoizedFilePaths` | string (encoded) | `""` | Internal cache for resolved file paths (set via `SetMemoizedFilePaths`, retrieved via `GetMemoizedFilePaths`) |

## Main functions
### `PRNG_Uniform(seed)`
* **Description:** Initializes a reproducible multiplicative linear congruential generator (PRIGARIN’s algorithm with modulus 2⁴⁰−5¹⁷). Sets internal constants and seed state.
* **Parameters:**
  - `seed` (optional integer): Seed value; defaults to `0`.
* **Returns:** None (instance constructor; sets `self.A1`, `self.A2`, `self.D20`, `self.D40`, and `self.X1`, `self.X2` via `SetSeed`).

### `PRNG_Uniform:SetSeed(seed)`
* **Description:** Sets the internal seed (`X1`) and forces `X2 = 1` (required odd value).
* **Parameters:**
  - `seed` (integer): Seed for `X1`.
* **Returns:** None.

### `PRNG_Uniform:Rand(optmin, optmax)`
* **Description:** Generates a uniform random float in `[0, 1)` if called with no arguments; otherwise generates a random integer via `RandInt`. Computes a 40-bit value and normalizes it.
* **Parameters:**
  - `optmin` (optional integer): Lower bound for integer generation (or triggers integer mode).
  - `optmax` (optional integer): Upper bound for integer generation.
* **Returns:** Float in `[0, 1)` when no args; integer in `[min, max]` (inclusive) when `optmin` is provided.

### `PRNG_Uniform:RandInt(min, max)`
* **Description:** Returns a random integer in the inclusive range `[min, max]`. Adjusts arguments if only one is provided (`max = min`, `min = 1`).
* **Parameters:**
  - `min` (integer): Lower bound; defaults to `1` if `max` is `nil`.
  - `max` (integer): Upper bound; defaults to `min` if `nil`.
* **Returns:** Integer in `[min, max]`.

### `DumpTableXML(t, name)`
* **Description:** Recursively serializes a table into an XML string.
* **Parameters:**
  - `t` (table): Table to serialize.
  - `name` (string, optional): Root element name; defaults to `""`.
* **Returns:** XML string representation.

### `DebugSpawn(prefab)`
* **Description:** Spawns a prefab at the console world position (using `ConsoleWorldPosition()`), useful for debugging.
* **Parameters:**
  - `prefab` (string or entity): Prefab name or prefab instance.
* **Returns:** Spawned instance (`inst`) on success, `nil` otherwise (e.g., invalid prefab, transform failure, missing `TheSim`/`TheInput`).

### `GetClosest(target, entities)`
* **Description:** Finds the entity in `entities` closest to `target` using squared distance.
* **Parameters:**
  - `target` (entity): Must have `:GetPosition()`.
  - `entities` (array-like table): Entities with `:GetPosition()`.
* **Returns:** Closest entity or `nil` (if `entities` empty or `target` lacks `GetPosition`).

### `SpawnAt(prefab, loc, scale, offset)`
* **Description:** Spawns a prefab at a specific location with optional scale/offset.
* **Parameters:**
  - `prefab` (string or entity): Prefab name or instance.
  - `loc` (Vector3, entity with `:GetPosition()`, or `nil`): Target location (uses `ConsoleWorldPosition` if `nil`).
  - `scale` (number, Vector3, or table, optional): Scale to apply.
  - `offset` (Vector3, optional): Additional offset (defaults to `(0,0,0)`).
* **Returns:** Spawned instance or `nil` (if `loc`/`prefab` invalid).

### `string:split(sep)`
* **Description:** Splits the string by separator into an array.
* **Parameters:**
  - `sep` (string, optional): Separator; defaults to `":"`.
* **Returns:** Array of substrings.

### `string.findall(s, pattern, init, plain)`
* **Description:** Finds all non-overlapping matches of `pattern` in `s`.
* **Parameters:**
  - `s` (string): String to search.
  - `pattern` (string): Lua pattern.
  - `init` (integer, optional): Start index; defaults to `1`.
  - `plain` (boolean, optional): Disable pattern matching (literal search).
* **Returns:** Array of `{first, last}` index pairs; `{}` if none.

### `string.rfind(s, pattern, init, plain)`
* **Description:** Finds the last match of `pattern` in `s`.
* **Parameters:** Same as `string.findall`.
* **Returns:** `first, last` indices or `nil`.

### `string.rfind_plain(s, query, init)`
* **Description:** Finds last *literal* (plain-text) match of `query`.
* **Parameters:**
  - `s`, `query`, `init`: As above.
* **Returns:** `first, last` indices or `nil`.

### `table.contains(table, element)`
* **Description:** Checks if `element` exists in `table` by value equality.
* **Parameters:**
  - `table`, `element`.
* **Returns:** `true` if found, `false` (including if `table` is `nil`).

### `table.containskey(table, key)`
* **Description:** Checks if `key` exists in `table` as a key.
* **Parameters:** Same as above.
* **Returns:** `true`/`false`.

### `table.getkeys(t)`
* **Description:** Returns an array of all keys in `t`.
* **Parameters:** `t`.
* **Returns:** Array of keys (unordered).

### `table.reverse(tab)`
* **Description:** Returns a new reversed copy of an indexed table.
* **Parameters:** `tab` (indexed table).
* **Returns:** New array.

### `table.reverse_inplace(t)`
* **Description:** Reverses an indexed table in-place.
* **Parameters:** `t` (indexed table).
* **Returns:** `t` (modified).

### `table.invert(t)`
* **Description:** Swaps keys and values into a new table.
* **Parameters:** `t`.
* **Returns:** New table (non-unique values cause collisions).

### `table.removearrayvalue(t, lookup_value)`
* **Description:** Removes first occurrence of `lookup_value` from an indexed table.
* **Parameters:** Same as above.
* **Returns:** Removed value or `nil`.

### `table.removetablevalue(t, lookup_value)`
* **Description:** Removes *all* key-value pairs where value equals `lookup_value`.
* **Parameters:** Same as above.
* **Returns:** First removed value or `nil`.

### `table.reverselookup(t, lookup_value)`
* **Description:** Returns the first key whose value equals `lookup_value`.
* **Parameters:** Same as above.
* **Returns:** Key or `nil`.

### `ipairs_reverse(t)`
* **Description:** Iterator for indexed tables in reverse order.
* **Parameters:** `t`.
* **Returns:** Iterator function, table, start index.

### `GetFlattenedSparse(tab)`
* **Description:** Converts a sparse indexed table into a dense sorted array.
* **Parameters:** `tab`.
* **Returns:** Dense array sorted by numeric key.

### `RemoveByValue(t, value)`
* **Description:** Removes *all* instances of `value` from an indexed table in-place.
* **Parameters:** Same as above.
* **Returns:** None (modifies `t`).

### `GetTableSize(table)`
* **Description:** Counts key-value pairs in a table (like `#t` for maps).
* **Parameters:** `table`.
* **Returns:** Integer count (`0` if `nil`).

### `GetRandomItem(choices)`
* **Description:** Selects a uniformly random item from `choices` (array or map).
* **Parameters:** `choices`.
* **Returns:** Item value; `nil` if empty (`assert` fails).

### `GetRandomItemWithIndex(choices)`
* **Description:** Same as `GetRandomItem`, but returns `(key, value)`.
* **Parameters:** `choices`.
* **Returns:** `key, value`; asserts on empty.

### `PickSome(num, choices)`
* **Description:** Randomly picks `num` *unique* items from `choices` (array-style).
* **Parameters:**
  - `num` (integer).
  - `choices` (array-like).
* **Returns:** New array of `num` items (fewer if `num > #choices`).

### `PickSomeWithDups(num, choices)`
* **Description:** Same as `PickSome`, but allows duplicates.
* **Parameters:** Same as above.
* **Returns:** Array of `num` items (may contain duplicates).

### `ConcatArrays(ret, ...)`
* **Description:** Appends arrays to `ret` (modifies `ret`).
* **Parameters:**
  - `ret` (modified array).
  - `...` (array-style tables).
* **Returns:** `ret`.

### `JoinArrays(...)`
* **Description:** Same as `ConcatArrays`, but returns a new array.
* **Parameters:** Same as above.
* **Returns:** New array.

### `ExceptionArrays(tSource, tException)`
* **Description:** Returns elements in `tSource` not in `tException`.
* **Parameters:** Same as above.
* **Returns:** New array.

### `ArrayUnion(...)`
* **Description:** Merges arrays, deduplicating by value (order preserved).
* **Parameters:** Array-style tables.
* **Returns:** New array.

### `ArrayIntersection(...)`
* **Description:** Returns values present in *all* provided arrays.
* **Parameters:** Same as above.
* **Returns:** New array.

### `StringContainsAnyInArray(input, array)`
* **Description:** Checks if `input` contains any substring from `array`.
* **Parameters:**
  - `input` (string).
  - `array` (array of substrings).
* **Returns:** Boolean.

### `MergeMaps(...)`
* **Description:** Merges maps, overwriting with later values.
* **Parameters:** Maps.
* **Returns:** New merged map.

### `MergeMapsAdditively(...)`
* **Description:** Merges maps by summing numeric values.
* **Parameters:** Same as above.
* **Returns:** New map.

### `MergeMapsDeep(...)`
* **Description:** Recursively merges maps (type consistency enforced).
* **Parameters:** Same as above.
* **Returns:** Deeply merged map (`assert` on type mismatch).

### `MergeKeyValueList(...)`
* **Description:** Merges lists of `{"key", "value"}` pairs (later values win).
* **Parameters:** Lists of 2-element arrays.
* **Returns:** New list.

### `SubtractMapKeys(base, subtract)`
* **Description:** Subtracts `subtract` map from `base` recursively.
* **Parameters:** Same as above.
* **Returns:** New map.

### `ExtendedArray(orig, addition, mult)`
* **Description:** Appends `addition` to `orig`, `mult` times.
* **Parameters:**
  - `orig`, `addition` (array-like).
  - `mult` (integer, default `1`).
* **Returns:** New extended array.

### `FlattenTree(tree, unique)`
* **Description:** Recursively flattens nested tables into a leaf-value array.
* **Parameters:**
  - `tree` (nested table).
  - `unique` (boolean: deduplicate leaf values).
* **Returns:** Array of leaf values.

### `GetRandomKey(choices)`
* **Description:** Returns a random key from `choices`.
* **Parameters:** `choices`.
* **Returns:** Random key (`assert` on empty).

### `GetRandomWithVariance(baseval, randomval)`
* **Description:** Returns `baseval ± randomval`.
* **Parameters:**
  - `baseval`, `randomval`.
* **Returns:** `baseval + uniform(-randomval, +randomval)`.

### `GetRandomMinMax(min, max)`
* **Description:** Returns uniform random float in `[min, max)`.
* **Parameters:** Same as above.
* **Returns:** Float.

### `distsq(v1, v2, v3, v4)`
* **Description:** Squared Euclidean distance between two points (2D or 3D).
* **Parameters:**
  - `v1`, `v2`: First point (Vector3 or `{x,y,z}` or numbers for 2D).
  - `v3`, `v4`: Optional second point as numbers.
* **Returns:** Squared distance.

### `GetMemoizedFilePaths()`, `SetMemoizedFilePaths(encoded)`
* **Description:** Getter/setter for internal path cache (encoded via `ZipAndEncodeSaveData`).
* **Parameters:**
  - `SetMemoizedFilePaths`: `encoded` (string).
* **Returns:** Encoded string.

### `resolvefilepath(...)`, `resolvefilepath_soft(...)`, `softresolvefilepath(...)`, `resolvefilepath_internal(...)`, `softresolvefilepath_internal(...)`
* **Description:** Resolves relative file paths to absolute (PC vs console, search paths, caching).
* **Parameters:**
  - `filepath` (string).
  - `force_path_search`, `search_first_path` (optional flags).
* **Returns:** Absolute path or `nil` (soft variants).

### `mem_report()`
* **Description:** Prints memory usage report (types and counts) to console.
* **Parameters:** None.
* **Returns:** None.

### `weighted_random_choice(choices)`
* **Description:** Picks a choice weighted by its value.
* **Parameters:** `choices` (table of `{choice → weight}`).
* **Returns:** Weighted random choice.

### `weighted_random_choices(choices, num_choices)`
* **Description:** Same as `weighted_random_choice`, but picks `num_choices` items (with replacement).
* **Parameters:** Same as above, plus `num_choices`.
* **Returns:** Array of choices.

### `PrintTable(tab)`
* **Description:** Returns pretty-printed string of a table.
* **Parameters:** `tab`.
* **Returns:** String (indented).

### `RunInEnvironment(fn, fnenv)`, `RunInEnvironmentSafe(fn, fnenv)`
* **Description:** Runs `fn` under custom environment `fnenv` (Lua 5.1-style).
* **Parameters:** Same as above.
* **Returns:** `xpcall` result (`true/false, ...`).

### `RunInSandbox(untrusted_code)`, `RunInSandboxSafe(untrusted_code, error_handler)`, `RunInSandboxSafeCatchInfiniteLoops(untrusted_code, error_handler, timeout, ...)
* **Description:** Executes untrusted code under restricted environment.
* **Parameters:** Same as above.
* **Returns:** `success, result` (or `nil, error`).
* **Notes:**
  - `RunInSandboxSafeCatchInfiniteLoops` uses `debug.sethook` to detect infinite loops and blocks bytecode.

### `GetTickForTime(target_time)`, `GetTimeForTick(target_tick)`
* **Description:** Converts between time (seconds) and ticks.
* **Parameters:** Same as above.
* **Returns:** Integer tick or float seconds.

### `GetTaskRemaining(task)`, `GetTaskTime(task)`
* **Description:** Utilities for scheduler tasks.
* **Parameters:** `task` (expects `:NextTime()`).
* **Returns:** `GetTaskRemaining`: time left (seconds) or `-1`; `GetTaskTime`: next execution time (seconds) or `-1`.

### `shuffleArray(array)`, `shuffledKeys(dict)`, `sortedKeys(dict)`
* **Description:**
  - `shuffleArray`: Fisher-Yates shuffle (in-place).
  - `shuffledKeys`: Shuffled keys list.
  - `sortedKeys`: Alphabetically sorted keys list.
* **Parameters:** Same as above.
* **Returns:** `shuffleArray`: modified `array`; others: new arrays.

### `TrackedAssert(tracking_data, function_ptr, function_data)`
* **Description:** Replaces `assert` during `function_ptr` with a tracking-aware version.
* **Parameters:**
  - `tracking_data` (string).
  - `function_ptr`, `function_data`.
* **Returns:** Result of `function_ptr`.

### `deepcopy(object)`, `deepcopynometa(object)`
* **Description:** Deep copies a table (with/without metatables).
* **Parameters:** `object`.
* **Returns:** Deep copy.

### `shallowcopy(orig, dest)`, `cleartable(object)`
* **Description:**
  - `shallowcopy`: Top-level copy (to `dest` if provided).
  - `cleartable`: Empties `object` in-place.
* **Parameters:** Same as above.
* **Returns:** `shallowcopy`: copy or `orig`.

### `IsTableEmpty(t)`
* **Description:** Checks if table is empty.
* **Parameters:** `t`.
* **Returns:** `true` if `next(t) == nil`.

### `fastdump(value)`
* **Description:** Serializes table to Lua code string for saving.
* **Parameters:** `value`.
* **Returns:** Lua string.

### `circular_index_number(count, index)`, `circular_index(t, index)`
* **Description:** Handles 1-based circular indexing.
* **Parameters:** Same as above.
* **Returns:** Normalized index or `t[normalized_index]`.

### `RingBuffer(maxlen)`
* **Description:** Circular buffer implementation.
* **Constructor:** `RingBuffer(maxlen=10)`.
* **Methods:**
  - `:Clear()` — resets.
  - `:Add(entry)` — adds; overwrites if full.
  - `:Get(index)` — 1-based retrieval.
  - `:GetBuffer()` — array copy.
  - `:Resize(newsize)` — only growing supported.

### `DynamicPosition(pt, walkable_platform)`
* **Description:** Tracks position relative to a walkable platform.
* **Constructor:** `DynamicPosition(pt, walkable_platform)`.
* **Methods:**
  - `:__eq(rhs)` — platform + local coords.
  - `:__tostring()` — debug string.
  - `:GetPosition()` — world position (or `nil` if platform invalid).

### `LinkedList()`
* **Description:** Doubly linked list.
* **Constructor:** `LinkedList()`.
* **Methods:**
  - `:Append(v)`, `:Remove(v)`.
  - `:Head()`, `:Tail()`, `:Count()`, `:Clear()`.
  - `:Iterator()` — with `:Current()`, `:Next()`, `:RemoveCurrent()`.

### `table.count(t, value)`
* **Description:** Counts occurrences of `value` (default: all entries).
* **Parameters:** Same as above.
* **Returns:** Integer.

### `table.setfield(Table, Name, Value)`
* **Description:** Sets nested field via dot-string (e.g., `"A.B.C"`).
* **Parameters:** Same as above.
* **Returns:** None.

### `table.getfield(Table, Name)`
* **Description:** Gets nested field via dot-string.
* **Parameters:** Same as above.
* **Returns:** Value or `nil`.

### `table.typecheckedgetfield(Table, Type, ...)`
* **Description:** Gets nested field with optional type check.
* **Parameters:** Same as above.
* **Returns:** Value or `nil`.

### `table.findfield(Table, Name)`
* **Description:** Finds dot-path to first matching key.
* **Parameters:** Same as above.
* **Returns:** Dot-path or `nil`.

### `table.findpath(Table, Names, indx)`
* **Description:** Finds dot-path matching sequence of keys.
* **Parameters:** Same as above.
* **Returns:** Dot-path or `nil`.

### `table.keysareidentical(a, b)`
* **Description:** Checks if two tables have identical key sets.
* **Parameters:** Same as above.
* **Returns:** Boolean.

### `TrackMem()`, `DumpMem()`
* **Description:** Memory tracking utilities using `TheSim:DumpMemoryStats()` and `mem_report`.
* **Parameters:** None.
* **Returns:** None.

### `checkbit(x, b)`, `setbit(x, b)`, `clearbit(x, b)`
* **Description:** Bit manipulation helpers.
* **Parameters:** `x` (number), `b` (bit mask).
* **Returns:** Modified number.

### `IsWithinAngle(position, forward, width, testPos)`
* **Description:** Checks if `testPos` is within `width` radians of `forward` from `position`.
* **Parameters:** All `Vector3`.
* **Returns:** Boolean.

### `GetCircleEdgeSnapTransform(segments, radius, base_pt, pt, angle)`
* **Description:** Snaps `pt` to nearest edge segment of a circle.
* **Parameters:**
  - `segments` (integer).
  - `radius`, `base_pt`, `pt`, `angle` (start angle).
* **Returns:** `snap_point (Vector3), snap_angle (degrees)`.

### `SnapToBoatEdge(inst, boat, override_pt)`
* **Description:** Snaps `inst` to boat’s edge (if within radius).
* **Parameters:**
  - `inst`, `boat` (entity, requires `components.boatringdata`).
  - `override_pt` (optional Vector3).
* **Returns:** None (modifies transform).

### `GetAngleFromBoat(boat, x, z)`
* **Description:** Returns angle (radians) from boat to `(x, z)`.
* **Parameters:** Same as above.
* **Returns:** Angle or `nil`.

### `string.random(Length, CharSet)`
* **Description:** Generates random string from `CharSet`.
* **Parameters:**
  - `Length` (integer).
  - `CharSet` (string like `"a-z0-9"` or `"."`).
* **Returns:** Random string.

### `HexToRGB(hex)`, `RGBToPercentColor(r, g, b)`, `HexToPercentColor(hex)`
* **Description:** Color conversion utilities.
* **Parameters:**
  - `hex` (`"#RRGGBB"` or `"RRGGBB"`).
  - `r,g,b` (0–255).
* **Returns:**
  - `HexToRGB`: integers 0–255.
  - `RGBToPercentColor`: floats 0.0–1.0.

### `CalcDiminishingReturns(current, basedelta)`
* **Description:** Applies deterministic + random diminishing returns to `current`.
* **Parameters:** Same as above.
* **Returns:** New `current`.

### `Dist2dSq(p1, p2)`, `DistPointToSegmentXYSq(p, v1, v2)`
* **Description:** 2D distance functions.
* **Parameters:** All `{x,y}`.
* **Returns:** Squared distance.

### `orderedPairs(t)`
* **Description:** Iterates over `t` in sorted key order.
* **Parameters:** `t`.
* **Returns:** Iterator for `key, value`.

### `metanext`, `metapairs`, `metaipairs`, `metarawset`, `metarawget`
* **Description:** Metatable-aware table operations.
* **Parameters:** `t`, `k`, `v`, etc.
* **Returns:** Delegates to metatable fields (e.g., `__next`, `c[k]`).

### `ZipAndEncodeString(data)`, `ZipAndEncodeSaveData(data)`, `DecodeAndUnzipString(data)`, `DecodeAndUnzipSaveData(data)`
* **Description:** Save data encoding/decoding.
* **Parameters:** `data` (table or string).
* **Returns:** Encoded string or decoded table.

### `FunctionOrValue(func_or_val, ...)`
* **Description:** Calls `func_or_val` if function; otherwise returns it.
* **Parameters:** Same as above.
* **Returns:** Result or `func_or_val`.

### `ApplyLocalWordFilter(text, text_filter_context, net_id)`
* **Description:** Applies word filtering based on context/settings.
* **Parameters:** Same as above.
* **Returns:** Filtered `text`.

### `rawstring(t)`
* **Description:** Bypasses `__tostring` metamethod.
* **Parameters:** `t`.
* **Returns:** String (ignores `__tostring`).

### `sorted_pairs(t, fn)`
* **Description:** Iterates in sorted order (custom comparator `fn`).
* **Parameters:** Same as above.
* **Returns:** Iterator for `i, key, value`.

### `generic_error(err)`
* **Description:** Formats error with stack trace.
* **Parameters:** `err` (message).
* **Returns:** `"message\nstack_trace"`.

### `ControllerReticle_Blink_GetPosition_Oneshot(...)`, `ControllerReticle_Blink_GetPosition_Direction(...)`, `ControllerReticle_Blink_GetPosition(player, validwalkablefn)`
* **Description:** Controller reticle blink targeting.
* **Parameters:**
  - `pos`, `rotation`, `maxrange`, `validwalkablefn`.
  - `player`, `validwalkablefn`.
* **Returns:** Boolean (success) or snapped position.

### `ControllerPlacer_Boat_SpotFinder_Internal(...)`, `ControllerPlacer_Boat_SpotFinder(inst, boat_radius)`
* **Description:** Finds valid placement near boats for controllers.
* **Parameters:**
  - `placer`, `player`, `ox`, `oy`, `oz`, `boat_radius`.
* **Returns:** None (modifies transform).
* **Note:** Sets `placer.components.placer.controllergroundoverridefn`.

### `IsTeleportingPermittedFromPointToPoint(fx, fy, fz, tx, ty, tz)`
* **Description:** Determines if teleportation between two points is allowed.
* **Parameters:** World coordinates.
* **Returns:** `true`/`false` (blocks if inside Wag Punk Arena barrier or vaults).

### `IsTeleportLinkingPermittedFromPoint(fx, fy, fz)`
* **Description:** Determines if teleport *linking* is allowed from a point.
* **Parameters:** Same as above.
* **Returns:** `true`/`false`.

## Events & listeners
No events are defined or emitted in `util.lua`.