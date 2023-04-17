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
}
