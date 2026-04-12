import React, { useState } from 'react';

const TokenShop = () => {
  const [coinAmount, setCoinAmount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const usdPrice = coinAmount * 0.01;
  const taxRate = 0.1;
  const taxAmount = usdPrice * taxRate;
  const totalPrice = usdPrice + taxAmount;

  const handlePurchase = () => {
    if (coinAmount <= 0 || !paymentMethod) return;
    setShowConfirmation(true);
  };

  const closeConfirmation = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <h1>Token Shop</h1>
      <label>Coin Amount:</label>
      <input
        type="number"
        value={coinAmount}
        onChange={(e) => setCoinAmount(Number(e.target.value) || 0)}
      />
      <p>Price in USD: ${usdPrice.toFixed(2)}</p>
      <p>Tax: ${taxAmount.toFixed(2)}</p>
      <p>Total Price: ${totalPrice.toFixed(2)}</p>
      <h3>Payment Methods</h3>
      <select onChange={(e) => setPaymentMethod(e.target.value)}>
        <option value="">Select Payment Method</option>
        <option value="credit_card">Credit Card</option>
        <option value="paypal">PayPal</option>
      </select>
      <button onClick={handlePurchase}>Purchase</button>

      {showConfirmation && (
        <div>
          <h2>Confirmation</h2>
          <p>You have purchased {coinAmount} coins for ${totalPrice.toFixed(2)}.</p>
          <button onClick={closeConfirmation}>Close</button>
        </div>
      )}
import { createTokenCheckoutSession } from '../services/paymentService';

const TOKEN_PACKAGES = [
  { tokens: 100, priceUsd: 1.0 },
  { tokens: 500, priceUsd: 4.5 },
  { tokens: 1000, priceUsd: 8.0 },
];

const TokenShop: React.FC = () => {
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const pkg = TOKEN_PACKAGES[selected];

  const handlePurchase = async () => {
    setError(null);
    setLoading(true);
    try {
      const userId = localStorage.getItem('userId') ?? 'guest';
      const { url } = await createTokenCheckoutSession({
        userId,
        tokenAmount: pkg.tokens,
      });
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Purchase failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Token Shop</h1>
      <div className="space-y-3 mb-6">
        {TOKEN_PACKAGES.map((p, i) => (
          <label key={i} className="flex items-center gap-3 cursor-pointer">
            <input
              type="radio"
              name="package"
              checked={selected === i}
              onChange={() => setSelected(i)}
            />
            <span>
              {p.tokens} tokens — ${p.priceUsd.toFixed(2)}
            </span>
          </label>
        ))}
      </div>
      {error && <p className="text-red-500 mb-3">{error}</p>}
      <button
        onClick={handlePurchase}
        disabled={loading}
        className="bg-amber-600 text-white px-6 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Redirecting…' : 'Buy Now'}
      </button>
    </div>
  );
};

export default TokenShop;
