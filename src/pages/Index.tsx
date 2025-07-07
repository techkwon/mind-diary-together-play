import { useState } from "react";
import { Heart, Users, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PlayerSetup from "@/components/game/PlayerSetup";
import GameBoard from "@/components/game/GameBoard";
import { GameProvider } from "@/contexts/GameContext";

const Index = () => {
  const [gameState, setGameState] = useState<'menu' | 'setup' | 'playing'>('menu');

  const startGame = () => {
    setGameState('setup');
  };

  const onSetupComplete = () => {
    setGameState('playing');
  };

  const backToMenu = () => {
    setGameState('menu');
  };

  if (gameState === 'playing') {
    return (
      <GameProvider>
        <GameBoard onBackToMenu={backToMenu} />
      </GameProvider>
    );
  }

  if (gameState === 'setup') {
    return (
      <GameProvider>
        <PlayerSetup onComplete={onSetupComplete} onBack={backToMenu} />
      </GameProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6 animate-bounce-in">
          <div className="flex justify-center items-center space-x-4 mb-6">
            <Heart className="w-12 h-12 text-heart animate-heart-burst" />
            <h1 className="text-6xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              마음일기
            </h1>
            <Heart className="w-12 h-12 text-heart animate-heart-burst" />
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            가족과 친구들이 함께 모여 서로의 마음을 나누는 따뜻한 보드게임
          </p>
          
          <div className="flex justify-center items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Users className="w-4 h-4" />
              <span>2-4명</span>
            </div>
            <div className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>감정 공유</span>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>15-30분</span>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <Card className="shadow-warm border-0 bg-card/80 backdrop-blur-sm">
          <CardHeader className="space-y-4">
            <CardTitle className="text-2xl text-foreground">
              새로운 게임을 시작해보세요
            </CardTitle>
            <CardDescription className="text-base">
              한 화면을 함께 보며 주사위를 굴리고, 질문에 답하며 서로를 더 깊이 알아가는 시간을 가져보세요.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Button 
              size="lg" 
              onClick={startGame}
              className="w-full h-16 text-xl font-semibold shadow-glow hover:shadow-warm transition-all duration-300 transform hover:scale-105"
            >
              <Play className="mr-3 w-6 h-6" />
              새 게임 시작하기
            </Button>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center mx-auto">
                  <Users className="w-6 h-6 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">함께 플레이</h3>
                <p className="text-sm text-muted-foreground">
                  한 화면을 보며 모두가 함께 참여
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-heart rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">마음 나누기</h3>
                <p className="text-sm text-muted-foreground">
                  서로의 감정과 생각을 공유
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-praise rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">즐거운 시간</h3>
                <p className="text-sm text-muted-foreground">
                  웃음과 감동이 있는 소중한 시간
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-sm text-muted-foreground/70">
          ❤️ 소중한 사람들과 함께하는 마음일기 ❤️
        </p>
      </div>
    </div>
  );
};

export default Index;