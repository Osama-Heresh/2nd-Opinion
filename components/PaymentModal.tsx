
import React, { useState } from 'react';
import { CreditCard, Lock, Loader2, CheckCircle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface PaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (amount: number) => void;
}

const PaymentModal = ({ isOpen, onClose, onSuccess }: PaymentModalProps) => {
    const { t } = useApp();
    const [amount, setAmount] = useState(50);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        name: ''
    });

    if (!isOpen) return null;

    const handlePayment = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulate API processing delay
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
            setTimeout(() => {
                onSuccess(amount);
                setSuccess(false);
                setCardData({ number: '', expiry: '', cvc: '', name: '' }); // Reset
                onClose();
            }, 1500);
        }, 2000);
    };

    const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Simple formatting
        let val = e.target.value.replace(/\D/g, '').substring(0, 16);
        val = val.match(/.{1,4}/g)?.join(' ') || val;
        setCardData({ ...cardData, number: val });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden relative">
                {/* Close Button */}
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 rtl:right-auto rtl:left-4 text-slate-400 hover:text-slate-600 z-10"
                >
                    <X className="h-5 w-5" />
                </button>

                {success ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-in zoom-in duration-300">
                            <CheckCircle className="h-8 w-8 text-green-600" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{t('payment.success')}</h3>
                        <p className="text-slate-500 mt-2">Your wallet has been topped up.</p>
                    </div>
                ) : (
                    <div className="p-8">
                        <div className="flex items-center gap-2 mb-6 text-primary-600">
                            <Lock className="h-5 w-5" />
                            <h2 className="text-xl font-bold text-slate-900">{t('payment.modalTitle')}</h2>
                        </div>

                        <form onSubmit={handlePayment} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">{t('payment.amount')}</label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                                    <input 
                                        type="number" 
                                        min="10" 
                                        value={amount}
                                        onChange={(e) => setAmount(Number(e.target.value))}
                                        className="w-full pl-8 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-bold text-lg" 
                                    />
                                </div>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('payment.cardNumber')}</label>
                                    <div className="relative">
                                        <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="0000 0000 0000 0000"
                                            value={cardData.number}
                                            onChange={handleCardNumber}
                                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none font-mono"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('payment.expiry')}</label>
                                        <input 
                                            type="text" 
                                            placeholder="MM / YY"
                                            maxLength={5}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-center"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('payment.cvc')}</label>
                                        <input 
                                            type="password" 
                                            placeholder="123"
                                            maxLength={3}
                                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none text-center"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">{t('payment.holder')}</label>
                                    <input 
                                        type="text" 
                                        placeholder="JOHN DOE"
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none"
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-slate-900 text-white py-4 rounded-lg font-bold hover:bg-slate-800 transition shadow-lg mt-4 disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="animate-spin h-5 w-5" />}
                                {loading ? t('payment.processing') : `${t('payment.payNow')} $${amount.toFixed(2)}`}
                            </button>
                            
                            <div className="text-center">
                                <span className="text-xs text-slate-400 flex items-center justify-center gap-1">
                                    <Lock className="h-3 w-3" /> Encrypted by Stripe (Simulated)
                                </span>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PaymentModal;
