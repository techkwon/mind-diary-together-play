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
            <h1 className="text-5xl font-bold bg-gradient-warm bg-clip-text text-transparent">
              한국형 사회정서 앱
            </h1>
            <Heart className="w-12 h-12 text-heart animate-heart-burst" />
          </div>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            사회정서 학습을 통해 감정을 이해하고 관계를 발전시키는 교육용 게임
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
              사회정서 학습 게임을 시작해보세요
            </CardTitle>
            <CardDescription className="text-base">
              감정 인식, 공감 능력, 관계 기술을 기르며 건전한 사회적 상호작용을 학습하는 교육용 게임입니다.
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
                <h3 className="font-semibold text-foreground">협력 학습</h3>
                <p className="text-sm text-muted-foreground">
                  함께 참여하며 사회적 기술 향상
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-heart rounded-full flex items-center justify-center mx-auto">
                  <Heart className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">감정 이해</h3>
                <p className="text-sm text-muted-foreground">
                  자신과 타인의 감정을 인식하고 이해
                </p>
              </div>
              
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-gradient-praise rounded-full flex items-center justify-center mx-auto">
                  <Play className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-foreground">관계 기술</h3>
                <p className="text-sm text-muted-foreground">
                  의사소통과 공감 능력 개발
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <p className="text-sm text-muted-foreground/70">
          🎓 함께 성장하는 사회정서 학습 🎓
        </p>
      </div>
    </div>
  );
};

export default Index;