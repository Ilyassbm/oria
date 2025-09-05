import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="oria-card-elevated max-w-md w-full text-center">
        <CardHeader>
          <div className="mx-auto mb-4 text-6xl font-bold text-primary">404</div>
          <CardTitle className="text-2xl">Page introuvable</CardTitle>
          <CardDescription>
            La page que vous recherchez n'existe pas ou a été déplacée.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="flex-1">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Accueil
              </Link>
            </Button>
            <Button variant="secondary" asChild className="flex-1">
              <Link to="/subscriptions">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Abonnements
              </Link>
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Route demandée : {location.pathname}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;