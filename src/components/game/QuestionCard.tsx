import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, MessageCircle, CheckCircle, XCircle } from "lucide-react";
import { Question } from "@/contexts/GameContext";
import { useGame } from "@/contexts/GameContext";

interface QuestionCardProps {
  question: Question;
  onComplete: () => void;
  playerName: string;
}

const QuestionCard = ({ question, onComplete, playerName }: QuestionCardProps) => {
  const { dispatch, getCurrentPlayer } = useGame();
  const currentPlayer = getCurrentPlayer();

  const handleSuccess = () => {
    dispatch({ type: 'MISSION_SUCCESS' });
    onComplete();
  };

  const handleFail = () => {
    if (currentPlayer) {
      dispatch({ type: 'MISSION_FAIL', playerId: currentPlayer.id });
    }
    onComplete();
  };

  const getIcon = () => {
    switch (question.category) {
      case 'heart':
        return <Heart className="w-6 h-6 text-heart" />;
      case 'praise':
        return <Star className="w-6 h-6 text-praise" />;
      default:
        return <MessageCircle className="w-6 h-6 text-primary" />;
    }
  };

  const getCardStyle = () => {
    switch (question.category) {
      case 'heart':
        return 'bg-gradient-heart border-heart shadow-glow';
      case 'praise':
        return 'bg-gradient-praise border-praise shadow-glow';
      default:
        return 'bg-gradient-warm border-primary shadow-warm';
    }
  };

  const getCategoryName = () => {
    switch (question.category) {
      case 'heart':
        return '하트 미션';
      case 'praise':
        return '칭찬 미션';
      default:
        return '일반 미션';
    }
  };

  const getSpecialMessage = () => {
    switch (question.category) {
      case 'heart':
        return '❤️ 따뜻한 마음을 나눠보세요 ❤️';
      case 'praise':
        return '⭐ 서로를 칭찬해주세요 ⭐';
      default:
        return '💭 솔직한 마음을 들려주세요 💭';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-bounce-in">
      <Card className={`max-w-2xl w-full border-2 ${getCardStyle()}`}>
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-3">
            {getIcon()}
            <CardTitle className="text-xl text-white font-bold">
              {getCategoryName()}
            </CardTitle>
          </div>
          
          <div className="space-y-2">
            <p className="text-lg font-semibold text-white">
              {playerName}님의 차례입니다
            </p>
            <p className="text-sm text-white/80">
              {getSpecialMessage()}
            </p>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* 미션 카드 */}
          <div className="bg-white/95 rounded-lg p-6 shadow-lg">
            <div className="text-center space-y-4">
              <div className="flex justify-center">
                {getIcon()}
              </div>
              
              <h3 className="text-2xl font-bold text-foreground leading-relaxed">
                {question.text}
              </h3>
            </div>
          </div>

          {/* 안내 메시지 */}
          <div className="bg-white/90 rounded-lg p-4 text-center">
            <p className="text-foreground font-medium mb-2">
              📢 미션을 수행해주세요
            </p>
            <p className="text-sm text-muted-foreground">
              미션을 완료하셨으면 <strong>성공</strong>을, 완료하지 못했다면 <strong>실패</strong>를 선택해주세요
            </p>
            <p className="text-xs text-red-600 mt-2">
              ⚠️ 실패시 이전 위치로 돌아갑니다
            </p>
          </div>

          {/* 성공/실패 버튼 */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={handleSuccess}
              size="lg"
              variant="default"
              className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle className="mr-2 w-6 h-6" />
              미션 성공
            </Button>
            
            <Button
              onClick={handleFail}
              size="lg"
              variant="destructive"
              className="px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <XCircle className="mr-2 w-6 h-6" />
              미션 실패
            </Button>
          </div>

          {/* 특별 칸 추가 효과 */}
          {question.category === 'heart' && (
            <div className="text-center animate-heart-burst">
              <div className="inline-flex space-x-2 text-2xl">
                <Heart className="w-6 h-6 text-heart animate-pulse" />
                <Heart className="w-6 h-6 text-heart animate-pulse delay-150" />
                <Heart className="w-6 h-6 text-heart animate-pulse delay-300" />
              </div>
            </div>
          )}

          {question.category === 'praise' && (
            <div className="text-center animate-celebration">
              <div className="inline-flex space-x-2 text-2xl">
                <Star className="w-6 h-6 text-praise animate-pulse" />
                <Star className="w-6 h-6 text-praise animate-pulse delay-150" />
                <Star className="w-6 h-6 text-praise animate-pulse delay-300" />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionCard;