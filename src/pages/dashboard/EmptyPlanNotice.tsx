import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function EmptyPlanNotice() {
  return (
    <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
      <CardContent className="p-6 sm:p-8 text-center space-y-4">
        <h2 className="text-xl font-semibold text-secondary">Finish your intake to unlock this section</h2>
        <p className="text-sm text-muted-foreground">
          Your goals, 90-day plan, roadmap, and funding options are generated from the 5-minute Needs Analysis.
        </p>
        <Link to="/intake">
          <Button size="lg" className="rounded-full">
            Complete My Intake <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}