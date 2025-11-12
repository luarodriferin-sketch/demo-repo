import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';
import { Bitcoin, TrendingUp, Wallet, ArrowRightLeft } from 'lucide-react';

interface CryptoRate {
  name: string;
  symbol: string;
  rate: number; // Tasa en COP por unidad de crypto
  icon: string;
}

const cryptoRates: CryptoRate[] = [
  { name: 'Proton XPR', symbol: 'XPR', rate: 8, icon: '⚛' },
  { name: 'Proton USDC', symbol: 'XUSDC', rate: 4300, icon: '$' },
  { name: 'Proton USDT', symbol: 'XUSDT', rate: 4300, icon: '₮' },
  { name: 'Metal', symbol: 'METAL', rate: 5000, icon: 'M' },
  { name: 'Proton Loan', symbol: 'LOAN', rate: 20, icon: 'L' },
  { name: 'Wrapped Bitcoin', symbol: 'XBTC', rate: 380000000, icon: '₿' },
];

export function CryptoConverter() {
  const [nequiUser, setNequiUser] = useState('');
  const [amount, setAmount] = useState([15000]);
  const [selectedCrypto, setSelectedCrypto] = useState<string>('');
  const [result, setResult] = useState<{
    crypto: string;
    amount: number;
    symbol: string;
    icon: string;
  } | null>(null);

  const handleConvert = () => {
    if (!nequiUser || !selectedCrypto) {
      return;
    }

    const crypto = cryptoRates.find((c) => c.symbol === selectedCrypto);
    if (crypto) {
      const cryptoAmount = amount[0] / crypto.rate;
      setResult({
        crypto: crypto.name,
        amount: cryptoAmount,
        symbol: crypto.symbol,
        icon: crypto.icon,
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-2xl bg-white border-gray-200">
      <CardHeader className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-gray-800 to-black rounded-lg">
            <ArrowRightLeft className="size-6 text-white" />
          </div>
          <CardTitle>Conversor Crypto</CardTitle>
        </div>
        <CardDescription>
          Convierte tus pesos colombianos a criptomonedas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Usuario de Nequi */}
        <div className="space-y-2">
          <Label htmlFor="nequi-user" className="flex items-center gap-2">
            <Wallet className="size-4" />
            Usuario de Nequi
          </Label>
          <Input
            id="nequi-user"
            placeholder="Ingresa tu usuario de Nequi"
            value={nequiUser}
            onChange={(e) => setNequiUser(e.target.value)}
            className="transition-all focus:ring-2 focus:ring-gray-500"
          />
        </div>

        {/* Monto */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2">
              <TrendingUp className="size-4" />
              Monto (COP)
            </Label>
            <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full">
              ${amount[0].toLocaleString('es-CO')}
            </span>
          </div>
          <Slider
            value={amount}
            onValueChange={setAmount}
            min={10000}
            max={20000}
            step={1000}
            className="py-4"
          />
          <div className="flex justify-between text-muted-foreground">
            <span>$10.000</span>
            <span>$20.000</span>
          </div>
        </div>

        {/* Selección de Criptomoneda */}
        <div className="space-y-2">
          <Label htmlFor="crypto-select" className="flex items-center gap-2">
            <Bitcoin className="size-4" />
            Criptomoneda
          </Label>
          <Select value={selectedCrypto} onValueChange={setSelectedCrypto}>
            <SelectTrigger id="crypto-select" className="transition-all focus:ring-2 focus:ring-gray-500">
              <SelectValue placeholder="Selecciona una criptomoneda" />
            </SelectTrigger>
            <SelectContent>
              {cryptoRates.map((crypto) => (
                <SelectItem key={crypto.symbol} value={crypto.symbol}>
                  <div className="flex items-center gap-2">
                    <span>{crypto.icon}</span>
                    <span>{crypto.name} ({crypto.symbol})</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Botón de Conversión */}
        <Button
          onClick={handleConvert}
          disabled={!nequiUser || !selectedCrypto}
          className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-800 transition-all"
        >
          Convertir
        </Button>

        {/* Resultado */}
        {result && (
          <Alert className="bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300">
            <AlertDescription>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{result.icon}</span>
                  <div>
                    <p className="text-muted-foreground">Recibirás:</p>
                    <p className="text-gray-900">
                      {result.amount.toFixed(8)} {result.symbol}
                    </p>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-300 text-muted-foreground">
                  <p>Usuario: {nequiUser}</p>
                  <p>Monto: ${amount[0].toLocaleString('es-CO')} COP</p>
                </div>
              </div>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}