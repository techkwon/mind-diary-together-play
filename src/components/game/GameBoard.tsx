import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, Heart, Star } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { Player } from "@/contexts/GameContext";
import Dice from "./Dice";
import QuestionCard from "./QuestionCard";
import { questions } from "@/data/questions";

interface GameBoardProps {
  onBackToMenu: () => void;
}

const BOARD_SIZE = 100; // 총 칸 수 (뱀과 사다리 게임)

// 사다리 위치 (출발칸 -> 도착칸)
const LADDERS = {
  1: 38,
  4: 14,
  9: 31,
  16: 33,
  21: 42,
  28: 84,
  36: 44,
  51: 67,
  71: 91,
  80: 100
};

// 뱀 위치 (출발칸 -> 도착칸)
const SNAKES = {
  98: 78,
  95: 75,
  93: 73,
  87: 24,
  64: 60,
  62: 19,
  56: 53,
  49: 11,
  47: 26,
  16: 6
};

const GameBoard = ({ onBackToMenu }: GameBoardProps) => {
  const { state, dispatch, getCurrentPlayer } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);
  const currentPlayer = getCurrentPlayer();

  const rollDice = () => {
    if (state.isMoving || !currentPlayer) return;
    
    const diceValue = Math.floor(Math.random() * 6) + 1;
    dispatch({ type: 'ROLL_DICE', value: diceValue });
    
    // 이전 위치 저장 (미션 실패시 되돌아갈 위치)
    dispatch({ type: 'SET_PREVIOUS_POSITION', playerId: currentPlayer.id, position: currentPlayer.position });
    
    // 플레이어 이동
    setTimeout(() => {
      dispatch({ type: 'SET_MOVING', isMoving: true });
      const newPosition = Math.min(currentPlayer.position + diceValue, BOARD_SIZE);
      
      dispatch({ type: 'MOVE_PLAYER', playerId: currentPlayer.id, newPosition });
      
      // 이동 애니메이션 후 질문 표시
      setTimeout(() => {
        dispatch({ type: 'SET_MOVING', isMoving: false });
        
        // 승리 조건 체크
        if (newPosition >= BOARD_SIZE) {
          dispatch({ type: 'END_GAME', winner: currentPlayer });
          setShowConfetti(true);
          return;
        }

        // 뱀이나 사다리 체크
        let finalPosition = newPosition;
        if (LADDERS[newPosition as keyof typeof LADDERS]) {
          finalPosition = LADDERS[newPosition as keyof typeof LADDERS];
          dispatch({ type: 'MOVE_PLAYER', playerId: currentPlayer.id, newPosition: finalPosition });
        } else if (SNAKES[newPosition as keyof typeof SNAKES]) {
          finalPosition = SNAKES[newPosition as keyof typeof SNAKES];
          dispatch({ type: 'MOVE_PLAYER', playerId: currentPlayer.id, newPosition: finalPosition });
        }
        
        // 질문 선택
        const questionPool = questions.filter(q => {
          const positionType = getPositionType(finalPosition);
          if (positionType === 'ladder') return q.category === 'praise';
          if (positionType === 'snake') return q.category === 'heart';
          return q.category === 'normal';
        });
        
        const randomQuestion = questionPool[Math.floor(Math.random() * questionPool.length)];
        dispatch({ type: 'SET_QUESTION', question: randomQuestion });
      }, 1000);
    }, 1000);
  };

  const nextTurn = () => {
    dispatch({ type: 'NEXT_TURN' });
  };

  const getPlayerEmoji = (color: Player['color']) => {
    const colorMap = {
      red: '🐻',
      blue: '🐸', 
      green: '🐱',
      yellow: '🐰',
      purple: '🦊',
      orange: '🐶'
    };
    return colorMap[color] || '🐻';
  };
  const getRowCol = (num: number) => {
    const row = Math.floor((num - 1) / 10);
    const col = row % 2 === 0 ? (num - 1) % 10 : 9 - ((num - 1) % 10);
    return { row: 9 - row, col }; // 위에서부터 시작하도록 row 반전
  };

  const getSpecialPositions = () => {
    return {
      praise: Object.keys(LADDERS).map(Number), // 사다리 시작점들
      heart: Object.keys(SNAKES).map(Number),   // 뱀 시작점들
    };
  };

  const getPositionType = (position: number) => {
    if (position === 100) return 'finish';
    if (LADDERS[position as keyof typeof LADDERS]) return 'ladder';
    if (SNAKES[position as keyof typeof SNAKES]) return 'snake';
    return 'normal';
  };

  const getPositionIcon = (position: number) => {
    const type = getPositionType(position);
    switch (type) {
      case 'ladder':
        return <Star className="w-3 h-3 text-green-500 animate-pulse" />;
      case 'snake':
        return <Heart className="w-3 h-3 text-red-500 animate-pulse" />;
      case 'finish':
        return <Trophy className="w-3 h-3 text-primary animate-bounce" />;
      default:
        return null;
    }
  };

  const renderBoard = () => {
    return (
      <div className="w-full max-w-lg mx-auto">
        <div className="bg-muted/20 rounded-2xl p-4 relative overflow-hidden">
          {/* 배경 장식 */}
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-2xl" />
          
          {/* 10x10 그리드 */}
          <div className="grid grid-cols-10 gap-1 relative z-10">
            {Array.from({ length: 100 }, (_, i) => {
              const position = 100 - i; // 100부터 1까지 역순
              const { row, col } = getRowCol(position);
              const playersOnPosition = state.players.filter(p => p.position === position);
              const positionType = getPositionType(position);
              
              return (
                <div
                  key={position}
                  className={`
                    relative aspect-square rounded-md border flex flex-col items-center justify-center text-xs transition-all duration-300
                    ${positionType === 'ladder' ? 'bg-green-100 border-green-400 text-green-800' : ''}
                    ${positionType === 'snake' ? 'bg-red-100 border-red-400 text-red-800' : ''}
                    ${positionType === 'finish' ? 'bg-primary/20 border-primary text-primary font-bold' : ''}
                    ${positionType === 'normal' ? 'bg-background border-border' : ''}
                    ${playersOnPosition.length > 0 ? 'ring-2 ring-primary/50' : ''}
                  `}
                >
                  {/* 칸 번호 */}
                  <div className="absolute top-0.5 left-0.5 text-xs font-bold opacity-70">
                    {position}
                  </div>
                  
                  {/* 특수 아이콘 */}
                  <div className="mb-1">
                    {getPositionIcon(position)}
                  </div>
                  
                  {/* 플레이어 말들 */}
                  <div className="flex flex-wrap gap-1 justify-center">
                    {playersOnPosition.map((player, playerIndex) => (
                      <div
                        key={player.id}
                        className={`w-8 h-8 rounded-full bg-player-${player.color} shadow-lg border-2 border-white transform transition-all duration-300 flex items-center justify-center text-sm ${
                          state.isMoving && player.id === currentPlayer?.id ? 'animate-bounce scale-110' : ''
                        }`}
                        title={player.name}
                      >
                        {getPlayerEmoji(player.color)}
                      </div>
                    ))}
                  </div>
                  
                  {/* 사다리/뱀 표시 화살표 */}
                  {(LADDERS[position as keyof typeof LADDERS] || SNAKES[position as keyof typeof SNAKES]) && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      {LADDERS[position as keyof typeof LADDERS] && (
                        <div className="text-green-600 text-lg font-bold">↗</div>
                      )}
                      {SNAKES[position as keyof typeof SNAKES] && (
                        <div className="text-red-600 text-lg font-bold">↙</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* 장식 요소들 */}
          <div className="absolute top-4 right-4 w-6 h-6 bg-primary/10 rounded-full animate-pulse" />
          <div className="absolute bottom-4 left-4 w-4 h-4 bg-secondary/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* 게임 설명 */}
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <div className="flex justify-center items-center gap-4">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded"></div>
              <span>사다리 (↗)</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-400 rounded"></div>
              <span>뱀 (↙)</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (state.gamePhase === 'ended' && state.winner) {
    return (
      <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
        <Card className="shadow-warm border-0 bg-card/90 backdrop-blur-sm max-w-md w-full text-center">
          <CardHeader className="space-y-4">
            <div className="animate-celebration">
              <Trophy className="w-16 h-16 mx-auto text-primary mb-4" />
            </div>
            <CardTitle className="text-3xl text-foreground">
              🎉 축하합니다! 🎉
            </CardTitle>
            <p className="text-xl text-primary font-semibold">
              {state.winner.name}님이 승리했습니다!
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              사회정서 학습을 통해 함께 성장한 소중한 시간이었습니다! 🎓
            </p>
            <div className="space-y-2">
              <Button onClick={onBackToMenu} className="w-full">
                메인으로 돌아가기
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={onBackToMenu} size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            메인으로
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">한국형 사회정서 앱</h1>
            <p className="text-sm text-muted-foreground">게임 진행 중</p>
          </div>
          <div className="w-20" /> {/* 스페이서 */}
        </div>

        {/* 현재 플레이어 정보 */}
        {currentPlayer && (
          <Card className="shadow-card bg-card/80 backdrop-blur-sm">
            <CardContent className="py-4">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-3 mb-2">
                  <div className={`w-6 h-6 rounded-full bg-player-${currentPlayer.color}`} />
                  <h2 className="text-xl font-semibold text-foreground">
                    {currentPlayer.name}님 차례입니다
                  </h2>
                </div>
                <p className="text-sm text-muted-foreground">
                  주사위를 굴려 앞으로 나아가세요
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* 게임 보드 */}
        <Card className="shadow-card bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-center text-lg">게임 보드</CardTitle>
          </CardHeader>
          <CardContent>
            {renderBoard()}
          </CardContent>
        </Card>

        {/* 주사위 */}
        <div className="flex justify-center">
          <Dice 
            onRoll={rollDice} 
            disabled={state.isMoving || !currentPlayer || !!state.currentQuestion}
            lastRoll={state.lastDiceRoll}
          />
        </div>

        {/* 질문 카드 */}
        {state.currentQuestion && (
          <QuestionCard 
            question={state.currentQuestion} 
            onComplete={nextTurn}
            playerName={currentPlayer?.name || ''}
          />
        )}
      </div>
    </div>
  );
};

export default GameBoard;