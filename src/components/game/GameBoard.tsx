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

const BOARD_SIZE = 20; // 총 칸 수 (다이나믹 사다리 게임 형태)
const LADDER_STEPS = [
  [0],                    // 시작점
  [1, 2, 3],             // 1단계 (3갈래)
  [4, 5],                // 2단계 (2갈래)  
  [6, 7, 8, 9],          // 3단계 (4갈래)
  [10, 11],              // 4단계 (2갈래)
  [12, 13, 14],          // 5단계 (3갈래)
  [15, 16],              // 6단계 (2갈래)
  [17, 18],              // 7단계 (2갈래)
  [19],                  // 최종 단계 (골인)
];

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
      praise: [3, 7, 11, 15], // 관계 기술 칸
      heart: [5, 9, 13, 17],  // 의사결정 칸
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
        return <Star className="w-5 h-5 text-praise animate-pulse" />;
      case 'heart':
        return <Heart className="w-5 h-5 text-heart animate-pulse" />;
      case 'finish':
        return <Trophy className="w-5 h-5 text-primary animate-bounce" />;
      default:
        return <div className="w-2 h-2 bg-muted-foreground/40 rounded-full" />;
    }
  };

  const renderBoard = () => {
    return (
      <div className="max-w-2xl mx-auto space-y-6 p-8 bg-muted/20 rounded-2xl relative">
        {/* 배경 장식 */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-secondary/5 rounded-2xl" />
        
        {LADDER_STEPS.map((step, stepIndex) => (
          <div key={stepIndex} className="relative space-y-3">
            {/* 단계 라벨 */}
            <div className="text-center relative z-10">
              <span className={`
                inline-block px-4 py-2 rounded-full text-sm font-bold shadow-md transform transition-all duration-300
                ${stepIndex === 0 ? 'bg-gradient-warm text-white animate-pulse' : ''}
                ${stepIndex === LADDER_STEPS.length - 1 ? 'bg-gradient-warm text-white shadow-glow animate-celebration' : ''}
                ${stepIndex > 0 && stepIndex < LADDER_STEPS.length - 1 ? 'bg-background border-2 border-primary/30 text-foreground hover:scale-105' : ''}
              `}>
                {stepIndex === 0 ? '🚀 시작' : 
                 stepIndex === LADDER_STEPS.length - 1 ? '🏆 골인' : 
                 `${stepIndex}단계`}
              </span>
            </div>
            
            {/* 해당 단계의 칸들 */}
            <div className={`
              flex justify-center gap-3 relative z-10
              ${step.length === 1 ? 'justify-center' : 
                step.length === 2 ? 'justify-center gap-8' :
                step.length === 3 ? 'justify-center gap-4' :
                'justify-center gap-2'}
            `}>
              {step.map((position, posIndex) => {
                const playersOnPosition = state.players.filter(p => p.position === position);
                const positionType = getPositionType(position);
                
                return (
                  <div
                    key={position}
                    className={`
                      relative w-20 h-20 rounded-xl border-3 p-3 flex flex-col items-center justify-center text-xs transition-all duration-500 transform hover:scale-110
                      ${positionType === 'praise' ? 'bg-gradient-praise border-praise shadow-glow animate-pulse' : ''}
                      ${positionType === 'heart' ? 'bg-gradient-heart border-heart shadow-glow animate-pulse' : ''}
                      ${positionType === 'finish' ? 'bg-gradient-warm border-primary shadow-warm animate-bounce' : ''}
                      ${positionType === 'normal' ? 'bg-card/90 border-border hover:border-primary/50 hover:shadow-md backdrop-blur-sm' : ''}
                      ${playersOnPosition.length > 0 ? 'ring-4 ring-primary/30' : ''}
                    `}
                    style={{
                      animationDelay: `${posIndex * 0.1}s`
                    }}
                  >
                    <div className="absolute -top-2 -left-2 text-xs font-bold bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center shadow-md">
                      {position + 1}
                    </div>
                    
                    <div className="mb-1">
                      {getPositionIcon(position)}
                    </div>
                    
                    {/* 플레이어 말들 */}
                    <div className="flex flex-wrap gap-1 justify-center">
                      {playersOnPosition.map((player, playerIndex) => (
                        <div
                          key={player.id}
                          className={`w-4 h-4 rounded-full bg-player-${player.color} shadow-lg border-2 border-white transform transition-all duration-300 ${
                            state.isMoving && player.id === currentPlayer?.id ? 'animate-piece-move scale-125' : 'hover:scale-110'
                          }`}
                          title={player.name}
                          style={{
                            animationDelay: `${playerIndex * 0.1}s`
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
            
            {/* 다이나믹 연결선 (사다리 효과) */}
            {stepIndex < LADDER_STEPS.length - 1 && (
              <div className="flex justify-center relative">
                <div className="relative">
                  {/* 메인 연결선 */}
                  <div className="w-1 h-8 bg-gradient-to-b from-primary/60 to-primary/30 rounded-full mx-auto shadow-sm" />
                  
                  {/* 사다리 가로선들 */}
                  {step.length > 1 && (
                    <div className="absolute top-4 left-1/2 transform -translate-x-1/2">
                      <div className="flex space-x-2">
                        {Array.from({ length: step.length - 1 }, (_, i) => (
                          <div 
                            key={i} 
                            className="w-6 h-0.5 bg-primary/40 rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.2}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* 분기 연결선들 */}
                  {LADDER_STEPS[stepIndex + 1] && LADDER_STEPS[stepIndex + 1].length > 1 && (
                    <div className="absolute top-6 left-1/2 transform -translate-x-1/2">
                      <div className={`flex ${LADDER_STEPS[stepIndex + 1].length === 2 ? 'gap-16' : 
                                             LADDER_STEPS[stepIndex + 1].length === 3 ? 'gap-8' : 'gap-4'}`}>
                        {LADDER_STEPS[stepIndex + 1].map((_, branchIndex) => (
                          <div 
                            key={branchIndex}
                            className="w-0.5 h-4 bg-gradient-to-b from-primary/30 to-transparent rounded-full animate-pulse"
                            style={{ animationDelay: `${branchIndex * 0.15}s` }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
        
        {/* 배경 장식 원들 */}
        <div className="absolute top-4 right-4 w-8 h-8 bg-primary/10 rounded-full animate-ping" />
        <div className="absolute bottom-4 left-4 w-6 h-6 bg-secondary/10 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-8 w-4 h-4 bg-accent/10 rounded-full animate-ping" style={{ animationDelay: '2s' }} />
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