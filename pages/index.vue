<script setup lang="ts">
import type { Room } from "~/types/RoomTypes";

const isJoinRoomOpen = ref(false);

const roomNumberToJoin = ref("");

const handleJoinRoomClick = async () => {
    isJoinRoomOpen.value = true;
};

const handleSubmitRoomNumberClick = async () => {
    navigateTo(`/room/${roomNumberToJoin.value}`);
};

const handleNewRoomClick = async () => {
    const data = await useApiFetch<Room>("/room", {
        method: "POST",
    });
    navigateTo(`/room/${data.id}`);
};

defineShortcuts({
    enter: {
        usingInput: true,
        whenever: [isJoinRoomOpen, () => roomNumberToJoin.value.length > 0],
        handler: () => {
            console.log("OkOk");
        },
    },
});
</script>

<template>
    <div class="text-5xl text-center text-green-500">AGENCI</div>
    <UButton class="justify-self-center self-center" @click="handleNewRoomClick"
        >Stwórz pokój</UButton
    >
    <UDivider />
    <UButton
        class="hover:text-red-100 hover:bg-red-500"
        @click="handleJoinRoomClick"
        >Dołącz do pokoju</UButton
    >
    <UModal v-model="isJoinRoomOpen">
        <div class="p-4">
            <UInput v-model="roomNumberToJoin" placeholder="Kod pokoju" />
            <UButton
                v-if="roomNumberToJoin.length != 0"
                @click="handleSubmitRoomNumberClick"
                class="mt-4"
                >Dołącz</UButton
            >
        </div>
    </UModal>
</template>

<style scoped></style>
