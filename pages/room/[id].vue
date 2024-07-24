<script setup lang="ts">
import type { Player } from "~/types/PlayerTypes";

import { io } from "socket.io-client";
import type { Field } from "~/types/FieldTypes";
import type { Room } from "~/types/RoomTypes";
import { Role } from "~/types/RoleTypes";

const socket = io("ws://127.0.0.1:8000");

const route = useRoute();
const id = ref(route.params.id);
const playerId = localStorage.getItem("player_id");
const room = ref(await useApiFetch<Room>(`/room/${id.value}`));
console.log(room.value);

const isPlayerInRoom = ref(false);
const hasPlayerJoined = ref(false);

const playersInRoom = ref<Player[]>([]);

const fields = ref<Field[] | null>(null);

if (playerId !== null) {
    isPlayerInRoom.value = await useApiFetch<boolean>(
        `/is-player-in-room/${id.value}/${playerId}`,
    );
    console.log(isPlayerInRoom.value);
} else {
    isPlayerInRoom.value = false;
}

const username = ref("");
const creatingPlayer = ref(!isPlayerInRoom.value);

const player = ref<Player | null>(null);

defineShortcuts({
    enter: {
        usingInput: true,
        whenever: [creatingPlayer, () => username.value.length >= 3],
        handler: () => {
            handleCreatePlayerClick();
        },
    },
});

const handleCreatePlayerClick = async () => {
    try {
        player.value = await useApiFetch<Player>(
            `/player/${username.value}/room/${id.value}`,
            {
                method: "POST",
            },
        );
        localStorage.setItem("player_id", player.value.id.toString());
        creatingPlayer.value = false;
        console.log(player.value);
        console.log("We would send join room request");
        sendJoinRoomRequest();
    } catch (error) {
        console.error(error);
    }
};

if (isPlayerInRoom.value) {
    player.value = await useApiFetch<Player>(`/player/${playerId}`);

    if (player.value.room_id != Number(id.value)) {
        throw new Error("Player is in different room");
    }

    console.log("We would send join room request");
    sendJoinRoomRequest();
}

async function fetchFieldsForTheRoom() {
    fields.value = await useApiFetch<Field[]>(`/room/${id.value}/fields`);
    // sort fields by id
    fields.value.sort((a, b) => a.id - b.id);
}

async function sendJoinRoomRequest() {
    if (player.value === null) {
        throw new Error("Player is not defined");
    }
    socket.emit("join-room", {
        player_id: player.value.id,
        room_id: player.value.room_id,
        username: player.value.username,
    });
    hasPlayerJoined.value = true;
    playersInRoom.value = await getPlayersForTheRoom();
    await fetchFieldsForTheRoom();
    console.log("Fields:", fields.value);
}

const toast = useToast();

socket.on("player-joined", async (message) => {
    try {
        console.log(message);
        toast.add({
            title: "Gracz dołączył",
            description: message,
        });
        playersInRoom.value = await getPlayersForTheRoom();
    } catch (error) {
        console.error(error);
    }
});

async function getPlayersForTheRoom() {
    const players = await useApiFetch<Player[]>(
        `/room/${player.value?.room_id}/players`,
    );
    return players;
}

async function fetchCurrentRoom() {
    room.value = await useApiFetch<Room>(`/room/${id.value}`);
}

socket.on("room-updated", async () => {
    await fetchCurrentRoom();
    playersInRoom.value = await getPlayersForTheRoom();
});

socket.on("field-updated", async () => {
    await fetchFieldsForTheRoom();
});
</script>

<template>
    <UModal v-model="creatingPlayer" prevent-close class="p-10">
        <UCard>
            <UInput placeholder="Wybierz swój nick" v-model="username" />
            <UButton
                @click="handleCreatePlayerClick"
                v-if="username.length >= 3"
                class="mt-4"
                >Zatwierdź</UButton
            >
        </UCard>
    </UModal>

    <div class="flex justify-between py-3 px-5 w-full">
        <div>Room {{ id }}</div>
        <div class="flex flex-col gap-5">
            <UCard>
                <div v-if="player">Hello {{ player.username }}</div>
                <div v-if="fields" class="grid grid-cols-5 gap-3">
                    <FieldCard
                        @field-updated="fetchFieldsForTheRoom"
                        v-for="field in fields"
                        :key="field.id"
                        :field="field"
                        :show-team="player?.role === Role.Shower"
                        :socket="socket"
                        :player="player"
                    />
                </div>
            </UCard>
        </div>
        <UCard v-if="playersInRoom.length > 0">
            <div v-for="player in playersInRoom" :key="player.id">
                {{ player.username }}
                <UDivider />
            </div>
        </UCard>
    </div>
</template>

<style scoped></style>
