
// this file is generated — do not edit it


/// <reference types="@sveltejs/kit" />

/**
 * Environment variables [loaded by Vite](https://vitejs.dev/guide/env-and-mode.html#env-files) from `.env` files and `process.env`. Like [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), this module cannot be imported into client-side code. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * _Unlike_ [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), the values exported from this module are statically injected into your bundle at build time, enabling optimisations like dead code elimination.
 * 
 * ```ts
 * import { API_KEY } from '$env/static/private';
 * ```
 * 
 * Note that all environment variables referenced in your code should be declared (for example in an `.env` file), even if they don't have a value until the app is deployed:
 * 
 * ```
 * MY_FEATURE_FLAG=""
 * ```
 * 
 * You can override `.env` values from the command line like so:
 * 
 * ```bash
 * MY_FEATURE_FLAG="enabled" npm run dev
 * ```
 */
declare module '$env/static/private' {
	export const SHELL: string;
	export const LSCOLORS: string;
	export const npm_command: string;
	export const SESSION_MANAGER: string;
	export const COLORTERM: string;
	export const XDG_CONFIG_DIRS: string;
	export const npm_package_devDependencies__types_node: string;
	export const LESS: string;
	export const XDG_SESSION_PATH: string;
	export const NVM_INC: string;
	export const XDG_MENU_PREFIX: string;
	export const npm_package_repository_url: string;
	export const TERM_PROGRAM_VERSION: string;
	export const npm_package_devDependencies_eslint_plugin_svelte: string;
	export const GNOME_KEYRING_CONTROL: string;
	export const NODE: string;
	export const npm_package_devDependencies_tslib: string;
	export const LC_ADDRESS: string;
	export const npm_package_scripts_check_watch: string;
	export const LC_NAME: string;
	export const SSH_AUTH_SOCK: string;
	export const npm_package_private: string;
	export const WEZTERM_EXECUTABLE: string;
	export const npm_package_publishConfig_access: string;
	export const DESKTOP_SESSION: string;
	export const LC_MONETARY: string;
	export const npm_package_scripts_clean_dist: string;
	export const npm_package_exports___import: string;
	export const EDITOR: string;
	export const GTK_MODULES: string;
	export const XDG_SEAT: string;
	export const PWD: string;
	export const npm_package_devDependencies_vite: string;
	export const XDG_SESSION_DESKTOP: string;
	export const LOGNAME: string;
	export const QT_QPA_PLATFORMTHEME: string;
	export const XDG_SESSION_TYPE: string;
	export const PANEL_GDK_CORE_DEVICE_EVENTS: string;
	export const npm_package_scripts_clean_page: string;
	export const npm_package_devDependencies__typescript_eslint_parser: string;
	export const PNPM_HOME: string;
	export const npm_package_scripts_build: string;
	export const XAUTHORITY: string;
	export const npm_package_devDependencies_prettier: string;
	export const npm_package_devDependencies_eslint_config_prettier: string;
	export const npm_package_scripts_publish: string;
	export const npm_package_devDependencies__swc_core: string;
	export const npm_package_bugs_url: string;
	export const QT_STYLE_OVERRIDE: string;
	export const MOTD_SHOWN: string;
	export const HOME: string;
	export const LC_PAPER: string;
	export const LANG: string;
	export const WEZTERM_UNIX_SOCKET: string;
	export const npm_package_devDependencies_typescript: string;
	export const LS_COLORS: string;
	export const XDG_CURRENT_DESKTOP: string;
	export const npm_package_version: string;
	export const _ZSH_TMUX_FIXED_CONFIG: string;
	export const npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
	export const npm_package_files_0: string;
	export const npm_package_files_1: string;
	export const npm_package_files_2: string;
	export const npm_package_files_3: string;
	export const npm_package_repository_type: string;
	export const npm_package_files_4: string;
	export const XDG_SEAT_PATH: string;
	export const npm_package_scripts_build_component: string;
	export const npm_package_scripts_release_pre: string;
	export const INIT_CWD: string;
	export const npm_package_scripts_format: string;
	export const npm_package_scripts_preview: string;
	export const PSQL_PAGER: string;
	export const npm_lifecycle_script: string;
	export const NVM_DIR: string;
	export const npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
	export const npm_package_devDependencies_svelte_check: string;
	export const XDG_SESSION_CLASS: string;
	export const TERM: string;
	export const LC_IDENTIFICATION: string;
	export const npm_package_name: string;
	export const ZSH: string;
	export const npm_package_type: string;
	export const USER: string;
	export const npm_config_frozen_lockfile: string;
	export const npm_package_exports___types: string;
	export const npm_package_homepage: string;
	export const npm_package_scripts_build_page: string;
	export const DISPLAY: string;
	export const npm_lifecycle_event: string;
	export const SHLVL: string;
	export const NVM_CD_FLAGS: string;
	export const npm_package_scripts_release: string;
	export const CHROME_EXECUTABLE: string;
	export const PAGER: string;
	export const npm_package_devDependencies_eslint: string;
	export const npm_package_devDependencies_ts_node: string;
	export const LC_TELEPHONE: string;
	export const LC_MEASUREMENT: string;
	export const XDG_VTNR: string;
	export const XDG_SESSION_ID: string;
	export const npm_package_scripts_clean: string;
	export const npm_config_user_agent: string;
	export const npm_package_scripts_lint: string;
	export const DIRHISTORY_SIZE: string;
	export const PNPM_SCRIPT_SRC_DIR: string;
	export const npm_execpath: string;
	export const LD_LIBRARY_PATH: string;
	export const npm_package_devDependencies__sveltejs_adapter_auto: string;
	export const npm_package_devDependencies_svelte: string;
	export const npm_package_scripts_test: string;
	export const XDG_RUNTIME_DIR: string;
	export const ZSH_TMUX_TERM: string;
	export const NODE_PATH: string;
	export const DEBUGINFOD_URLS: string;
	export const npm_package_devDependencies__sveltejs_package: string;
	export const LC_TIME: string;
	export const npm_package_keywords_4: string;
	export const npm_package_scripts_dev: string;
	export const npm_package_keywords_1: string;
	export const npm_package_keywords_0: string;
	export const npm_package_keywords_3: string;
	export const npm_package_keywords_2: string;
	export const npm_package_devDependencies_elegua: string;
	export const npm_package_devDependencies__types_sloc: string;
	export const GTK3_MODULES: string;
	export const XDG_DATA_DIRS: string;
	export const npm_package_scripts_check: string;
	export const BROWSER: string;
	export const PATH: string;
	export const npm_config_node_gyp: string;
	export const npm_package_devDependencies__sveltejs_kit: string;
	export const DBUS_SESSION_BUS_ADDRESS: string;
	export const NVM_BIN: string;
	export const MAIL: string;
	export const npm_config_registry: string;
	export const npm_node_execpath: string;
	export const npm_config_engine_strict: string;
	export const npm_package_devDependencies_sloc: string;
	export const LC_NUMERIC: string;
	export const WEZTERM_PANE: string;
	export const OLDPWD: string;
	export const TERM_PROGRAM: string;
	export const WEZTERM_EXECUTABLE_DIR: string;
	export const NODE_ENV: string;
}

/**
 * Similar to [`$env/static/private`](https://kit.svelte.dev/docs/modules#$env-static-private), except that it only includes environment variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Values are replaced statically at build time.
 * 
 * ```ts
 * import { PUBLIC_BASE_URL } from '$env/static/public';
 * ```
 */
declare module '$env/static/public' {
	
}

/**
 * This module provides access to runtime environment variables, as defined by the platform you're running on. For example if you're using [`adapter-node`](https://github.com/sveltejs/kit/tree/main/packages/adapter-node) (or running [`vite preview`](https://kit.svelte.dev/docs/cli)), this is equivalent to `process.env`. This module only includes variables that _do not_ begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) _and do_ start with [`config.kit.env.privatePrefix`](https://kit.svelte.dev/docs/configuration#env) (if configured).
 * 
 * This module cannot be imported into client-side code.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/private';
 * console.log(env.DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 * 
 * > In `dev`, `$env/dynamic` always includes environment variables from `.env`. In `prod`, this behavior will depend on your adapter.
 */
declare module '$env/dynamic/private' {
	export const env: {
		SHELL: string;
		LSCOLORS: string;
		npm_command: string;
		SESSION_MANAGER: string;
		COLORTERM: string;
		XDG_CONFIG_DIRS: string;
		npm_package_devDependencies__types_node: string;
		LESS: string;
		XDG_SESSION_PATH: string;
		NVM_INC: string;
		XDG_MENU_PREFIX: string;
		npm_package_repository_url: string;
		TERM_PROGRAM_VERSION: string;
		npm_package_devDependencies_eslint_plugin_svelte: string;
		GNOME_KEYRING_CONTROL: string;
		NODE: string;
		npm_package_devDependencies_tslib: string;
		LC_ADDRESS: string;
		npm_package_scripts_check_watch: string;
		LC_NAME: string;
		SSH_AUTH_SOCK: string;
		npm_package_private: string;
		WEZTERM_EXECUTABLE: string;
		npm_package_publishConfig_access: string;
		DESKTOP_SESSION: string;
		LC_MONETARY: string;
		npm_package_scripts_clean_dist: string;
		npm_package_exports___import: string;
		EDITOR: string;
		GTK_MODULES: string;
		XDG_SEAT: string;
		PWD: string;
		npm_package_devDependencies_vite: string;
		XDG_SESSION_DESKTOP: string;
		LOGNAME: string;
		QT_QPA_PLATFORMTHEME: string;
		XDG_SESSION_TYPE: string;
		PANEL_GDK_CORE_DEVICE_EVENTS: string;
		npm_package_scripts_clean_page: string;
		npm_package_devDependencies__typescript_eslint_parser: string;
		PNPM_HOME: string;
		npm_package_scripts_build: string;
		XAUTHORITY: string;
		npm_package_devDependencies_prettier: string;
		npm_package_devDependencies_eslint_config_prettier: string;
		npm_package_scripts_publish: string;
		npm_package_devDependencies__swc_core: string;
		npm_package_bugs_url: string;
		QT_STYLE_OVERRIDE: string;
		MOTD_SHOWN: string;
		HOME: string;
		LC_PAPER: string;
		LANG: string;
		WEZTERM_UNIX_SOCKET: string;
		npm_package_devDependencies_typescript: string;
		LS_COLORS: string;
		XDG_CURRENT_DESKTOP: string;
		npm_package_version: string;
		_ZSH_TMUX_FIXED_CONFIG: string;
		npm_package_devDependencies__typescript_eslint_eslint_plugin: string;
		npm_package_files_0: string;
		npm_package_files_1: string;
		npm_package_files_2: string;
		npm_package_files_3: string;
		npm_package_repository_type: string;
		npm_package_files_4: string;
		XDG_SEAT_PATH: string;
		npm_package_scripts_build_component: string;
		npm_package_scripts_release_pre: string;
		INIT_CWD: string;
		npm_package_scripts_format: string;
		npm_package_scripts_preview: string;
		PSQL_PAGER: string;
		npm_lifecycle_script: string;
		NVM_DIR: string;
		npm_package_devDependencies__sveltejs_vite_plugin_svelte: string;
		npm_package_devDependencies_svelte_check: string;
		XDG_SESSION_CLASS: string;
		TERM: string;
		LC_IDENTIFICATION: string;
		npm_package_name: string;
		ZSH: string;
		npm_package_type: string;
		USER: string;
		npm_config_frozen_lockfile: string;
		npm_package_exports___types: string;
		npm_package_homepage: string;
		npm_package_scripts_build_page: string;
		DISPLAY: string;
		npm_lifecycle_event: string;
		SHLVL: string;
		NVM_CD_FLAGS: string;
		npm_package_scripts_release: string;
		CHROME_EXECUTABLE: string;
		PAGER: string;
		npm_package_devDependencies_eslint: string;
		npm_package_devDependencies_ts_node: string;
		LC_TELEPHONE: string;
		LC_MEASUREMENT: string;
		XDG_VTNR: string;
		XDG_SESSION_ID: string;
		npm_package_scripts_clean: string;
		npm_config_user_agent: string;
		npm_package_scripts_lint: string;
		DIRHISTORY_SIZE: string;
		PNPM_SCRIPT_SRC_DIR: string;
		npm_execpath: string;
		LD_LIBRARY_PATH: string;
		npm_package_devDependencies__sveltejs_adapter_auto: string;
		npm_package_devDependencies_svelte: string;
		npm_package_scripts_test: string;
		XDG_RUNTIME_DIR: string;
		ZSH_TMUX_TERM: string;
		NODE_PATH: string;
		DEBUGINFOD_URLS: string;
		npm_package_devDependencies__sveltejs_package: string;
		LC_TIME: string;
		npm_package_keywords_4: string;
		npm_package_scripts_dev: string;
		npm_package_keywords_1: string;
		npm_package_keywords_0: string;
		npm_package_keywords_3: string;
		npm_package_keywords_2: string;
		npm_package_devDependencies_elegua: string;
		npm_package_devDependencies__types_sloc: string;
		GTK3_MODULES: string;
		XDG_DATA_DIRS: string;
		npm_package_scripts_check: string;
		BROWSER: string;
		PATH: string;
		npm_config_node_gyp: string;
		npm_package_devDependencies__sveltejs_kit: string;
		DBUS_SESSION_BUS_ADDRESS: string;
		NVM_BIN: string;
		MAIL: string;
		npm_config_registry: string;
		npm_node_execpath: string;
		npm_config_engine_strict: string;
		npm_package_devDependencies_sloc: string;
		LC_NUMERIC: string;
		WEZTERM_PANE: string;
		OLDPWD: string;
		TERM_PROGRAM: string;
		WEZTERM_EXECUTABLE_DIR: string;
		NODE_ENV: string;
		[key: `PUBLIC_${string}`]: undefined;
		[key: `${string}`]: string | undefined;
	}
}

/**
 * Similar to [`$env/dynamic/private`](https://kit.svelte.dev/docs/modules#$env-dynamic-private), but only includes variables that begin with [`config.kit.env.publicPrefix`](https://kit.svelte.dev/docs/configuration#env) (which defaults to `PUBLIC_`), and can therefore safely be exposed to client-side code.
 * 
 * Note that public dynamic environment variables must all be sent from the server to the client, causing larger network requests — when possible, use `$env/static/public` instead.
 * 
 * Dynamic environment variables cannot be used during prerendering.
 * 
 * ```ts
 * import { env } from '$env/dynamic/public';
 * console.log(env.PUBLIC_DEPLOYMENT_SPECIFIC_VARIABLE);
 * ```
 */
declare module '$env/dynamic/public' {
	export const env: {
		[key: `PUBLIC_${string}`]: string | undefined;
	}
}
