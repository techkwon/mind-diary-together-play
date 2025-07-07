import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface Player {
  id: string;
  name: string;
  color: 'red' | 'blue' | 'green' | 'yellow' | 'purple' | 'orange';
  position: number;
}

export interface Question {
  id: string;
  text: string;
  category: 'normal' | 'praise' | 'heart';
}

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  gamePhase: 'setup' | 'playing' | 'ended';
  winner: Player | null;
  lastDiceRoll: number | null;
  diceRolls: [number, number] | null; // 두 개의 주사위
  isDouble: boolean; // 더블 여부
  currentQuestion: Question | null;
  isMoving: boolean;
  previousPosition: number | null; // 실패시 돌아갈 위치
}

type GameAction = 
  | { type: 'SET_PLAYERS'; players: Player[] }
  | { type: 'START_GAME' }
  | { type: 'ROLL_DICE'; diceRolls: [number, number]; isDouble: boolean }
  | { type: 'MOVE_PLAYER'; playerId: string; newPosition: number }
  | { type: 'SET_QUESTION'; question: Question }
  | { type: 'SET_PREVIOUS_POSITION'; playerId: string; position: number }
  | { type: 'MISSION_SUCCESS' }
  | { type: 'MISSION_FAIL'; playerId: string }
  | { type: 'NEXT_TURN' }
  | { type: 'END_GAME'; winner: Player }
  | { type: 'SET_MOVING'; isMoving: boolean }
  | { type: 'RESET_GAME' };

const initialState: GameState = {
  players: [],
  currentPlayerIndex: 0,
  gamePhase: 'setup',
  winner: null,
  lastDiceRoll: null,
  diceRolls: null,
  isDouble: false,
  currentQuestion: null,
  isMoving: false,
  previousPosition: null,
};

function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'SET_PLAYERS':
      return { ...state, players: action.players };
    
    case 'START_GAME':
      return { ...state, gamePhase: 'playing' };
    
    case 'ROLL_DICE':
      return { 
        ...state, 
        diceRolls: action.diceRolls,
        isDouble: action.isDouble,
        lastDiceRoll: action.diceRolls[0] + action.diceRolls[1]
      };
    
    case 'MOVE_PLAYER':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.playerId
            ? { ...player, position: action.newPosition }
            : player
        ),
      };
    
    case 'SET_QUESTION':
      return { ...state, currentQuestion: action.question };
    
    case 'SET_PREVIOUS_POSITION':
      return { ...state, previousPosition: action.position };
    
    case 'MISSION_SUCCESS':
      return {
        ...state,
        currentQuestion: null,
        previousPosition: null,
      };
    
    case 'MISSION_FAIL':
      return {
        ...state,
        players: state.players.map(player =>
          player.id === action.playerId && state.previousPosition !== null
            ? { ...player, position: state.previousPosition }
            : player
        ),
        currentQuestion: null,
        previousPosition: null,
      };
    
    case 'NEXT_TURN':
      return {
        ...state,
        currentPlayerIndex: state.isDouble 
          ? state.currentPlayerIndex // 더블이면 같은 플레이어 유지
          : (state.currentPlayerIndex + 1) % state.players.length,
        lastDiceRoll: null,
        diceRolls: null,
        isDouble: false,
        currentQuestion: null,
        previousPosition: null,
      };
    
    case 'END_GAME':
      return { ...state, gamePhase: 'ended', winner: action.winner };
    
    case 'SET_MOVING':
      return { ...state, isMoving: action.isMoving };
    
    case 'RESET_GAME':
      return initialState;
    
    default:
      return state;
  }
}

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  getCurrentPlayer: () => Player | null;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const getCurrentPlayer = () => {
    if (state.players.length === 0) return null;
    return state.players[state.currentPlayerIndex] || null;
  };

  return (
    <GameContext.Provider value={{ state, dispatch, getCurrentPlayer }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}