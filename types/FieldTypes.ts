import type { Team } from "./TeamTypes";

export type Field = {
	id: number;
	room_id: number;
	team: Team;
	text: string;
	is_used: boolean;
	created_at: string;
};
