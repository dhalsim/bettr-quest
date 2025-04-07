import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check } from 'lucide-react';
import { DateTime } from 'luxon';
import { ScheduleCallOption, BookedSchedule } from '@/types/schedule';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BookingFlowProps {
  selectedDateTime: DateTime;
  selectedOption: ScheduleCallOption;
  onBook: (booking: Omit<BookedSchedule, 'id'>) => void;
}

const BookingFlow: React.FC<BookingFlowProps> = ({
  selectedDateTime,
  selectedOption,
  onBook
}) => {
  const { t } = useTranslation(null, { keyPrefix: 'profile.schedule' });
  const [copied, setCopied] = useState(false);
  const [lnInvoice, setLnInvoice] = useState<string | null>(null);

  const handleCopy = () => {
    if (lnInvoice) {
      navigator.clipboard.writeText(lnInvoice);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
      toast.success(t('Invoice copied to clipboard'));
    }
  };

  const handleBook = async () => {
    if (selectedOption.price) {
      // In a real implementation, we would make an API call to create an invoice
      // For now, we'll just simulate it
      const mockInvoice = `lnbc${selectedOption.price}n1p3k3vmxpp5ygvwruvt4xjj6vce4qlp2g4u5p6m7fxfxx5vxxcfkfnkz5fzqhp5fq3jkj0z6qskvvd7uurjqpwkvvl2y8njfsmwgpl3j9yfcy79t53dcsxqyjw5qcqpjrzjq027tu7ha5xfdx9u6d3997d5thwm3hhlwxjw82rmn8f834kefjkjn77y6sp57tucqqqgqqyqqqqqpqqqqqqgq9q9qxpqysgq667zl224lvmyj3r59xyg4a4jl7ups97qkmqnwa4457jja39qkunsfukcmkqwf3u5nk4q92z6sk5475s2cndlnmqucdz0rgqpnpnv3m`;
      setLnInvoice(mockInvoice);
      return;
    }

    const booking: Omit<BookedSchedule, 'id'> = {
      date: selectedDateTime.toJSDate(),
      duration: selectedOption.duration,
      callOptionId: selectedOption.id,
      userId: 'current-user-id', // This should come from auth context
      username: 'current-username', // This should come from auth context
      status: selectedOption.needsApproval ? 'pending' : 'approved',
      payed: false
    };

    onBook(booking);
  };

  if (lnInvoice) {
    return (
      <div className="space-y-4">
        <div className="bg-secondary/20 p-4 rounded-lg flex items-center justify-center min-h-[200px] flex-col">
          <div className="p-12 text-center text-muted-foreground">
            <p>
              {t('Please pay the invoice to confirm the booking')}
            </p>
          </div>
          {/* This would be a QR code in a real implementation */}
          <div className="border-2 border-dashed border-border p-12 rounded-lg text-center text-muted-foreground">
            {t('QR Code for Lightning Payment')}
          </div>
        </div>
        
        <div className="relative">
          <textarea
            className="w-full h-24 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 font-mono text-xs"
            value={lnInvoice}
            readOnly
          />
          <Button
            size="sm"
            variant="secondary"
            className="absolute right-2 top-2"
            onClick={handleCopy}
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            {copied ? t('Copied') : t('Copy')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <div className="font-medium">{selectedOption.description}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {selectedOption.duration} {t('minutes')} - {selectedOption.price ? `${selectedOption.price} sats` : t('Free')}
        </div>
        {selectedOption.firstCall && (
          <div className="text-sm text-green-600 dark:text-green-400">
            {t('First consultation free')}
          </div>
        )}
        {selectedOption.needsApproval && (
          <div className="text-sm text-yellow-600 dark:text-yellow-400">
            {t('Requires approval')}
          </div>
        )}
      </div>

      <Button
        onClick={handleBook}
        className="w-full"
      >
        {selectedOption.needsApproval ? t('Reserve Slot') : t('Book Call')}
      </Button>
    </div>
  );
};

export default BookingFlow; 