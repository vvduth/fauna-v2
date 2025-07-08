import { Server } from "socket.io";
import {
  GameRoom,
  SessionPlayer,
  Player,
  GameState,
} from "../types/gameSession";
import { SOCKET_EVENT } from "../constants/event";

// Player colors for up to 6 players (Fauna game limit)
const PLAYER_COLORS = [
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#10b981", // Green
  "#f59e0b", // Yellow
  "#8b5cf6", // Purple
  "#ec4899", // Pink
];
class GameRoomManager {
  private rooms = new Map<string, GameRoom>();

  // Generate simple 6-character room codes
  generateRoomCode(): string {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let roomCode = "";
    for (let i = 0; i < 6; i++) {
      roomCode += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }

    // Ensure room code is unique
    if (this.rooms.has(roomCode)) {
      return this.generateRoomCode(); // Recursive call if duplicate
    }

    return roomCode;
  }

  // Generate unique session ID for players
  generateSessionId(): string {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create new game room
  createRoom(hostName: string): { roomCode: string; sessionId: string } {
    const roomCode = this.generateRoomCode();
    const sessionId = this.generateSessionId();

    // Create host session player
    const hostPlayer: SessionPlayer = {
      sessionId,
      displayName: hostName,
      color: PLAYER_COLORS[0], // Host gets first color (red)
      isHost: true,
      isConnected: true,
      joinedAt: new Date(),
    };

    // Create game room
    const room: GameRoom = {
      roomCode,
      players: [hostPlayer],
      gameState: null, // Will be initialized when game starts
      hostPlayerId: sessionId,
      createdAt: new Date(),
      lastActivity: new Date(),
      maxPlayers: 6, // Fauna game supports up to 6 players
      gameStarted: false,
    };

    // Store room
    this.rooms.set(roomCode, room);
    console.log(`Created room ${roomCode} with host ${hostName}`);

    return { roomCode, sessionId };
  }

  // Join existing room
  joinRoom(
    roomCode: string,
    playerName: string
  ): {
    success: boolean;
    sessionId?: string;
    error?: string;
  } {
    const room = this.rooms.get(roomCode);
    if (!room) {
      return { success: false, error: "Room not found" };
    }

    // Check if room is full
    if (room.players.length >= room.maxPlayers) {
      return { success: false, error: "Room is full" };
    }

    if (room.gameStarted) {
      return { success: false, error: "Game has already started" };
    }

    // chekc if player name already taken in this room
    const nameExist = room.players.some((p) => p.displayName === playerName);
    if (nameExist) {
      return {
        success: false,
        error: "Player name already taken in this room",
      };
    }

    const sessionId = this.generateSessionId();
    const playerColor = PLAYER_COLORS[room.players.length];

    const newPlayer: SessionPlayer = {
      sessionId,
      displayName: playerName,
      color: playerColor,
      isHost: false,
      isConnected: true,
      joinedAt: new Date(),
    };

    room.players.push(newPlayer);
    room.lastActivity = new Date();
    console.log(`Player ${playerName} joined room ${roomCode} with session ID`);

    return {
      success: true,
      sessionId,
    };
  }

  getRoom(roomCode: string): GameRoom | undefined {
    return this.rooms.get(roomCode);
  }

  updatePlayerConnection(
    roomCode: string,
    sessionId: string,
    isConnected: boolean
  ): boolean {
    const room = this.rooms.get(roomCode);
    if (!room) return false;

    const player = room.players.find((p) => p.sessionId === sessionId);
    if (!player) return false;

    player.isConnected = isConnected;
    room.lastActivity = new Date();
    console.log(
      `Player ${player.displayName} connection status updated to ${isConnected} in room ${roomCode}`
    );

    return true;
  }

  // Remove player from room
  removePlayer(roomCode: string, sessionId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room) return false;

    const playerIndex = room.players.findIndex(
      (p) => p.sessionId === sessionId
    );
    if (playerIndex === -1) return false;

    const removedPlayer = room.players[playerIndex];
    room.players.splice(playerIndex, 1);

    // if host left , assign new host if there are players left
    if (removedPlayer.isHost && room.players.length > 0) {
      room.players[0].isHost = true; // First player becomes new host
      room.hostPlayerId = room.players[0].sessionId;
      console.log(
        `Player ${removedPlayer.displayName} left room ${roomCode}. New host is ${room.players[0].displayName}`
      );
    }

    // remove room if no players left
    if (room.players.length === 0) {
      this.rooms.delete(roomCode);
      console.log(`Room ${roomCode} deleted as no players left`);
    }

    return true;
  }

  cleanupInactiveRooms(): void {
    const now = new Date();
    const maxInactiveTime = 30 * 60 * 1000; // 30 minutes

    for (const [roomCode, room] of this.rooms.entries()) {
      const timeSinceActivity = now.getTime() - room.lastActivity.getTime();

      if (timeSinceActivity > maxInactiveTime) {
        this.rooms.delete(roomCode);
        console.log(`Cleaned up inactive room ${roomCode}`);
      }
    }
  }
}

const roomManager = new GameRoomManager();

export const setupGameSocket = (io: Server) => {
  console.log("Setting up game socket...");

  setInterval(() => {
    roomManager.cleanupInactiveRooms();
    console.log("Cleaned up inactive rooms");
  }, 5 * 60 * 1000);
  io.on("connection", (socket) => {
    console.log(`New socket connection: ${socket.id}`);

    let currentRoomCode: string | null = null;
    let currentSessionId: string | null = null;

    // handle room creation
    socket.on(SOCKET_EVENT.ROOM_CREATE, (data: {hostName: string}, callback) => {
      try {
        const { roomCode, sessionId } = roomManager.createRoom(data.hostName);

        // join the socket romm
        socket.join(roomCode);
        currentRoomCode = roomCode;
        currentSessionId = sessionId;

        const room = roomManager.getRoom(roomCode);

        // callback for room creation
        callback({
          success: true,
          roomCode,
          sessionId,
          players: room?.players || [],
        })

        console.info(`Room created: ${roomCode} by ${data.hostName}`);
      } catch (error) {
        console.error("Error creating room:", error);
        callback({
          success: false,
          error: "Failed to create room",
        });
      }
    })

    // handle joining existing room
    socket.on(SOCKET_EVENT.ROOM_JOIN, (data: {roomCode: string, playerName: string}, callback) => {
      try {
        const result = roomManager.joinRoom(data.roomCode, data.playerName);
        if (result.success && result.sessionId) {
          // join the socket room
          socket.join(data.roomCode);
          currentRoomCode = data.roomCode;
          currentSessionId = result.sessionId;

          // get updated room data
          const room = roomManager.getRoom(data.roomCode);

          // notify all players in the room
          socket.to(data.roomCode).emit(SOCKET_EVENT.PLAYER_JOINED, {
            players: room?.players.find(p => p.sessionId === result.sessionId), 
            roomState: room
          })

          // callback for successful join
          callback({
            success: true,
            sessionId: result.sessionId,
            room: room
          });

          console.info(`Player ${data.playerName} joined room ${data.roomCode}`);
        } else {
          callback(result)
        }
      } catch (error) {
        console.error("Error joining room:", error);
        callback({
          success: false,
          error: "Failed to join room",
        });
      }
    })

    // handle game state updates
    socket.on(SOCKET_EVENT.GAME_ACTION, (data: {
      roomCode: string;
      sessionId: string;
      action: string;
      payload: any;
    }) => {
      try {
        const room = roomManager.getRoom(data.roomCode);
        if (!room) {return }

        // verify player is in room
        const player = room.players.find(p => p.sessionId === data.sessionId);
        if (!player) {return }

        // braostcast action to all players in the room
        io.to(data.roomCode).emit(SOCKET_EVENT.GAME_ACTION,{
          playerId: data.sessionId,
          playerName: player.displayName,
          action: data.action,
          payload: data.payload,
          timestamp: new Date()
        })

        room.lastActivity = new Date();

        console.info(`Game action "${data.action}" from player ${player.displayName} in room ${data.roomCode}`);
      } catch (error) {
        console.error("Error handling game action:", error);
      }
    })

    // handle player disconnection
    socket.on("disconnect", () => {
      console.log(`Socket disconnected: ${socket.id}`);

      if (currentRoomCode && currentSessionId) {
        // update player connection status
        roomManager.updatePlayerConnection(currentRoomCode, currentSessionId, false);

        // notify other players in the room
        socket.to(currentRoomCode).emit(SOCKET_EVENT.PLAYER_DISCONNECTED,{
          sessionId: currentSessionId
        })
      }
    })

    socket.on(SOCKET_EVENT.ROOM_LEAVE, () => {
      if (currentRoomCode && currentSessionId) {
        const room = roomManager.getRoom(currentRoomCode);
        const player = room?.players.find(p => p.sessionId === currentSessionId);

        roomManager.removePlayer(currentRoomCode, currentSessionId)
        socket.leave(currentRoomCode);

        socket.to(currentRoomCode).emit(SOCKET_EVENT.PLAYER_LEFT, {
          sessionId: currentSessionId,
          playerName: player?.displayName || "Unknown"
        })
        currentRoomCode = null;
        currentSessionId = null;
      }
    })
  })
};
