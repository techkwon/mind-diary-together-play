import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Star, MessageCircle, ArrowRight } from "lucide-react";
import { Question } from "@/contexts/GameContext";

interface QuestionCardProps {
  question: Question;
  onComplete: () => void;
  playerName: string;
}

const QuestionCard = ({ question, onComplete, playerName }: QuestionCardProps) => {
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
        return '하트 카드';
      case 'praise':
        return '칭찬 카드';
      default:
        return '일반 카드';
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
          {/* 질문 카드 */}
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
              📢 질문을 큰 소리로 읽고 답변해주세요
            </p>
            <p className="text-sm text-muted-foreground">
              답변을 마치셨으면 아래 버튼을 눌러 다음 차례로 넘어가세요
            </p>
          </div>

          {/* 완료 버튼 */}
          <div className="flex justify-center space-x-4">
            <Button
              onClick={onComplete}
              size="lg"
              className="px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              답변 완료
              <ArrowRight className="ml-2 w-5 h-5" />
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