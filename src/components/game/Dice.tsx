import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dice6 } from "lucide-react";

interface DiceProps {
  onRoll: () => void;
  disabled: boolean;
  lastRoll: number | null;
}

const Dice = ({ onRoll, disabled, lastRoll }: DiceProps) => {
  const [isRolling, setIsRolling] = useState(false);

  const handleRoll = () => {
    if (disabled) return;
    
    setIsRolling(true);
    onRoll();
    
    // 애니메이션 시간 후 롤링 상태 해제
    setTimeout(() => {
      setIsRolling(false);
    }, 1000);
  };

  const getDotPattern = (number: number) => {
    const patterns = {
      1: [[false, false, false], [false, true, false], [false, false, false]],
      2: [[true, false, false], [false, false, false], [false, false, true]],
      3: [[true, false, false], [false, true, false], [false, false, true]],
      4: [[true, false, true], [false, false, false], [true, false, true]],
      5: [[true, false, true], [false, true, false], [true, false, true]],
      6: [[true, false, true], [true, false, true], [true, false, true]],
    };
    return patterns[number as keyof typeof patterns] || patterns[1];
  };

  return (
    <Card className="shadow-warm bg-card/90 backdrop-blur-sm">
      <CardContent className="p-6 text-center space-y-4">
        {/* 주사위 표시 */}
        <div className="flex justify-center">
          <div 
            className={`
              w-20 h-20 bg-primary rounded-lg shadow-lg border-2 border-primary-foreground 
              flex items-center justify-center transition-all duration-300
              ${isRolling ? 'animate-dice-roll' : 'hover:scale-110'}
            `}
          >
            {lastRoll ? (
              <div className="grid grid-cols-3 gap-1 p-2">
                {getDotPattern(lastRoll).map((row, rowIndex) =>
                  row.map((dot, colIndex) => (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      className={`
                        w-2 h-2 rounded-full 
                        ${dot ? 'bg-primary-foreground' : 'transparent'}
                      `}
                    />
                  ))
                )}
              </div>
            ) : (
              <Dice6 className="w-10 h-10 text-primary-foreground" />
            )}
          </div>
        </div>

        {/* 결과 표시 */}
        {lastRoll && !isRolling && (
          <div className="space-y-2 animate-bounce-in">
            <div className="text-3xl font-bold text-primary">
              {lastRoll}
            </div>
            <p className="text-sm text-muted-foreground">
              {lastRoll}칸 앞으로 이동합니다
            </p>
          </div>
        )}

        {/* 주사위 굴리기 버튼 */}
        <Button
          onClick={handleRoll}
          disabled={disabled || isRolling}
          size="lg"
          className="w-full shadow-glow hover:shadow-warm transition-all duration-300"
        >
          {isRolling ? (
            <>
              <Dice6 className="mr-2 w-5 h-5 animate-spin" />
              주사위 굴리는 중...
            </>
          ) : (
            <>
              <Dice6 className="mr-2 w-5 h-5" />
              주사위 굴리기
            </>
          )}
        </Button>

        {disabled && !isRolling && (
          <p className="text-xs text-muted-foreground">
            {lastRoll ? "질문에 답변한 후 다음 차례로 넘어갑니다" : "잠시만 기다려주세요"}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default Dice;