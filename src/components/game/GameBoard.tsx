import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Trophy, Heart, Star } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import Dice from "./Dice";
import QuestionCard from "./QuestionCard";
import { questions } from "@/data/questions";

interface GameBoardProps {
  onBackToMenu: () => void;
}

const BOARD_SIZE = 20; // 총 칸 수

const GameBoard = ({ onBackToMenu }: GameBoardProps) => {
  const { state, dispatch, getCurrentPlayer } = useGame();
  const [showConfetti, setShowConfetti] = useState(false);
  const currentPlayer = getCurrentPlayer();

  const rollDice = () => {
    if (state.isMoving || !currentPlayer) return;
    
    const diceValue = Math.floor(Math.random() * 6) + 1;
    dispatch({ type: 'ROLL_DICE', value: diceValue });
    
    // 플레이어 이동
    setTimeout(() => {
      dispatch({ type: 'SET_MOVING', isMoving: true });
      const newPosition = Math.min(currentPlayer.position + diceValue, BOARD_SIZE - 1);
      
      dispatch({ type: 'MOVE_PLAYER', playerId: currentPlayer.id, newPosition });
      
      // 이동 애니메이션 후 질문 표시
      setTimeout(() => {
        dispatch({ type: 'SET_MOVING', isMoving: false });
        
        // 승리 조건 체크
        if (newPosition >= BOARD_SIZE - 1) {
          dispatch({ type: 'END_GAME', winner: currentPlayer });
          setShowConfetti(true);
          return;
        }
        
        // 질문 선택
        const questionPool = questions.filter(q => {
          const specialPositions = getSpecialPositions();
          if (specialPositions.praise.includes(newPosition)) return q.category === 'praise';
          if (specialPositions.heart.includes(newPosition)) return q.category === 'heart';
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

  const getSpecialPositions = () => {
    return {
      praise: [3, 7, 11, 15], // 칭찬하기 칸
      heart: [5, 9, 13, 17],  // 하트 칸
    };
  };

  const getPositionType = (position: number) => {
    const special = getSpecialPositions();
    if (special.praise.includes(position)) return 'praise';
    if (special.heart.includes(position)) return 'heart';
    if (position === BOARD_SIZE - 1) return 'finish';
    return 'normal';
  };

  const getPositionIcon = (position: number) => {
    const type = getPositionType(position);
    switch (type) {
      case 'praise':
        return <Star className="w-4 h-4 text-praise" />;
      case 'heart':
        return <Heart className="w-4 h-4 text-heart" />;
      case 'finish':
        return <Trophy className="w-4 h-4 text-primary" />;
      default:
        return null;
    }
  };

  const renderBoard = () => {
    const positions = Array.from({ length: BOARD_SIZE }, (_, i) => i);
    
    return (
      <div className="grid grid-cols-5 gap-2 p-4 bg-muted/30 rounded-lg">
        {positions.map((position) => {
          const playersOnPosition = state.players.filter(p => p.position === position);
          const positionType = getPositionType(position);
          
          return (
            <div
              key={position}
              className={`
                relative aspect-square rounded-lg border-2 p-2 flex flex-col items-center justify-center text-xs transition-all
                ${positionType === 'praise' ? 'bg-gradient-praise border-praise' : ''}
                ${positionType === 'heart' ? 'bg-gradient-heart border-heart' : ''}
                ${positionType === 'finish' ? 'bg-gradient-warm border-primary' : ''}
                ${positionType === 'normal' ? 'bg-card border-border' : ''}
              `}
            >
              <div className="absolute top-1 left-1 text-xs font-mono text-muted-foreground">
                {position + 1}
              </div>
              
              {getPositionIcon(position)}
              
              {/* 플레이어 말들 */}
              <div className="flex flex-wrap gap-1 mt-1">
                {playersOnPosition.map((player) => (
                  <div
                    key={player.id}
                    className={`w-3 h-3 rounded-full bg-player-${player.color} ${
                      state.isMoving && player.id === currentPlayer?.id ? 'animate-piece-move' : ''
                    }`}
                    title={player.name}
                  />
                ))}
              </div>
            </div>
          );
        })}
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
              함께한 소중한 시간이었습니다. 서로의 마음을 나눠주셔서 감사해요! ❤️
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
            <h1 className="text-2xl font-bold text-foreground">마음일기</h1>
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