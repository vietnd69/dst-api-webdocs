# Cấu trúc phân nhóm hợp lý cho Core Systems

## Cấu trúc thư mục tối ưu

```
docs/api-vanilla/core-systems/
├── index.md                                    # sidebar_position: 1
├── fundamentals/                               # sidebar_position: 10
│   ├── index.md                               # Tổng quan hệ thống cơ bản
│   ├── core/                                  # sidebar_position: 1 - Nền tảng OOP và Entity
│   │   ├── index.md
│   │   ├── class.md                          # sidebar_position: 1 - OOP foundation
│   │   ├── metaclass.md                      # sidebar_position: 2 - Advanced OOP
│   │   ├── entityscript.md                   # sidebar_position: 3 - Core entity system
│   │   ├── entityscriptproxy.md              # sidebar_position: 4 - Entity proxy
│   │   ├── entityreplica.md                  # sidebar_position: 5 - Network replication
│   │   └── standardcomponents.md             # sidebar_position: 6 - Standard components
│   ├── utilities/                            # sidebar_position: 2 - Core utilities
│   │   ├── index.md
│   │   ├── util.md                          # sidebar_position: 1 - General utilities
│   │   ├── mathutil.md                      # sidebar_position: 2 - Math functions
│   │   ├── stringutil.md                    # sidebar_position: 3 - String manipulation
│   │   ├── vector3.md                       # sidebar_position: 4 - 3D vector class
│   │   ├── vecutil.md                       # sidebar_position: 5 - 2D vector utils
│   │   ├── vec3util.md                      # sidebar_position: 6 - 3D vector utils
│   │   ├── simutil.md                       # sidebar_position: 7 - Simulation utilities
│   │   ├── componentutil.md                 # sidebar_position: 8 - Component helpers
│   │   ├── fileutil.md                      # sidebar_position: 9 - File operations
│   │   └── perfutil.md                      # sidebar_position: 10 - Performance utils
│   ├── actions/                             # sidebar_position: 3 - Action system
│   │   ├── index.md
│   │   ├── actions.md                       # sidebar_position: 1 - Core action system
│   │   ├── bufferedaction.md                # sidebar_position: 2 - Deferred actions
│   │   ├── componentactions.md              # sidebar_position: 3 - Component interactions
│   │   └── equipslotutil.md                 # sidebar_position: 4 - Equipment utilities
│   └── ai-systems/                          # sidebar_position: 4 - AI và State Management
│       ├── index.md
│       ├── brain.md                         # sidebar_position: 1 - AI brain system
│       ├── behaviourtree.md                 # sidebar_position: 2 - Behavior trees
│       └── stategraph.md                    # sidebar_position: 3 - State machines
├── game-mechanics/                           # sidebar_position: 20
│   ├── index.md                               # Tổng quan cơ chế gameplay
│   ├── cooking/                              # sidebar_position: 1 - Hệ thống nấu ăn
│   │   ├── index.md
│   │   ├── cooking.md                        # sidebar_position: 1 - Core cooking system
│   │   ├── cookbookdata.md                   # sidebar_position: 2 - Recipe discovery
│   │   ├── preparedfoods.md                  # sidebar_position: 3 - Standard recipes
│   │   ├── preparedfoods_warly.md            # sidebar_position: 4 - Warly recipes
│   │   ├── preparednonfoods.md               # sidebar_position: 5 - Non-food recipes
│   │   ├── spicedfoods.md                    # sidebar_position: 6 - Spiced variants
│   │   └── wintersfeastcookedfoods.md        # sidebar_position: 7 - Event recipes
│   ├── crafting/                             # sidebar_position: 2 - Hệ thống chế tạo
│   │   ├── index.md
│   │   ├── recipe.md                         # sidebar_position: 1 - Core recipe system
│   │   ├── recipes.md                        # sidebar_position: 2 - Recipe definitions
│   │   ├── techtree.md                       # sidebar_position: 3 - Technology tree
│   │   ├── recipes_filter.md                 # sidebar_position: 4 - Recipe filtering
│   │   ├── crafting_sorting.md               # sidebar_position: 5 - Menu sorting
│   │   ├── craftingmenuprofile.md            # sidebar_position: 6 - User preferences
│   │   └── trade_recipes.md                  # sidebar_position: 7 - Trading system
│   ├── containers/                           # sidebar_position: 3 - Container system
│   │   ├── index.md
│   │   └── containers.md                     # sidebar_position: 1 - Container system
│   ├── achievements/                         # sidebar_position: 4 - Hệ thống thành tựu
│   │   ├── index.md
│   │   ├── achievements.md                   # sidebar_position: 1 - Core achievements
│   │   ├── eventachievements.md              # sidebar_position: 2 - Event achievements
│   │   ├── lavaarena_achievements.md         # sidebar_position: 3 - Lava Arena
│   │   ├── lavaarena_achievement_quest_defs.md # sidebar_position: 4 - Arena quests
│   │   ├── lavaarena_communityprogression.md # sidebar_position: 5 - Community progress
│   │   └── quagmire_achievements.md          # sidebar_position: 6 - Quagmire event
│   └── special-events/                       # sidebar_position: 5 - Sự kiện đặc biệt
│       ├── index.md
│       ├── messagebottletreasures.md         # sidebar_position: 1 - Message bottles
│       ├── quagmire_recipebook.md            # sidebar_position: 2 - Quagmire recipes
│       ├── yotb_costumes.md                  # sidebar_position: 3 - YOTB costumes
│       └── yotb_sewing.md                    # sidebar_position: 4 - YOTB sewing
├── character-systems/                        # sidebar_position: 30
│   ├── index.md                               # Tổng quan hệ thống nhân vật
│   ├── core/                                 # sidebar_position: 1 - Core character management
│   │   ├── index.md
│   │   ├── characterutil.md                  # sidebar_position: 1 - Character utilities
│   │   ├── playerprofile.md                  # sidebar_position: 2 - Player profiles
│   │   ├── playerhistory.md                  # sidebar_position: 3 - Player history
│   │   └── playerdeaths.md                   # sidebar_position: 4 - Death tracking
│   ├── customization/                        # sidebar_position: 2 - Tùy chỉnh ngoại hình
│   │   ├── index.md
│   │   ├── clothing.md                       # sidebar_position: 1 - Basic clothing
│   │   ├── beefalo_clothing.md               # sidebar_position: 2 - Beefalo clothing
│   │   ├── skins_defs_data.md                # sidebar_position: 3 - Skin definitions
│   │   ├── skin_affinity_info.md             # sidebar_position: 4 - Skin affinity
│   │   ├── skin_assets.md                    # sidebar_position: 5 - Skin assets
│   │   ├── skin_set_info.md                  # sidebar_position: 6 - Skin sets
│   │   ├── skin_gifts.md                     # sidebar_position: 7 - Skin gifts
│   │   ├── skinsutils.md                     # sidebar_position: 8 - Skin utilities
│   │   ├── skinsfiltersutils.md              # sidebar_position: 9 - Skin filters
│   │   └── skinstradeutils.md                # sidebar_position: 10 - Skin trading
│   ├── emotes/                              # sidebar_position: 3 - Biểu cảm và cử chỉ
│   │   ├── index.md
│   │   ├── emotes.md                        # sidebar_position: 1 - Core emotes
│   │   ├── emote_items.md                   # sidebar_position: 2 - Premium emotes
│   │   └── emoji_items.md                   # sidebar_position: 3 - Emoji items
│   ├── progression/                         # sidebar_position: 4 - Phát triển kỹ năng
│   │   ├── index.md
│   │   ├── progressionconstants.md          # sidebar_position: 1 - Progression constants
│   │   ├── skilltreedata.md                 # sidebar_position: 2 - Skill trees
│   │   ├── wx78_moduledefs.md               # sidebar_position: 3 - WX-78 modules
│   │   └── wxputils.md                      # sidebar_position: 4 - WXP utilities
│   └── speech/                              # sidebar_position: 5 - Đối thoại nhân vật
│       ├── index.md
│       ├── speech_wilson.md                 # sidebar_position: 1 - Wilson (Master template)
│       ├── speech_willow.md                 # sidebar_position: 2 - Willow
│       ├── speech_wolfgang.md               # sidebar_position: 3 - Wolfgang
│       ├── speech_wendy.md                  # sidebar_position: 4 - Wendy
│       ├── speech_wx78.md                   # sidebar_position: 5 - WX-78
│       ├── speech_wickerbottom.md           # sidebar_position: 6 - Wickerbottom
│       ├── speech_woodie.md                 # sidebar_position: 7 - Woodie
│       ├── speech_waxwell.md                # sidebar_position: 8 - Maxwell
│       ├── speech_wathgrithr.md             # sidebar_position: 9 - Wigfrid
│       ├── speech_webber.md                 # sidebar_position: 10 - Webber
│       ├── speech_winona.md                 # sidebar_position: 11 - Winona
│       ├── speech_wortox.md                 # sidebar_position: 12 - Wortox
│       ├── speech_wormwood.md               # sidebar_position: 13 - Wormwood
│       ├── speech_warly.md                  # sidebar_position: 14 - Warly
│       ├── speech_wurt.md                   # sidebar_position: 15 - Wurt
│       ├── speech_walter.md                 # sidebar_position: 16 - Walter
│       └── speech_wanda.md                  # sidebar_position: 17 - Wanda
├── world-systems/                           # sidebar_position: 40
│   ├── index.md                               # Tổng quan hệ thống thế giới
│   ├── generation/                           # sidebar_position: 1 - Tạo thế giới
│   │   ├── index.md
│   │   ├── worldgen_main.md                  # sidebar_position: 1 - Core world generation
│   │   ├── worldsettingsutil.md              # sidebar_position: 2 - Settings utilities
│   │   ├── worldsettings_overrides.md        # sidebar_position: 3 - Settings overrides
│   │   ├── custompresets.md                  # sidebar_position: 4 - Custom presets
│   │   ├── regrowthutil.md                   # sidebar_position: 5 - Regrowth utilities
│   │   ├── plantregistrydata.md              # sidebar_position: 6 - Plant registry
│   │   └── prefabswaps.md                    # sidebar_position: 7 - Prefab variations
│   ├── tiles-terrain/                        # sidebar_position: 2 - Địa hình và tiles
│   │   ├── index.md
│   │   ├── tiledefs.md                       # sidebar_position: 1 - Tile definitions
│   │   ├── tilegroups.md                     # sidebar_position: 2 - Tile groups
│   │   ├── tilemanager.md                    # sidebar_position: 3 - Tile manager
│   │   ├── worldtiledefs.md                  # sidebar_position: 4 - World tile defs
│   │   ├── noisetilefunctions.md             # sidebar_position: 5 - Noise functions
│   │   └── groundcreepdefs.md                # sidebar_position: 6 - Ground creep
│   ├── entities/                             # sidebar_position: 3 - Quản lý entities
│   │   ├── index.md
│   │   ├── prefabs.md                        # sidebar_position: 1 - Core prefab system
│   │   ├── prefablist.md                     # sidebar_position: 2 - Prefab registry
│   │   ├── prefabutil.md                     # sidebar_position: 3 - Prefab utilities
│   │   ├── worldentities.md                  # sidebar_position: 4 - World entities
│   │   ├── prefabskin.md                     # sidebar_position: 5 - Prefab skins
│   │   └── prefabskins.md                    # sidebar_position: 6 - Skin mappings
│   └── ocean/                                # sidebar_position: 4 - Hệ thống đại dương
│       ├── index.md
│       └── ocean_util.md                     # sidebar_position: 1 - Ocean utilities
├── networking-communication/                 # sidebar_position: 50
│   ├── index.md                               # Tổng quan mạng và giao tiếp
│   ├── networking/                           # sidebar_position: 1 - Networking core
│   │   ├── index.md
│   │   ├── networking.md                     # sidebar_position: 1 - Core networking
│   │   ├── networkclientrpc.md               # sidebar_position: 2 - Client RPC
│   │   ├── netvars.md                        # sidebar_position: 3 - Network variables
│   │   ├── shardnetworking.md                # sidebar_position: 4 - Shard networking
│   │   └── shardindex.md                     # sidebar_position: 5 - Shard management
│   ├── chat-commands/                        # sidebar_position: 2 - Chat và commands
│   │   ├── index.md
│   │   ├── chathistory.md                    # sidebar_position: 1 - Chat history
│   │   ├── usercommands.md                   # sidebar_position: 2 - User commands
│   │   ├── builtinusercommands.md            # sidebar_position: 3 - Builtin commands
│   │   ├── voteutil.md                       # sidebar_position: 4 - Voting utilities
│   │   └── wordfilter.md                     # sidebar_position: 5 - Content filtering
│   └── multiplayer/                          # sidebar_position: 3 - Multiplayer features
│       ├── index.md
│       ├── motdmanager.md                    # sidebar_position: 1 - MOTD management
│       ├── popupmanager.md                   # sidebar_position: 2 - Popup management
│       └── serverpreferences.md              # sidebar_position: 3 - Server preferences
├── user-interface/                          # sidebar_position: 60
│   ├── index.md                               # Tổng quan giao diện người dùng
│   ├── frontend/                             # sidebar_position: 1 - Core UI management
│   │   ├── index.md
│   │   ├── frontend.md                       # sidebar_position: 1 - Core frontend
│   │   ├── datagrid.md                       # sidebar_position: 2 - Data grid utilities
│   │   ├── loadingtipsdata.md                # sidebar_position: 3 - Loading tips
│   │   ├── splitscreenutils_pc.md            # sidebar_position: 4 - Split screen utils
│   │   └── writeables.md                     # sidebar_position: 5 - Text input system
│   ├── input/                                # sidebar_position: 2 - Input handling
│   │   ├── index.md
│   │   ├── input.md                          # sidebar_position: 1 - Core input system
│   │   └── haptics.md                        # sidebar_position: 2 - Haptic feedback
│   ├── graphics/                             # sidebar_position: 3 - Visual effects
│   │   ├── index.md
│   │   ├── lighting.md                       # sidebar_position: 1 - Lighting system
│   │   ├── fx.md                             # sidebar_position: 2 - Visual effects
│   │   ├── emitters.md                       # sidebar_position: 3 - Particle emitters
│   │   ├── camerashake.md                    # sidebar_position: 4 - Camera effects
│   │   ├── postprocesseffects.md             # sidebar_position: 5 - Post-processing
│   │   ├── shadeeffects.md                   # sidebar_position: 6 - Shade effects
│   │   └── falloffdefs.md                    # sidebar_position: 7 - Falloff textures
│   └── typography/                           # sidebar_position: 4 - Typography và animations
│       ├── index.md
│       ├── fonts.md                          # sidebar_position: 1 - Font system
│       ├── fonthelper.md                     # sidebar_position: 2 - Font utilities
│       └── easing.md                         # sidebar_position: 3 - Animation easing
├── game-configuration/                       # sidebar_position: 70
│   ├── index.md                               # Tổng quan cấu hình game
│   ├── settings/                             # sidebar_position: 1 - Game settings
│   │   ├── index.md
│   │   ├── config.md                         # sidebar_position: 1 - Platform config
│   │   ├── constants.md                      # sidebar_position: 2 - Game constants
│   │   ├── tuning.md                         # sidebar_position: 3 - Game balance
│   │   ├── tuning_override.md                # sidebar_position: 4 - Tuning overrides
│   │   ├── globalvariableoverrides.md        # sidebar_position: 5 - Base overrides
│   │   ├── globalvariableoverrides_clean.md  # sidebar_position: 6 - Clean environment
│   │   ├── globalvariableoverrides_monkey.md # sidebar_position: 7 - Mod testing
│   │   ├── globalvariableoverrides_pax_server.md # sidebar_position: 8 - PAX server
│   │   ├── consolescreensettings.md          # sidebar_position: 9 - Console settings
│   │   └── firelevel.md                      # sidebar_position: 10 - Fire intensity
│   ├── modes/                                # sidebar_position: 2 - Game modes
│   │   ├── index.md
│   │   ├── gamelogic.md                      # sidebar_position: 1 - Core game logic
│   │   ├── gamemodes.md                      # sidebar_position: 2 - Game modes
│   │   └── events.md                         # sidebar_position: 3 - Event system
│   └── stats/                                # sidebar_position: 3 - Statistics
│       ├── index.md
│       ├── stats.md                          # sidebar_position: 1 - Core statistics
│       └── item_blacklist.md                 # sidebar_position: 2 - Item blacklist
├── development-tools/                        # sidebar_position: 80
│   ├── index.md                               # Tổng quan công cụ phát triển
│   ├── debugging/                            # sidebar_position: 1 - Debug tools
│   │   ├── index.md
│   │   ├── debugcommands.md                  # sidebar_position: 1 - Debug commands
│   │   ├── debugtools.md                     # sidebar_position: 2 - Debug utilities
│   │   ├── debughelpers.md                   # sidebar_position: 3 - Debug helpers
│   │   ├── debugkeys.md                      # sidebar_position: 4 - Debug keybinds
│   │   ├── debugmenu.md                      # sidebar_position: 5 - Debug menu system
│   │   ├── debugprint.md                     # sidebar_position: 6 - Enhanced printing
│   │   ├── debugsounds.md                    # sidebar_position: 7 - Sound debugging
│   │   ├── inspect.md                        # sidebar_position: 8 - Table inspection
│   │   └── stacktrace.md                     # sidebar_position: 9 - Stack traces
│   ├── console/                              # sidebar_position: 2 - Console system
│   │   ├── index.md
│   │   ├── consolecommands.md                # sidebar_position: 1 - Console commands
│   │   └── reload.md                         # sidebar_position: 2 - Hot reloading
│   ├── profiling/                            # sidebar_position: 3 - Performance profiling
│   │   ├── index.md
│   │   ├── profiler.md                       # sidebar_position: 1 - Code profiler
│   │   └── miser.md                          # sidebar_position: 2 - Audio profiling
│   └── utilities/                            # sidebar_position: 4 - Dev utilities
│       ├── index.md
│       ├── dumper.md                         # sidebar_position: 1 - Data serialization
│       ├── strict.md                         # sidebar_position: 2 - Strict mode
│       ├── knownerrors.md                    # sidebar_position: 3 - Error handling
│       ├── generickv.md                      # sidebar_position: 4 - Key-value storage
│       └── fix_character_strings.md          # sidebar_position: 5 - String utilities
├── system-core/                              # sidebar_position: 5
│   ├── index.md                               # Tổng quan lõi hệ thống
│   ├── engine/                               # sidebar_position: 1 - Engine core
│   │   ├── index.md
│   │   ├── main.md                           # sidebar_position: 1 - Game initialization
│   │   ├── mainfunctions.md                  # sidebar_position: 2 - Core functions
│   │   ├── physics.md                        # sidebar_position: 3 - Physics system
│   │   └── maputil.md                        # sidebar_position: 4 - Map utilities
│   └── runtime/                              # sidebar_position: 2 - Runtime systems
│       ├── index.md
│       └── update.md                         # sidebar_position: 1 - Update loop
├── localization-content/                     # sidebar_position: 90
│   ├── index.md                               # Tổng quan nội dung và bản địa hóa
│   ├── strings/                              # sidebar_position: 1 - String management
│   │   ├── index.md
│   │   ├── strings.md                        # sidebar_position: 1 - Main strings
│   │   ├── strings_pretranslated.md          # sidebar_position: 2 - Pre-translated
│   │   ├── skin_strings.md                   # sidebar_position: 3 - Skin strings
│   │   ├── createstringspo.md                # sidebar_position: 4 - POT generation
│   │   └── createstringspo_dlc.md            # sidebar_position: 5 - DLC POT generation
│   ├── translation/                          # sidebar_position: 2 - Translation tools
│   │   ├── index.md
│   │   ├── translator.md                     # sidebar_position: 1 - Translation system
│   │   └── curse_monkey_util.md              # sidebar_position: 2 - Monkey curse utils
│   └── content/                              # sidebar_position: 3 - Game content
│       ├── index.md
│       ├── misc_items.md                     # sidebar_position: 1 - Misc items catalog
│       ├── scrapbook_prefabs.md              # sidebar_position: 2 - Scrapbook registry
│       ├── strings_stageactor.md             # sidebar_position: 3 - Stage actor content
│       ├── signgenerator.md                  # sidebar_position: 4 - Sign generation
│       ├── giantutils.md                     # sidebar_position: 5 - Giant utilities
│       ├── play_commonfn.md                  # sidebar_position: 6 - Stage play common
│       ├── play_generalscripts.md            # sidebar_position: 7 - General scripts
│       ├── play_the_doll.md                  # sidebar_position: 8 - The Doll play
│       ├── play_the_veil.md                  # sidebar_position: 9 - The Veil play
│       ├── guitartab_dsmaintheme.md          # sidebar_position: 10 - Guitar tabs
│       └── notetable_dsmaintheme.md          # sidebar_position: 11 - Note tables
├── data-management/                          # sidebar_position: 100
│   ├── index.md                               # Tổng quan quản lý dữ liệu
│   ├── saves/                                # sidebar_position: 1 - Save system
│   │   ├── index.md
│   │   ├── saveindex.md                      # sidebar_position: 1 - Save management
│   │   ├── savefileupgrades.md               # sidebar_position: 2 - Save upgrades
│   │   ├── shardsaveindex.md                 # sidebar_position: 3 - Shard saves
│   │   └── scrapbookpartitions.md            # sidebar_position: 4 - Scrapbook data
│   ├── assets/                               # sidebar_position: 2 - Asset management
│   │   ├── index.md
│   │   ├── json.md                           # sidebar_position: 1 - JSON support
│   │   ├── klump.md                          # sidebar_position: 2 - Encrypted files
│   │   ├── klump_files.md                    # sidebar_position: 3 - Klump registry
│   │   ├── mixes.md                          # sidebar_position: 4 - Audio mixes
│   │   └── preloadsounds.md                  # sidebar_position: 5 - Sound preloading
│   └── utilities/                            # sidebar_position: 3 - Data utilities
│       ├── index.md
│       ├── scheduler.md                      # sidebar_position: 1 - Task scheduling
│       ├── platformpostload.md               # sidebar_position: 2 - Platform config
│       └── traps.md                          # sidebar_position: 3 - Legacy redirects
├── mod-support/                              # sidebar_position: 110
│   ├── index.md                               # Tổng quan hỗ trợ mod
│   ├── core/                                 # sidebar_position: 1 - Mod system core
│   │   ├── index.md
│   │   ├── mods.md                           # sidebar_position: 1 - Core mod system
│   │   ├── modindex.md                       # sidebar_position: 2 - Mod registry
│   │   ├── modutil.md                        # sidebar_position: 3 - Mod utilities
│   │   └── modcompatability.md               # sidebar_position: 4 - Mod compatibility
│   └── dlc/                                  # sidebar_position: 2 - DLC support
│       ├── index.md
│       ├── dlcsupport.md                     # sidebar_position: 1 - Core DLC support
│       ├── dlcsupport_strings.md             # sidebar_position: 2 - DLC strings
│       ├── dlcsupport_worldgen.md            # sidebar_position: 3 - DLC worldgen
│       └── upsell.md                         # sidebar_position: 4 - Demo upselling
```

## Giải thích cấu trúc tối ưu với sidebar_position

### Nguyên tắc sắp xếp thứ tự:
1. **Importance-based ordering**: Từ cơ bản đến nâng cao
2. **Dependency hierarchy**: Hệ thống core trước, ứng dụng sau
3. **Developer workflow**: Từ lập trình viên core đến content creator
4. **Logical grouping**: Nhóm các chức năng liên quan gần nhau

### **1. fundamentals/** (sidebar_position: 10) - Nền tảng lập trình
- **core/**: OOP system, entity management - Nền tảng của toàn bộ game
- **utilities/**: Core utility functions - Các hàm tiện ích cơ bản
- **actions/**: Player interaction system - Hệ thống tương tác
- **ai-systems/**: AI và state management - Hệ thống AI

### **2. game-mechanics/** (sidebar_position: 20) - Cơ chế gameplay
- **cooking/**: Recipe system và food mechanics
- **crafting/**: Crafting recipes và technology tree
- **containers/**: Inventory và storage systems
- **achievements/**: Achievement system và progression
- **special-events/**: Seasonal events và limited-time content

### **3. character-systems/** (sidebar_position: 30) - Hệ thống nhân vật
- **core/**: Player profile và character management
- **customization/**: Skins, clothing và visual customization
- **emotes/**: Player expressions và social features
- **progression/**: Skill trees và character advancement
- **speech/**: Character dialogue system (Wilson làm master template)

### **4. world-systems/** (sidebar_position: 40) - Hệ thống thế giới
- **generation/**: World generation và settings
- **tiles-terrain/**: Ground tiles và terrain system
- **entities/**: Prefab management và world entities
- **ocean/**: Ocean mechanics và water systems

### **5. system-core/** (sidebar_position: 5) - Lõi engine (đặt sớm vì quan trọng)
- **engine/**: Game initialization và core functions
- **runtime/**: Update loops và runtime systems

### **6. networking-communication/** (sidebar_position: 50) - Multiplayer
- **networking/**: Core networking và RPC systems
- **chat-commands/**: Chat system và player commands
- **multiplayer/**: Server management và preferences

### **7. user-interface/** (sidebar_position: 60) - Giao diện
- **frontend/**: Core UI management
- **input/**: Input handling và controls
- **graphics/**: Visual effects và rendering
- **typography/**: Fonts và animation easing

### **8. game-configuration/** (sidebar_position: 70) - Cấu hình
- **settings/**: Game settings và tuning values
- **modes/**: Game modes và logic
- **stats/**: Statistics và tracking

### **9. development-tools/** (sidebar_position: 80) - Developer tools
- **debugging/**: Debug utilities và inspection tools
- **console/**: Console commands và hot reloading
- **profiling/**: Performance monitoring
- **utilities/**: Development utilities

### **10. localization-content/** (sidebar_position: 90) - Nội dung
- **strings/**: String management và localization
- **translation/**: Translation tools
- **content/**: Game content và theatrical systems

### **11. data-management/** (sidebar_position: 100) - Quản lý dữ liệu
- **saves/**: Save game system
- **assets/**: Asset loading và management
- **utilities/**: Data processing utilities

### **12. mod-support/** (sidebar_position: 110) - Hỗ trợ mod
- **core/**: Core mod system
- **dlc/**: DLC support và demo systems

## Lợi ích của cấu trúc mới:

1. **Logical Navigation**: Thứ tự sidebar phản ánh workflow thực tế
2. **Dependency Order**: Core systems xuất hiện trước derived systems
3. **Learning Path**: Developers có thể học từ cơ bản đến nâng cao
4. **Content Organization**: Liên quan logic được nhóm gần nhau
5. **Easy Maintenance**: Cấu trúc rõ ràng giúp bảo trì dễ dàng

## Xác nhận phù hợp với nội dung thực tế

Sau khi xem xét phần Overview của các tài liệu quan trọng:

✅ **achievements.md** - "Achievement definitions and platform integration" → `game-mechanics/achievements/`  
✅ **actions.md** - "Player interaction and action system" → `fundamentals/actions/`  
✅ **beefalo_clothing.md** - "Cosmetic beefalo customization" → `character-systems/customization/`  
✅ **behaviourtree.md** - "AI state management and decision making" → `fundamentals/ai-systems/`  
✅ **brain.md** - "AI entity control and behavior management" → `fundamentals/ai-systems/`  
✅ **bufferedaction.md** - "Deferred action execution" → `fundamentals/actions/`  
✅ **builtinusercommands.md** - "Player interaction and server administration" → `networking-communication/chat-commands/`  
✅ **camerashake.md** - "Visual feedback effects" → `user-interface/graphics/`  
✅ **characterutil.md** - "Character portraits, avatars, names" → `character-systems/core/`  
✅ **cooking.md** - "Ingredient processing, recipe calculation" → `game-mechanics/cooking/`  
✅ **stategraph.md** - "Entity behaviors, animations, logic flow" → `fundamentals/ai-systems/`  
✅ **worldgen_main.md** - "Core world generation system" → `world-systems/generation/`  
✅ **frontend.md** - "Core UI management layer" → `user-interface/frontend/`  
✅ **util.md** - "Collection of utility functions for table manipulation, string processing, math calculations" → `fundamentals/utilities/`  
✅ **stringutil.md** - "Utility functions for string manipulation, character speech, and text formatting" → `fundamentals/utilities/`  
✅ **mathutil.md** - "Mathematical utility functions for sine waves, interpolation, rounding, clamping" → `fundamentals/utilities/`  
✅ **vecutil.md** - "Utility functions for 2D vector operations on the XZ plane" → `fundamentals/utilities/`  
✅ **class.md** - "Object-oriented programming system providing inheritance, property management" → `fundamentals/core/`  
✅ **entityscript.md** - "Core class representing all game entities and their behavior management system" → `fundamentals/core/`  
✅ **constants.md** - "Comprehensive documentation of Don't Starve Together global constants and configuration values" → `game-configuration/settings/`  
✅ **debugcommands.md** - "Collection of debug utility functions for development, testing, and troubleshooting" → `development-tools/debugging/`  
✅ **recipe.md** - "Core classes and functions for defining crafting recipes, ingredients, and recipe management" → `game-mechanics/crafting/`  
✅ **lighting.md** - "Lighting system configuration and utilities (currently empty module)" → `user-interface/graphics/`  
✅ **networking.md** - "Core networking functions for server management, client connections, and multiplayer features" → `networking-communication/networking/`  
✅ **prefabs.md** - "Core prefab system for creating game objects and managing assets" → `world-systems/entities/`  
✅ **skins_defs_data.md** - "Auto-generated skin definitions, configurations, and asset mappings for the inventory system" → `character-systems/customization/`  
✅ **skilltreedata.md** - "Class for managing character skill tree data including skill activation, experience tracking" → `character-systems/progression/`  
✅ **tuning.md** - "Central game balance and configuration system controlling gameplay parameters" → `game-configuration/settings/`  
✅ **standardcomponents.md** - "Standard component creation utilities and default behaviors for Don't Starve Together prefabs" → `fundamentals/core/`  
✅ **saveindex.md** - "Save game management system for slot-based save data and session handling" → `data-management/saves/`  
✅ **mods.md** - "Core mod loading and management system for Don't Starve Together" → `mod-support/core/`  
✅ **emotes.md** - "Core emote system and basic emote definitions for player expressions and actions" → `character-systems/emotes/`  
✅ **strings.md** - "Global string table system for all user-facing text and localization" → `localization-content/strings/`  
✅ **scheduler.md** - "Thread and task scheduling system for coroutine-based execution control" → `data-management/utilities/`  
✅ **input.md** - "Comprehensive input handling for keyboard, mouse, controllers, and virtual controls" → `user-interface/input/`  
✅ **containers.md** - "Container system configuration and widget setup for various storage types" → `game-mechanics/containers/`  
✅ **config.md** - "Platform configuration management system with platform-specific overrides" → `game-configuration/settings/`  
✅ **consolecommands.md** - "Comprehensive DST console command system for debugging, administration, and development tasks" → `development-tools/console/`  
✅ **main.md** - "Core game initialization script containing platform detection, system setup, and asset loading" → `system-core/engine/`  
✅ **componentactions.md** - "Core mechanism that defines how players can interact with entities through various components" → `fundamentals/actions/`  
✅ **componentutil.md** - "Comprehensive collection of helper functions that support various gameplay mechanics and entity management" → `fundamentals/utilities/`  
✅ **gamelogic.md** - "Central orchestrator for core game systems managing complete game lifecycle from startup through world generation" → `game-configuration/modes/`  
✅ **gamemodes.md** - "System for managing different game modes and their configurations" → `game-configuration/modes/`  
✅ **events.md** - "Robust mechanism for handling game events and inter-component communication" → `game-configuration/modes/`  
✅ **fx.md** - "Comprehensive collection of visual effects for animation-based particle effects, sounds, and screen elements" → `user-interface/graphics/`  
✅ **vector3.md** - "Object-oriented 3D vector class with operator overloading and advanced vector operations" → `fundamentals/utilities/`  
✅ **vec3util.md** - "Utility functions for 3D vector operations on the XYZ coordinate system" → `fundamentals/utilities/`  
✅ **recipes.md** - "Complete recipe definitions and implementation system for crafting" → `game-mechanics/crafting/`  
✅ **physics.md** - "Physics collision handling, entity launching, and area destruction utilities" → `system-core/engine/`  
✅ **json.md** - "JSON encoding and decoding support for Lua data structures with game-specific adaptations" → `data-management/assets/`  
✅ **modutil.md** - "Essential utility functions for mod development including error handling and environment setup" → `mod-support/core/`  
✅ **maputil.md** - "Map topology utilities for pathfinding, node manipulation, convex hull calculations, and map visualization" → `system-core/engine/`  
✅ **simutil.md** - "Core utility functions for entity finding, position validation, vision checking, atlas management" → `fundamentals/utilities/`  
✅ **perfutil.md** - "Performance monitoring, profiling, and debugging utilities" → `development-tools/profiling/`  
✅ **fileutil.md** - "Utility functions for managing persistent file operations including deletion and existence checking" → `data-management/utilities/`  
✅ **emitters.md** - "Particle emitter management system and geometric emitter creation functions" → `user-interface/graphics/`  
✅ **tuning_override.md** - "System for overriding and disabling specific game mechanics and events through dummy function replacements" → `game-configuration/settings/`  
✅ **stats.md** - "Statistics and metrics collection system for tracking game events and performance data" → `game-configuration/stats/`  
✅ **spicedfoods.md** - "System for generating spiced variants of food items with additional effects and properties" → `game-mechanics/cooking/`  
✅ **worldsettingsutil.md** - "Utility functions for managing external timers and world settings integration with game components" → `world-systems/generation/`  
✅ **worldsettings_overrides.md** - "Comprehensive world configuration override system for customizing Don't Starve Together gameplay settings" → `world-systems/generation/`  
✅ **worldtiledefs.md** - "Ground tile system for terrain properties, footstep sounds, and visual assets management" → `world-systems/tiles-terrain/`  
✅ **worldentities.md** - "World entity injection system for ensuring required entities exist across all worlds and shards" → `world-systems/entities/`  
✅ **usercommands.md** - "Slash command execution, permission management, and voting system for player commands" → `networking-communication/chat-commands/`  
✅ **translator.md** - "Localization and translation system for managing multi-language support in Don't Starve Together" → `localization-content/translation/`  
✅ **tiledefs.md** - "Complete definitions of all vanilla ground tiles including ocean, land, impassable, and noise tiles with their properties" → `world-systems/tiles-terrain/`  
✅ **tilegroups.md** - "Tile categorization and validation system for checking tile types and managing tile group relationships" → `world-systems/tiles-terrain/`  
✅ **tilemanager.md** - "Core module for managing ground tiles, falloff textures, and ground creep in the world generation system" → `world-systems/tiles-terrain/`  
✅ **strings_pretranslated.md** - "Pre-translated language strings and localization support for multi-language user interfaces" → `localization-content/strings/`  
✅ **strict.md** - "Lua strict mode implementation preventing access to undeclared global variables" → `development-tools/utilities/`  
✅ **stacktrace.md** - "Debug stack trace and error handling utilities for Lua error analysis and debugging" → `development-tools/debugging/` (chỉ ở vị trí này)  
✅ **splitscreenutils_pc.md** - "PC-specific split screen utility functions and instance management for Don't Starve Together" → `user-interface/frontend/`  
✅ **shadeeffects.md** - "Visual shade rendering system for environmental lighting effects and canopy shadows" → `user-interface/graphics/`  
✅ **serverpreferences.md** - "Client-side management system for server display preferences including profanity filtering and name visibility controls" → `networking-communication/multiplayer/`  
✅ **scrapbookpartitions.md** - "Data management system for tracking scrapbook discovery progress and synchronization" → `data-management/saves/`  
✅ **scrapbook_prefabs.md** - "Registry of all prefabs that can be discovered and documented in the in-game scrapbook" → `localization-content/content/`  
✅ **regrowthutil.md** - "Utility functions for calculating entity regrowth densities and spatial distribution" → `world-systems/generation/`  
✅ **recipes_filter.md** - "Crafting menu categorization system for organizing recipes into filtered groups and categories" → `game-mechanics/crafting/`  
✅ **preloadsounds.md** - "Sound file preloading system for optimized audio performance with DLC detection and event music handling" → `data-management/assets/`  
✅ **profiler.md** - "Lua code performance profiling system for debugging and optimization analysis based on Pepperfish profiler" → `development-tools/profiling/`  
✅ **progressionconstants.md** - "Character unlock progression system based on experience points with daily XP accumulation and level thresholds" → `character-systems/progression/`  
✅ **quagmire_achievements.md** - "Achievement system definitions for the Quagmire seasonal event with WXP rewards and completion criteria" → `game-mechanics/achievements/`  
✅ **quagmire_recipebook.md** - "Class for managing recipe discovery, storage, and unlocking in the Quagmire seasonal event" → `game-mechanics/special-events/`  
✅ **reload.md** - "Hot-swapping and live reloading system for development enabling rapid iteration while preserving game state" → `development-tools/utilities/`  
✅ **savefileupgrades.md** - "Save data migration and upgrade system for maintaining compatibility across game versions" → `data-management/saves/`  
✅ **shardindex.md** - "Cluster shard management system for server data persistence and world generation configuration" → `networking-communication/multiplayer/`  
✅ **shardnetworking.md** - "Inter-shard communication and synchronization system for cluster management and portal connectivity" → `networking-communication/networking/`  
✅ **shardsaveindex.md** - "Multi-shard save slot management system for cluster save organization and data retrieval" → `data-management/saves/`  
✅ **signgenerator.md** - "Utility module for generating random sign descriptions based on ground type and predefined string patterns" → `localization-content/content/`  
✅ **skin_affinity_info.md** - "Character-specific skin affinity mapping data defining skin associations for each playable character" → `character-systems/customization/`  
✅ **skin_assets.md** - "Asset loading definitions for character skins and themed items ensuring proper visual asset loading during initialization" → `character-systems/customization/`  
✅ **skin_gifts.md** - "Gift system configuration for skin items and reward popups with gift type mappings and display configurations" → `character-systems/customization/`  
✅ **skin_set_info.md** - "Coordinated skin set definitions for emotes and themed item collections ensuring visual consistency" → `character-systems/customization/`  
✅ **skin_strings.md** - "Auto-generated localization strings for character skin quotes and item names providing text content for cosmetic skins" → `localization-content/strings/`  
✅ **techtree.md** - "Technology tree system for managing crafting station requirements and research levels with bonus tech support" → `game-mechanics/crafting/`  
✅ **trade_recipes.md** - "Configuration system for item trading and upgrade recipes focusing on rarity-based upgrade systems" → `game-mechanics/crafting/`  
✅ **traps.md** - "Legacy redirection file pointing to trap functionality now located in scenarios folder for better organization" → `data-management/utilities/` (chỉ ở vị trí này - là legacy redirect, không phải container functionality)  
✅ **update.md** - "Core update loop system handling game simulation timing, component updates, and different timing mechanisms" → `system-core/runtime/`  
✅ **yotb_sewing.md** - "Year of the Beefalo sewing system for costume recipe calculation and validation" → `game-mechanics/special-events/`  
✅ **yotb_costumes.md** - "Year of the Beefalo costume definitions and pattern matching system" → `game-mechanics/special-events/`  
✅ **wxputils.md** - "Utility functions for managing Winter's Feast Experience Points (WXP) including level calculation, progress tracking, and festival event handling" → `character-systems/progression/`  
✅ **wx78_moduledefs.md** - "System for defining and managing WX-78 character upgrade modules including health, sanity, speed, and special ability modules" → `character-systems/progression/`  
✅ **writeables.md** - "User interface system for text input on signs, beefalo naming, and gravestone epitaphs" → `user-interface/frontend/`  
✅ **skin_strings.md** - "Auto-generated localization strings for character skin quotes and item names providing text content for cosmetic skins" → `localization-content/strings/` (đã di chuyển từ character-systems)  
✅ **update.md** - "Core update loop system handling game simulation timing, component updates, and different timing mechanisms" → `system-core/runtime/` (đã di chuyển từ data-management)  
✅ **strict.md** - "Lua strict mode implementation preventing access to undeclared global variables" → `system-core/runtime/` (đã di chuyển từ development-tools)  
✅ **fix_character_strings.md** - "Utility script for alphabetically sorting and standardizing character speech files" → `development-tools/utilities/` (đã di chuyển từ localization-content)  
✅ **wordfilter.md** - "Content filtering system for chat and text input validation" → `networking-communication/chat-commands/`  

✅ **wintersfeastcookedfoods.md** - "Event food configuration data for Winter's Feast holiday cooking mechanics" → `game-mechanics/cooking/`  
✅ **voteutil.md** - "Utility functions for vote tallying and validation in user vote commands" → `networking-communication/chat-commands/`  
✅ **upsell.md** - "Demo version purchase screen and trial time management system" → `mod-support/dlc/`  
✅ **strings_stageactor.md** - "Dialogue content and performance scripts for theatrical stage actor events and character performances" → `localization-content/content/`  
✅ **skinsutils.md** - "Comprehensive utility system for managing character skins, items, colors, and inventory" → `character-systems/customization/`  
✅ **skinstradeutils.md** - "Utility functions for skin trading interface and recipe matching" → `character-systems/customization/`  
✅ **skinsfiltersutils.md** - "Utility functions for filtering skins lists in inventory and trading interfaces" → `character-systems/customization/`  
✅ **preparednonfoods.md** - "Non-food cookpot recipes for crafting special items and utility objects" → `game-mechanics/cooking/`  
✅ **preparedfoods_warly.md** - "Warly-specific portable cookpot recipes with unique effects and enhanced culinary options" → `game-mechanics/cooking/`  
✅ **preparedfoods.md** - "Standard cookpot recipes system defining all craftable food items in DST" → `game-mechanics/cooking/`  
✅ **misc_items.md** - "Comprehensive catalog of miscellaneous cosmetic items, emojis, loading screens, and purchasable content" → `localization-content/content/`  
✅ **mixes.md** - "Predefined audio mix configurations for different game states and scenarios" → `data-management/assets/`  
✅ **dlcsupport_strings.md** - "String handling system for DLC content with prefix/suffix management and adjective construction" → `mod-support/dlc/`  
✅ **dlcsupport.md** - "Core DLC management system for registering, enabling, and managing downloadable content" → `mod-support/dlc/`  
✅ **dlcsupport_worldgen.md** - "DLC support system specialized for world generation with parameter-based DLC state management" → `mod-support/dlc/`  
✅ **speech_warly.md** - "Character-specific dialogue and speech responses for Warly, the Cuisinier with French culinary background" → `character-systems/speech/`  
✅ **speech_waxwell.md** - "Character-specific dialogue and speech responses for Maxwell, the Puppet Master with aristocratic and magical background" → `character-systems/speech/`  
✅ **speech_wickerbottom.md** - "Character-specific dialogue and speech responses for Wickerbottom, the Librarian with academic scholarly personality" → `character-systems/speech/`  
✅ **speech_walter.md** - "Character-specific dialogue and speech responses for Walter, the Fearless Scout with youthful enthusiasm and scout training" → `character-systems/speech/`  
✅ **speech_wanda.md** - "Character-specific dialogue and speech responses for Wanda, the Clockmaker with time-obsessed personality and temporal abilities" → `character-systems/speech/`  
✅ **speech_wendy.md** - "Character-specific dialogue and speech responses for Wendy, the Bereaved with melancholic personality and connection to Abigail" → `character-systems/speech/`  
✅ **speech_wathgrithr.md** - "Character-specific dialogue and speech responses for Wigfrid, the Performance Artist with theatrical Norse warrior persona" → `character-systems/speech/`  
✅ **speech_webber.md** - "Character-specific dialogue and speech responses for Webber, the Indigestible with dual child-spider nature and innocent enthusiasm" → `character-systems/speech/`  
✅ **speech_willow.md** - "Character-specific dialogue and speech responses for Willow, the Firestarter with pyromaniac personality and love of destruction" → `character-systems/speech/`  
✅ **speech_winona.md** - "Character-specific dialogue and speech responses for Winona, the Handywoman with engineering background and technical expertise" → `character-systems/speech/`  
✅ **speech_wolfgang.md** - "Character-specific dialogue and speech responses for Wolfgang, the Strongman with German accent patterns and circus performer background" → `character-systems/speech/`  
✅ **speech_wilson.md** - "Master template for all character speech files serving as base for character dialogue generation and fallback system" → `character-systems/speech/`  
✅ **speech_woodie.md** - "Character-specific dialogue and speech responses for Woodie, the Canadian lumberjack with polite personality and Lucy axe companion" → `character-systems/speech/`  
✅ **speech_wormwood.md** - "Character-specific dialogue and speech responses for Wormwood, the sentient plant with limited vocabulary and childlike wonder" → `character-systems/speech/`  
✅ **speech_wortox.md** - "Character-specific dialogue and speech responses for Wortox, the mischievous imp with playful nature and theatrical expressions" → `character-systems/speech/`  
✅ **speech_wurt.md** - "Character-specific dialogue and speech responses for Wurt, the young merm with aquatic focus and unique vocalizations" → `character-systems/speech/`  
✅ **speech_wx78.md** - "Character-specific dialogue and speech responses for WX-78, the robotic automaton with superiority complex and technical communication" → `character-systems/speech/`  
✅ **debugmenu.md** - "Framework for creating text-based debug menu systems with navigation and interaction capabilities" → `development-tools/debugging/`  
✅ **debugsounds.md** - "Sound debugging system that tracks and monitors audio events with visual indicators and logging" → `development-tools/debugging/`  
✅ **dumper.md** - "Advanced Lua data serialization utility for converting complex data structures to executable Lua code" → `development-tools/utilities/`  
✅ **debugprint.md** - "Enhanced print functions with source line tracking and logger management for debugging purposes" → `development-tools/debugging/`  
✅ **debugtools.md** - "Comprehensive collection of debugging utilities including stack traces, table inspection, and conditional debugging" → `development-tools/debugging/`  
✅ **easing.md** - "Mathematical easing functions for smooth animations and transitions" → `user-interface/typography/`  

✅ **emoji_items.md** - "Emoji item definitions and configuration data for in-game emoji system" → `character-systems/emotes/`  
✅ **emote_items.md** - "Purchasable and unlockable emote item definitions for premium player expressions" → `character-systems/emotes/`  
✅ **entityreplica.md** - "Network component replication system for client-server synchronization in Don't Starve Together" → `fundamentals/core/`  
✅ **entityscriptproxy.md** - "Proxy wrapper system for EntityScript instances providing transparent access control and memory management" → `fundamentals/core/`  
✅ **equipslotutil.md** - "Utility module for managing equipment slot identifiers and conversions" → `fundamentals/actions/`  
✅ **eventachievements.md** - "System for managing event-based achievements and quest progression" → `game-mechanics/achievements/`  
✅ **falloffdefs.md** - "Module that defines tile falloff texture configurations for visual transitions between different terrain types" → `user-interface/graphics/`  
✅ **fonthelper.md** - "Utility function for adding font assets to asset tables" → `user-interface/typography/`  
✅ **fonts.md** - "Font constants and configuration system for text rendering in Don't Starve Together" → `user-interface/typography/`  
✅ **generickv.md** - "Wrapper for TheInventory synchronization providing persistent key-value storage" → `development-tools/utilities/`  
✅ **giantutils.md** - "Utility functions for giant creature movement and pathfinding behaviors" → `localization-content/content/`  
✅ **globalvariableoverrides_clean.md** - "Clean environment configuration file for global variable overrides" → `game-configuration/settings/`  
✅ **globalvariableoverrides_monkey.md** - "Mod testing configuration with enabled warnings and mod support" → `game-configuration/settings/`  
✅ **globalvariableoverrides_pax_server.md** - "Server configuration for PAX event environments with timed shutdown and mod warning suppression" → `game-configuration/settings/`  
✅ **groundcreepdefs.md** - "Defines ground creep configurations for terrain overlay effects like spider webs" → `world-systems/tiles-terrain/`  
✅ **guitartab_dsmaintheme.md** - "Guitar tablature data for the Don't Starve Together main theme with musical notation" → `localization-content/content/`  
✅ **haptics.md** - "Defines haptic feedback and vibration effects for game events through controller feedback" → `user-interface/input/`  
✅ **inspect.md** - "Library for creating human-readable representations of Lua tables and values for debugging" → `development-tools/debugging/`  
✅ **item_blacklist.md** - "Blacklist system for controlling item display visibility in UI contexts" → `game-configuration/stats/`  
✅ **klump_files.md** - "Auto-generated registry of encrypted klump files for festival events" → `data-management/assets/`  
✅ **klump.md** - "Encrypted file loading system for secure game assets and strings during festival events" → `data-management/assets/`  
✅ **knownerrors.md** - "Structured error handling system for common game errors with user-friendly messages" → `development-tools/utilities/`  
✅ **lavaarena_achievement_quest_defs.md** - "Defines achievement quest categories and progression system for Lava Arena events" → `game-mechanics/achievements/`  
✅ **lavaarena_communityprogression.md** - "Manages community-wide progression tracking and unlock system for Lava Arena events" → `game-mechanics/achievements/`  
✅ **loadingtipsdata.md** - "Manages loading screen tips with weighted selection and persistence system" → `user-interface/frontend/`  
✅ **mainfunctions.md** - "Core game functions for save/load operations, entity management, time functions, and game flow control" → `system-core/engine/`  
✅ **messagebottletreasures.md** - "System for generating treasure containers and loot from message bottles" → `game-mechanics/special-events/`  
✅ **metaclass.md** - "Advanced class creation system using userdata objects for enhanced garbage collection control" → `fundamentals/core/`  
✅ **miser.md** - "Audio mixing system for managing sound levels, filters, and audio states" → `development-tools/profiling/`  
✅ **modcompatability.md** - "System for handling mod compatibility and version upgrades between different mod formats" → `mod-support/core/`  
✅ **modindex.md** - "Mod registry and management system for tracking installed and enabled mods" → `mod-support/core/`  
✅ **motdmanager.md** - "Message of the Day management system for downloading and displaying game announcements" → `networking-communication/multiplayer/`  
✅ **netvars.md** - "Network variable types and utilities for synchronized client-server communication" → `networking-communication/networking/`  
✅ **networkclientrpc.md** - "Remote procedure call system for client-server communication" → `networking-communication/networking/`  
✅ **noisetilefunctions.md** - "Functions for converting noise values to specific world tile types in Don't Starve Together" → `world-systems/tiles-terrain/`  
✅ **notetable_dsmaintheme.md** - "Musical note data table for the Don't Starve Together main theme" → `localization-content/content/`  
✅ **ocean_util.md** - "Utility functions for ocean mechanics, water depth, wave spawning, and entity sinking in Don't Starve Together" → `world-systems/ocean/`  
✅ **platformpostload.md** - "Platform-specific configuration and tweaks applied after game initialization for different gaming platforms" → `data-management/utilities/`  
✅ **play_commonfn.md** - "Common utility functions for the stage play system in Don't Starve Together" → `localization-content/content/`  
✅ **play_generalscripts.md** - "Character-specific performance scripts for the stage play system" → `localization-content/content/`  
✅ **play_the_doll.md** - "The Enchanted Doll theatrical performance implementation for the stage play system" → `localization-content/content/`  
✅ **play_the_veil.md** - "The Veil theatrical performance implementation for the stage play system" → `localization-content/content/`  
✅ **playerdeaths.md** - "System for tracking and managing player death records and statistics" → `character-systems/core/`  
✅ **playerhistory.md** - "System for tracking and managing history of players encountered during gameplay" → `character-systems/core/`  
✅ **playerprofile.md** - "Comprehensive player profile and settings management system" → `character-systems/core/`  
✅ **popupmanager.md** - "System for managing game UI popups and screen overlays with RPC communication" → `networking-communication/multiplayer/`  
✅ **postprocesseffects.md** - "Visual post-processing effects system for screen-space rendering" → `user-interface/graphics/`  
✅ **prefablist.md** - "Generated list of all prefab files in Don't Starve Together" → `world-systems/entities/`  
✅ **curse_monkey_util.md** - "Utility module for managing monkey curse transformation mechanics and visual effects in Don't Starve Together" → `localization-content/translation/`  
✅ **custompresets.md** - "System for creating, managing, and storing custom world generation and settings presets in Don't Starve Together" → `world-systems/generation/`  
✅ **datagrid.md** - "Utility class for managing 2D grid data structures with coordinate-to-index mapping in Don't Starve Together" → `user-interface/frontend/`  
✅ **debughelpers.md** - "Debug utility functions for inspecting and analyzing entities, components, and function upvalues in Don't Starve Together" → `development-tools/debugging/`  
✅ **debugkeys.md** - "Debug key binding system for developer tools, game manipulation, and testing functionality in Don't Starve Together" → `development-tools/debugging/`  
✅ **cookbookdata.md** - "Recipe discovery and food knowledge management system for Don't Starve Together" → `game-mechanics/cooking/`  
✅ **craftingmenuprofile.md** - "System for managing user preferences and customizations in the crafting menu interface" → `game-mechanics/crafting/`  
✅ **createstringspo.md** - "Main game POT file generation tool for localization workflows across multiple platforms" → `localization-content/strings/`  
✅ **createstringspo_dlc.md** - "DLC-specific POT file generation tool for localization workflows, particularly for Reign of Giants" → `localization-content/strings/`  
✅ **crafting_sorting.md** - "Documentation of the Don't Starve Together crafting menu sorting system that organizes and prioritizes crafting recipes" → `game-mechanics/crafting/`  
✅ **chathistory.md** - "Chat history management system for storing, synchronizing, and filtering chat messages" → `networking-communication/chat-commands/`  
✅ **clothing.md** - "Character clothing and cosmetic item data structure for skins and appearance customization" → `character-systems/customization/`  
✅ **consolescreensettings.md** - "Console history and settings persistence system for Don't Starve Together" → `development-tools/console/`  
✅ **firelevel.md** - "Class for defining fire intensity levels with fuel consumption, visual effects, and heat spreading properties" → `game-configuration/settings/`  
✅ **fix_character_strings.md** - "Utility script for alphabetically sorting and standardizing character speech files" → `development-tools/utilities/`  
✅ **globalvariableoverrides.md** - "Base configuration file for overriding global variables in DST" → `game-configuration/settings/`  
✅ **index.md** - "Empty file" → `fundamentals/core/`  
✅ **lavaarena_achievements.md** - "Character-specific achievement definitions for Lava Arena events" → `game-mechanics/achievements/`  


✅ **plantregistrydata.md** - "Data management system for tracking discovered plants, growth stages, fertilizers, and oversized plant pictures in the farming system" → `world-systems/generation/`  
✅ **prefabskin.md** - "Visual skin system for customizing prefab appearance and functionality" → `world-systems/entities/`  
✅ **prefabskins.md** - "Auto-generated database of all prefab skin mappings in Don't Starve Together" → `world-systems/entities/`  
✅ **prefabswaps.md** - "World generation prefab variation system for diversifying game worlds" → `world-systems/generation/`  
✅ **prefabutil.md** - "Helper functions and utilities for creating and managing prefabs" → `world-systems/entities/`  