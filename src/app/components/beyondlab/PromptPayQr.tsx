type PromptPayQrProps = {
  amount: number;
  className?: string;
};

const promptPayId = "0987824363";

export function getPromptPayQrUrl(amount: number) {
  const safeAmount = Number.isFinite(amount) && amount > 0 ? Math.round(amount) : 1;
  return `https://promptpay.io/${promptPayId}/${safeAmount}.png`;
}

export function PromptPayQr({ amount, className = "h-36 w-36 rounded-xl border border-current/10 bg-white p-1.5 shadow-sm" }: PromptPayQrProps) {
  return (
    <img
      src={getPromptPayQrUrl(amount)}
      onError={(event) => {
        (event.currentTarget as HTMLImageElement).src = "/promptpay-qr.png";
      }}
      alt={`PromptPay QR Code ${amount} THB`}
      className={className}
    />
  );
}
