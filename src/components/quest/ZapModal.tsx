
import React, { useState, useRef, useEffect } from 'react';
import { Copy, Check, X } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogClose 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface ZapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  questTitle: string;
  questId: string;
  onZapComplete?: (amount: number) => void;
}

const ZapModal: React.FC<ZapModalProps> = ({ 
  open, 
  onOpenChange, 
  questTitle, 
  questId,
  onZapComplete 
}) => {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [step, setStep] = useState<'amount' | 'invoice' | 'success'>('amount');
  const [invoice, setInvoice] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const isMobile = useIsMobile();
  
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Reset the modal state when it's closed
  useEffect(() => {
    if (!open) {
      setTimeout(() => {
        setSelectedAmount(null);
        setCustomAmount('');
        setStep('amount');
        setInvoice('');
        setCopied(false);
      }, 300);
    }
  }, [open]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      if (value) {
        setSelectedAmount(null);
      }
    }
  };

  const getAmount = (): number => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseInt(customAmount, 10);
    return 0;
  };

  const handleCreateInvoice = () => {
    const amount = getAmount();
    
    if (!amount || amount <= 0) {
      toast.error("Please select or enter a valid amount");
      return;
    }

    // In a real implementation, we would make an API call to create an invoice
    // For now, we'll just simulate it
    setInvoice(`lnbc${amount}n1p3k3vmxpp5ygvwruvt4xjj6vce4qlp2g4u5p6m7fxfxx5vxxcfkfnkz5fzqhp5fq3jkj0z6qskvvd7uurjqpwkvvl2y8njfsmwgpl3j9yfcy79t53dcsxqyjw5qcqpjrzjq027tu7ha5xfdx9u6d3997d5thwm3hhlwxjw82rmn8f834kefjkjn77y6sp57tucqqqgqqyqqqqqpqqqqqqgq9q9qxpqysgq667zl224lvmyj3r59xyg4a4jl7ups97qkmqnwa4457jja39qkunsfukcmkqwf3u5nk4q92z6sk5475s2cndlnmqucdz0rgqpnpnv3m`);
    setStep('invoice');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(invoice);
    setCopied(true);
    
    // Reset copied state after 3 seconds
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setCopied(false);
    }, 3000);
    
    toast.success("Invoice copied to clipboard");
  };

  const handlePaymentSimulation = () => {
    // In a real implementation, we would listen for payment through a websocket
    // For now, we'll just simulate payment completion
    const amount = getAmount();
    setStep('success');
    
    if (onZapComplete) {
      onZapComplete(amount);
    }
    
    // Close the modal after 2 seconds
    setTimeout(() => {
      onOpenChange(false);
    }, 2000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogClose className="absolute right-4 top-4" onClick={() => onOpenChange(false)}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>{step === 'success' ? 'Payment Successful!' : 'Zap This Quest ⚡️'}</DialogTitle>
          <DialogDescription>
            {step === 'amount' && `Support "${questTitle}" with lightning sats`}
            {step === 'invoice' && 'Scan or copy the lightning invoice'}
            {step === 'success' && `You've sent ${getAmount()} sats to "${questTitle}"`}
          </DialogDescription>
        </DialogHeader>

        <div className="p-4">
          {step === 'amount' && (
            <>
              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3 mb-4`}>
                {[100, 200, 500, 1000].map((amount) => (
                  <Button
                    key={amount}
                    type="button"
                    variant={selectedAmount === amount ? "primary" : "outline"}
                    onClick={() => handleSelectAmount(amount)}
                    className="h-12"
                  >
                    {amount} sats
                  </Button>
                ))}
              </div>
              
              <div className="mb-6">
                <label htmlFor="custom-amount" className="block text-sm font-medium mb-2">
                  Custom Amount
                </label>
                <div className="relative">
                  <input
                    id="custom-amount"
                    ref={inputRef}
                    type="text"
                    placeholder="Enter sats amount"
                    className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    value={customAmount}
                    onChange={handleCustomAmountChange}
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                    sats
                  </span>
                </div>
              </div>
              
              <Button 
                onClick={handleCreateInvoice} 
                className="w-full"
                disabled={!selectedAmount && !customAmount}
              >
                Create Invoice
              </Button>
            </>
          )}
          
          {step === 'invoice' && (
            <>
              <div className="bg-secondary/20 p-4 rounded-lg mb-4 flex items-center justify-center min-h-[200px]">
                {/* This would be a QR code in a real implementation */}
                <div className="border-2 border-dashed border-border p-12 rounded-lg text-center text-muted-foreground">
                  QR Code for Lightning Payment
                </div>
              </div>
              
              <div className="relative mb-6">
                <textarea
                  className="w-full h-24 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-xs"
                  value={invoice}
                  readOnly
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute right-2 top-2"
                  onClick={handleCopy}
                >
                  {copied ? <Check size={16} /> : <Copy size={16} />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
              
              {/* For demo purposes only - in real implementation this button wouldn't exist */}
              <Button 
                onClick={handlePaymentSimulation} 
                className="w-full"
              >
                Simulate Payment
              </Button>
            </>
          )}
          
          {step === 'success' && (
            <div className="text-center py-8">
              <div className="bg-green-100 dark:bg-green-900/20 h-20 w-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check size={40} className="text-green-600 dark:text-green-400" />
              </div>
              <p className="text-lg font-medium">
                {getAmount()} sats sent successfully!
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ZapModal;
