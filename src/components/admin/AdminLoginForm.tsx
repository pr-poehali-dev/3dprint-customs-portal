import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';

interface AdminLoginFormProps {
  token: string;
  setToken: (token: string) => void;
  error: string;
  loading: boolean;
  onLogin: () => void;
}

export default function AdminLoginForm({ token, setToken, error, loading, onLogin }: AdminLoginFormProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Админ-панель</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="token">Токен доступа</Label>
            <Input
              id="token"
              type="password"
              placeholder="Введите токен администратора"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onLogin()}
            />
          </div>
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <Icon name="AlertCircle" size={16} />
                {error}
              </p>
            </div>
          )}
          <Button onClick={onLogin} className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Icon name="Loader2" size={18} className="animate-spin mr-2" />
                Проверка токена...
              </>
            ) : (
              'Войти'
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
