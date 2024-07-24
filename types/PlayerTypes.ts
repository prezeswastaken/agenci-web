import type { Role } from "./RoleTypes";
import type { Team } from "./TeamTypes";

export type Player = {
	id: number;
	room_id: number;
	username: string;
	team: Team;
	role: Role;
	created_at: string;
};
