import "obsidian";
import { DataviewApi } from "obsidian-dataview";

declare module "obsidian" {
	interface App {
		plugins: {
			enabledPlugins: Set<string>;
			plugins: {
				[id: string]: any;
				dataview?: {
					api?: DataviewApi;
				};
			};
		};
	}

	interface Workspace {
		/** Sent to rendered dataview components to tell them to possibly refresh */
		on(name: "dataview:refresh-views", callback: () => void, ctx?: any): EventRef;
	}
}
