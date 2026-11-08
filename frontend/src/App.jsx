import React, { useState } from 'react';
import { Shield, Landmark, Users, Wallet, ArrowRight, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('central');
  const [contractAddress, setContractAddress] = useState('0x5FbDB2315678afecb367f032d93F642f64180aa3');
  
  // États temporaires pour les formulaires de test
  const [mintData, setMintData] = useState({ to: '', amount: '' });
  const [kycData, setKycData] = useState({ address: '', status: true });
  const [citizenAddress, setCitizenAddress] = useState('');
  const [balanceResult, setBalanceResult] = useState(null);
  const [message, setMessage] = useState(null);

  // Simulation d'appel API vers le backend (Port 5000)
  const handleMint = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/central-bank/mint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractAddress, toAddress: mintData.to, amount: mintData.amount })
      });
      const data = await res.json();
      if (res.ok) setMessage({ type: 'success', text: `Émission réussie ! Hash : ${data.txHash}` });
      else setMessage({ type: 'error', text: data.error });
    } catch (err) {
      setMessage({ type: 'error', text: "Impossible de contacter le serveur backend (port 5000)." });
    }
  };

  const handleKYC = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/bank/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contractAddress, citizenAddress: kycData.address, status: kycData.status })
      });
      const data = await res.json();
      if (res.ok) setMessage({ type: 'success', text: data.message });
      else setMessage({ type: 'error', text: data.error });
    } catch (err) {
      setMessage({ type: 'error', text: "Erreur de connexion au serveur backend." });
    }
  };

  const handleCheckBalance = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`http://localhost:5000/api/citizen/balance?contractAddress=${contractAddress}&userAddress=${citizenAddress}`);
      const data = await res.json();
      if (res.ok) setBalanceResult(data.balance);
      else setMessage({ type: 'error', text: data.error });
    } catch (err) {
      setMessage({ type: 'error', text: "Erreur lors de la récupération du solde." });
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* HEADER INSTITUTIONNEL */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex justify-between items-center shadow-md">
        <div className="flex items-center space-x-3">
          <div className="bg-blue-600 p-2.5 rounded-xl shadow-lg shadow-blue-600/30">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-wider text-white">e-CDF PLATEFORM</h1>
            <p className="text-xs text-slate-400">Monnaie Numérique de Banque Centrale (Réseau Besu QBFT)</p>
          </div>
        </div>
        
        {/* Champ global d'adresse du contrat */}
        <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700 text-xs">
          <span className="text-slate-400 font-medium">Contrôleur Smart Contract :</span>
          <input 
            type="text" 
            value={contractAddress} 
            onChange={(e) => setContractAddress(e.target.value)}
            className="bg-transparent text-blue-400 font-mono outline-none w-72"
          />
        </div>
      </header>

      {/* BANDEAU DE NOTIFICATION */}
      {message && (
        <div className={`mx-6 mt-4 p-4 rounded-xl flex items-center justify-between border ${message.type === 'success' ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/40 border-rose-500/30 text-rose-400'}`}>
          <div className="flex items-center space-x-2">
            {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
            <span className="text-sm font-medium">{message.text}</span>
          </div>
          <button onClick={() => setMessage(null)} className="text-xs underline hover:opacity-75">Fermer</button>
        </div>
      )}

      {/* NAVIGATION PRINCIPALE PAR ONGLET */}
      <div className="flex justify-center my-6">
        <div className="bg-slate-950 p-1.5 rounded-2xl border border-slate-800 flex space-x-2 shadow-inner">
          <button
            onClick={() => setActiveTab('central')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'central' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <Landmark className="w-4 h-4" />
            <span>Banque Centrale</span>
          </button>
          
          <button
            onClick={() => setActiveTab('bank')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'bank' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <Users className="w-4 h-4" />
            <span>Banques Commerciales (KYC)</span>
          </button>

          <button
            onClick={() => setActiveTab('citizen')}
            className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === 'citizen' ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            <Wallet className="w-4 h-4" />
            <span>Portefeuille Citoyen</span>
          </button>
        </div>
      </div>

      {/* CONTENU DES ONGLETS */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 pb-12">
        
        {/* ONGLET 1 : BANQUE CENTRALE */}
        {activeTab === 'central' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Landmark className="w-5 h-5 text-blue-500" />
                <span>Console d'Émission Monétaire (Banque Centrale)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Émettez de nouveaux e-CDF ou régulez la masse monétaire globale du réseau.</p>
            </div>

            <form onSubmit={handleMint} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Adresse du Destinataire (Compte)</label>
                  <input 
                    type="text" 
                    placeholder="0x..." 
                    value={mintData.to}
                    onChange={(e) => setMintData({ ...mintData, to: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1">Montant à émettre (e-CDF)</label>
                  <input 
                    type="number" 
                    placeholder="1000" 
                    value={mintData.amount}
                    onChange={(e) => setMintData({ ...mintData, amount: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 font-mono"
                    required
                  />
                </div>
              </div>
              <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2">
                <span>Émettre les e-CDF (Mint)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* ONGLET 2 : BANQUES COMMERCIALES */}
        {activeTab === 'bank' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Users className="w-5 h-5 text-emerald-500" />
                <span>Portail de Conformité & KYC (Banque Commerciale)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Validez l'identité des citoyens pour les autoriser à détenir et échanger des e-CDF.</p>
            </div>

            <form onSubmit={handleKYC} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Adresse du Citoyen</label>
                <input 
                  type="text" 
                  placeholder="0x..." 
                  value={kycData.address}
                  onChange={(e) => setKycData({ ...kycData, address: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 font-mono"
                  required
                />
              </div>
              <div className="flex items-center space-x-3">
                <input 
                  type="checkbox" 
                  id="kycStatus"
                  checked={kycData.status}
                  onChange={(e) => setKycData({ ...kycData, status: e.target.checked })}
                  className="w-4 h-4 rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0"
                />
                <label htmlFor="kycStatus" className="text-sm text-slate-300">Approuver le statut KYC pour cette adresse</label>
              </div>
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-emerald-600/20">
                Mettre à jour le KYC
              </button>
            </form>
          </div>
        )}

        {/* ONGLET 3 : PORTEFEUILLE CITOYEN */}
        {activeTab === 'citizen' && (
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center space-x-2">
                <Wallet className="w-5 h-5 text-cyan-500" />
                <span>Mon Portefeuille e-CDF (Citoyen)</span>
              </h2>
              <p className="text-xs text-slate-400 mt-1">Consultez votre solde en temps réel directement sur le registre de la blockchain.</p>
            </div>

            <form onSubmit={handleCheckBalance} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">Votre Adresse de Portefeuille</label>
                <input 
                  type="text" 
                  placeholder="0x..." 
                  value={citizenAddress}
                  onChange={(e) => setCitizenAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-cyan-500 font-mono"
                  required
                />
              </div>
              <button type="submit" className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-semibold py-3 rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center space-x-2">
                <RefreshCw className="w-4 h-4" />
                <span>Consulter mon Solde</span>
              </button>
            </form>

            {balanceResult !== null && (
              <div className="bg-slate-900 border border-slate-800 p-6 rounded-xl text-center space-y-2">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Solde Disponible</p>
                <p className="text-4xl font-extrabold text-cyan-400">{balanceResult} <span className="text-lg font-normal text-slate-400">e-CDF</span></p>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}