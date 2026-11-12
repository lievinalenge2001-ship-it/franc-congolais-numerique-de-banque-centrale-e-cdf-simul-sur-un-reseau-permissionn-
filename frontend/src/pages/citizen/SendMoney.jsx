import React, { useState } from 'react';
import api from '../../services/api'; // Ajuste le chemin selon ton service d'appel API

export default function SendMoney() {
    const [recipientAddress, setRecipientAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [senderPrivateKey, setSenderPrivateKey] = useState(''); // Ou récupéré automatiquement de la session/wallet connecté
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const handleTransfer = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            // Appel vers la route backend que nous venons de configurer
            const response = await api.post('/citizen/transfer', {
                senderPrivateKey,
                recipientAddress,
                amount: Number(amount)
            });

            if (response.data.success) {
                setMessage(`Transfert réussi ! Hash : ${response.data.txHash}`);
                setAmount('');
                setRecipientAddress('');
            }
        } catch (err) {
            // Récupère l'erreur renvoyée par le backend (ex: "Recipient must pass KYC")
            setError(err.response?.data?.error || "Une erreur est survenue lors du transfert.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-lg mx-auto bg-slate-900 rounded-xl shadow-md text-white">
            <h2 className="text-2xl font-bold mb-4">Envoyer des e-CDF (P2P)</h2>

            {message && (
                <div className="mb-4 p-3 bg-green-800 text-green-100 rounded-md text-sm">
                    {message}
                </div>
            )}

            {error && (
                <div className="mb-4 p-3 bg-red-800 text-red-100 rounded-md text-sm">
                    {error}
                </div>
            )}

            <form onSubmit={handleTransfer} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Clé Privée de l'Expéditeur</label>
                    <input
                        type="password"
                        value={senderPrivateKey}
                        onChange={(e) => setSenderPrivateKey(e.target.value)}
                        placeholder="0x..."
                        required
                        className="w-full p-2 bg-slate-800 rounded border border-slate-700 focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Adresse du Destinataire</label>
                    <input
                        type="text"
                        value={recipientAddress}
                        onChange={(e) => setRecipientAddress(e.target.value)}
                        placeholder="0x..."
                        required
                        className="w-full p-2 bg-slate-800 rounded border border-slate-700 focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Montant à envoyer (e-CDF)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="100"
                        min="1"
                        required
                        className="w-full p-2 bg-slate-800 rounded border border-slate-700 focus:outline-none focus:border-blue-500 text-sm"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 transition rounded font-semibold text-sm disabled:opacity-50"
                >
                    {loading ? "Traitement en cours..." : "Effectuer le Transfert"}
                </button>
            </form>
        </div>
    );
}