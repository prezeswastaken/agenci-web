import type { GameStage } from "./GameStageTypes";
import type { Team } from "./TeamTypes";

export type Room = {
	id: number;
	game_stage: GameStage;
	current_team: Team;
	created_at: string;
};
