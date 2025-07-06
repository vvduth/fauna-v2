import { Server } from "socket.io";
import { GameRoom, SessionPlayer, Player, GameState } from "../types/gameSession";

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

  // Convert SessionPlayer to Player for game state
  sessionPlayerToPlayer(sessionPlayer: SessionPlayer): Player {
    return {
      id: sessionPlayer.sessionId,
      name: sessionPlayer.displayName,
      color: sessionPlayer.color,
      score: 0, // Start with 0 score
      guessPieces: 7, // Start with 7 guess pieces (standard Fauna rules)
      stockPieces: 0, // Start with 0 stock pieces
    };
  }

  // Initialize game state for a room
  initializeGameState(roomCode: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room || room.gameStarted) return false;

    // Convert session players to game players
    const gamePlayers: Player[] = room.players.map((sessionPlayer) => 
      this.sessionPlayerToPlayer(sessionPlayer)
    );

    // Create initial game state
    const gameState: GameState = {
      players: gamePlayers,
      currentPlayer: 0, // Start with first player
      startingPlayer: 0,
      currentAnimal: null,
      phase: "placement",
      round: 1,
      placements: [],
      showCardLowerHalf: false,
      gameEnded: false,
      winner: undefined,
      claimedRegions: [], // Initialize empty claimed regions
    };

    room.gameState = gameState;
    room.gameStarted = true;
    room.lastActivity = new Date();

    console.log(`Initialized game state for room ${roomCode}`);
    return true;
  }

  // Get room by code
  getRoom(roomCode: string): GameRoom | undefined {
    return this.rooms.get(roomCode);
  }

  // Join existing room
  joinRoom(roomCode: string, playerName: string): { 
    success: boolean; 
    sessionId?: string; 
    error?: string; 
  } {
    const room = this.rooms.get(roomCode);
    
    if (!room) {
      return { success: false, error: 'Room not found' };
    }
    
    if (room.players.length >= room.maxPlayers) {
      return { success: false, error: 'Room is full (max 6 players)' };
    }
    
    if (room.gameStarted) {
      return { success: false, error: 'Game already in progress' };
    }
    
    // Check if player name is already taken in this room
    const nameExists = room.players.some(p => p.displayName === playerName);
    if (nameExists) {
      return { success: false, error: 'Player name already taken in this room' };
    }
    
    const sessionId = this.generateSessionId();
    const playerColor = PLAYER_COLORS[room.players.length]; // Assign next available color
    
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
    
    console.log(`Player ${playerName} joined room ${roomCode}`);
    
    return { success: true, sessionId };
  }

  // Update player connection status
  updatePlayerConnection(roomCode: string, sessionId: string, isConnected: boolean): boolean {
    const room = this.rooms.get(roomCode);
    if (!room) return false;
    
    const player = room.players.find(p => p.sessionId === sessionId);
    if (!player) return false;
    
    player.isConnected = isConnected;
    room.lastActivity = new Date();
    
    return true;
  }

  // Remove player from room
  removePlayer(roomCode: string, sessionId: string): boolean {
    const room = this.rooms.get(roomCode);
    if (!room) return false;
    
    const playerIndex = room.players.findIndex(p => p.sessionId === sessionId);
    if (playerIndex === -1) return false;
    
    const removedPlayer = room.players[playerIndex];
    room.players.splice(playerIndex, 1);
    
    // If host left, assign new host
    if (removedPlayer.isHost && room.players.length > 0) {
      room.players[0].isHost = true;
      room.hostPlayerId = room.players[0].sessionId;
    }
    
    // Remove room if empty
    if (room.players.length === 0) {
      this.rooms.delete(roomCode);
      console.log(`Removed empty room ${roomCode}`);
    }
    
    return true;
  }

  // Cleanup inactive rooms (call this periodically)
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

// Initialize room manager
const roomManager = new GameRoomManager();

// Setup Socket.IO handlers
export const setupGameSocket = (io: Server) => {
  console.log('Setting up game socket handlers');
  
  // Cleanup inactive rooms every 5 minutes
  setInterval(() => {
    roomManager.cleanupInactiveRooms();
  }, 5 * 60 * 1000);
  
  io.on('connection', (socket) => {
    console.log(`Client connected: ${socket.id}`);
    
    let currentRoomCode: string | null = null;
    let currentSessionId: string | null = null;
    
    // Handle room creation
    socket.on('room:create', (data: { hostName: string }, callback) => {
      try {
        const { roomCode, sessionId } = roomManager.createRoom(data.hostName);
        
        // Join the socket room
        socket.join(roomCode);
        currentRoomCode = roomCode;
        currentSessionId = sessionId;
        
        // Get room data to send back
        const room = roomManager.getRoom(roomCode);
        
        callback({ 
          success: true, 
          roomCode, 
          sessionId,
          room: room
        });
        
        console.log(`Room ${roomCode} created by ${data.hostName}`);
        
      } catch (error) {
        console.error('Error creating room:', error);
        callback({ success: false, error: 'Failed to create room' });
      }
    });
    
    // Handle joining room
    socket.on('room:join', (data: { roomCode: string; playerName: string }, callback) => {
      try {
        const result = roomManager.joinRoom(data.roomCode, data.playerName);
        
        if (result.success && result.sessionId) {
          // Join the socket room
          socket.join(data.roomCode);
          currentRoomCode = data.roomCode;
          currentSessionId = result.sessionId;
          
          // Get updated room data
          const room = roomManager.getRoom(data.roomCode);
          
          // Notify all players in room about new player
          socket.to(data.roomCode).emit('player:joined', {
            player: room?.players.find(p => p.sessionId === result.sessionId),
            roomState: room
          });
          
          callback({ 
            success: true, 
            sessionId: result.sessionId,
            room: room
          });
          
          console.log(`Player ${data.playerName} joined room ${data.roomCode}`);
          
        } else {
          callback(result);
        }
        
      } catch (error) {
        console.error('Error joining room:', error);
        callback({ success: false, error: 'Failed to join room' });
      }
    });

    // Handle game start
    socket.on('game:start', (data: { roomCode: string; sessionId: string }, callback) => {
      try {
        const room = roomManager.getRoom(data.roomCode);
        if (!room) {
          callback({ success: false, error: 'Room not found' });
          return;
        }

        // Verify host permission
        const player = room.players.find(p => p.sessionId === data.sessionId);
        if (!player || !player.isHost) {
          callback({ success: false, error: 'Only host can start the game' });
          return;
        }

        // Initialize game state
        const success = roomManager.initializeGameState(data.roomCode);
        if (success) {
          // Notify all players that game has started
          io.to(data.roomCode).emit('game:started', {
            gameState: room.gameState
          });

          callback({ success: true, gameState: room.gameState });
          console.log(`Game started in room ${data.roomCode}`);
        } else {
          callback({ success: false, error: 'Failed to start game' });
        }

      } catch (error) {
        console.error('Error starting game:', error);
        callback({ success: false, error: 'Failed to start game' });
      }
    });
    
    // Handle game state updates (place guess, end turn, etc.)
    socket.on('game:action', (data: { 
      roomCode: string; 
      sessionId: string; 
      action: string; 
      payload: any 
    }) => {
      try {
        const room = roomManager.getRoom(data.roomCode);
        if (!room) return;
        
        // Verify player is in room
        const player = room.players.find(p => p.sessionId === data.sessionId);
        if (!player) return;
        
        // Broadcast action to all players in room
        io.to(data.roomCode).emit('game:action', {
          playerId: data.sessionId,
          playerName: player.displayName,
          action: data.action,
          payload: data.payload,
          timestamp: new Date()
        });
        
        room.lastActivity = new Date();
        
        console.log(`Game action ${data.action} from ${player.displayName} in room ${data.roomCode}`);
        
      } catch (error) {
        console.error('Error handling game action:', error);
      }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Client disconnected: ${socket.id}`);
      
      if (currentRoomCode && currentSessionId) {
        // Update player connection status
        roomManager.updatePlayerConnection(currentRoomCode, currentSessionId, false);
        
        // Notify other players
        socket.to(currentRoomCode).emit('player:disconnected', {
          sessionId: currentSessionId
        });
      }
    });
    
    // Handle explicit leave room
    socket.on('room:leave', () => {
      if (currentRoomCode && currentSessionId) {
        const room = roomManager.getRoom(currentRoomCode);
        const player = room?.players.find(p => p.sessionId === currentSessionId);
        
        roomManager.removePlayer(currentRoomCode, currentSessionId);
        socket.leave(currentRoomCode);
        
        // Notify other players
        socket.to(currentRoomCode).emit('player:left', {
          sessionId: currentSessionId,
          playerName: player?.displayName
        });
        
        currentRoomCode = null;
        currentSessionId = null;
      }
    });
  });
};
