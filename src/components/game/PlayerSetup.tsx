import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users, Play } from "lucide-react";
import { useGame } from "@/contexts/GameContext";
import { Player } from "@/contexts/GameContext";

interface PlayerSetupProps {
  onComplete: () => void;
  onBack: () => void;
}

const PLAYER_COLORS = [
  { value: 'red' as const, label: '빨강', class: 'bg-player-red' },
  { value: 'blue' as const, label: '파랑', class: 'bg-player-blue' },
  { value: 'green' as const, label: '초록', class: 'bg-player-green' },
  { value: 'yellow' as const, label: '노랑', class: 'bg-player-yellow' },
];

const PlayerSetup = ({ onComplete, onBack }: PlayerSetupProps) => {
  const { dispatch } = useGame();
  const [playerCount, setPlayerCount] = useState<number>(2);
  const [players, setPlayers] = useState<Omit<Player, 'position'>[]>([
    { id: '1', name: '', color: 'red' },
    { id: '2', name: '', color: 'blue' },
  ]);

  const updatePlayerCount = (count: number) => {
    setPlayerCount(count);
    const newPlayers = Array.from({ length: count }, (_, index) => ({
      id: (index + 1).toString(),
      name: players[index]?.name || '',
      color: PLAYER_COLORS[index % PLAYER_COLORS.length].value,
    }));
    setPlayers(newPlayers);
  };

  const updatePlayerName = (index: number, name: string) => {
    setPlayers(prev => prev.map((player, i) => 
      i === index ? { ...player, name } : player
    ));
  };

  const updatePlayerColor = (index: number, color: Player['color']) => {
    // 다른 플레이어가 같은 색을 사용하지 않도록 색상 교체
    setPlayers(prev => {
      const currentPlayerWithThisColor = prev.findIndex((p, i) => i !== index && p.color === color);
      
      if (currentPlayerWithThisColor !== -1) {
        // 기존에 이 색을 사용하던 플레이어의 색을 현재 플레이어의 색으로 변경
        const swappedPlayers = [...prev];
        swappedPlayers[currentPlayerWithThisColor].color = prev[index].color;
        swappedPlayers[index].color = color;
        return swappedPlayers;
      } else {
        return prev.map((player, i) => 
          i === index ? { ...player, color } : player
        );
      }
    });
  };

  const canStart = players.every(player => player.name.trim() !== '');

  const startGame = () => {
    const playersWithPosition = players.map(player => ({
      ...player,
      position: 0,
    }));
    
    dispatch({ type: 'SET_PLAYERS', players: playersWithPosition });
    dispatch({ type: 'START_GAME' });
    onComplete();
  };

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <Card className="shadow-warm border-0 bg-card/90 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" onClick={onBack} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                뒤로가기
              </Button>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">플레이어 설정</span>
              </div>
            </div>
            
            <CardTitle className="text-2xl text-foreground">
              플레이어 정보를 입력해주세요
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* 플레이어 수 선택 */}
            <div className="space-y-2">
              <Label className="text-base font-semibold">플레이어 수</Label>
              <div className="flex space-x-2">
                {[2, 3, 4].map((count) => (
                  <Button
                    key={count}
                    variant={playerCount === count ? "default" : "outline"}
                    onClick={() => updatePlayerCount(count)}
                    className="flex-1"
                  >
                    {count}명
                  </Button>
                ))}
              </div>
            </div>

            {/* 플레이어 정보 입력 */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">플레이어 정보</Label>
              {players.map((player, index) => (
                <Card key={player.id} className="p-4 bg-muted/50">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">
                        플레이어 {index + 1}
                      </Label>
                      <div className={`w-6 h-6 rounded-full ${PLAYER_COLORS.find(c => c.value === player.color)?.class}`} />
                    </div>
                    
                    <Input
                      placeholder="이름을 입력해주세요"
                      value={player.name}
                      onChange={(e) => updatePlayerName(index, e.target.value)}
                      className="text-base"
                    />
                    
                    <div className="space-y-2">
                      <Label className="text-sm">말 색상 선택</Label>
                      <div className="flex space-x-2">
                        {PLAYER_COLORS.map((colorOption) => (
                          <button
                            key={colorOption.value}
                            onClick={() => updatePlayerColor(index, colorOption.value)}
                            className={`w-8 h-8 rounded-full border-2 transition-all ${
                              player.color === colorOption.value 
                                ? 'border-primary ring-2 ring-primary/30 scale-110' 
                                : 'border-muted-foreground/30 hover:border-primary hover:scale-105'
                            } ${colorOption.class}`}
                            title={colorOption.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* 시작 버튼 */}
            <Button
              onClick={startGame}
              disabled={!canStart}
              size="lg"
              className="w-full h-14 text-lg font-semibold shadow-glow hover:shadow-warm transition-all duration-300"
            >
              <Play className="mr-3 w-5 h-5" />
              게임 시작하기
            </Button>

            {!canStart && (
              <p className="text-sm text-muted-foreground text-center">
                모든 플레이어의 이름을 입력해주세요
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerSetup;